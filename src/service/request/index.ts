import router from '@/router'
import { useAuthStore } from '@/stores/modules/auth'
import { RequestError, type RequestErrorType } from './requestError'
import servicePort from './servicePort'
import { getReasonForError } from './utils'
import { ResultEnum, RouteNameEnum } from '@/enum'
import { type BackendFailError, createVakaoAxios, type FlatRequestInstanceConfig } from '@vakao-ui/axios'
import axios, { type AxiosError, type AxiosInstance, type AxiosResponse, type InternalAxiosRequestConfig } from 'axios'

/* ===================== 类型定义 ===================== */

/**
 * 扩展 Axios 错误类型，包含自定义属性
 */
interface ExtendedAxiosError extends AxiosError {
  isBackendFail?: BackendFailError['isBackendFail']
  retryPromise?: Promise<unknown>
}

export interface OptimizedResponse<T> {
  /** 响应数据 */
  data: T
  /** 是否有错误 */
  error: boolean
  /** 提示消息 */
  message: string
  /** 错误类型 */
  errorType?: RequestErrorType
  /** 原始错误对象 */
  rawError?: RequestError
}

/** 重试配置 */
export interface RequestRetryOptions {
  /** 重试次数，默认 0（即不重试） */
  count: number
  /** 每次重试延迟 ms */
  delay: number
}

/**
 * 扩展请求配置
 */
export interface CustomAxiosRequestConfig extends FlatRequestInstanceConfig {
  /** 是否开启全局 Loading (默认 true) */
  loading?: boolean
  /** 是否跳过全局错误提示 (默认 false) */
  skipErrorHandler?: boolean
  /** 是否跳过 401 刷新 (默认 false) */
  skipAuthRefresh?: boolean
  /** 是否为上传请求 (自动处理 Content-Type) */
  isUpload?: boolean
  /** 是否为下载请求 (返回 Blob/Response) */
  isDownload?: boolean
  /** 内部字段：是否已刷新过 Token */
  __retriedAfterRefresh?: boolean
}

/* ===================== Loading 管理 ===================== */

/**
 * Loading 管理器
 * @description 防止重复触发 Loading，只有当计数器为 0 时才显示/隐藏
 */
class LoadingManager {
  private count = 0

  /** 开启 Loading */
  open() {
    if (this.count === 0) window.$loading?.open()
    this.count++
  }

  /** 关闭 Loading */
  close() {
    this.count = Math.max(0, this.count - 1)
    if (this.count === 0) window.$loading?.close()
  }
}

const loadingManager = new LoadingManager()

/* ===================== Token 刷新 ===================== */

const ENABLE_TOKEN_REFRESH = String(import.meta.env.VITE_ENABLE_TOKEN_REFRESH || 'N').toUpperCase() === 'Y'

let refreshPromise: Promise<boolean> | null = null

/**
 * 刷新 Token
 * @description 这是一个单例模式的刷新 Token 方法，防止并发请求多次刷新
 */
async function refreshTokenOnce(axiosInstance: AxiosInstance): Promise<boolean> {
  if (refreshPromise) return refreshPromise

  const authStore = useAuthStore()
  if (!authStore.refreshToken) return false

  refreshPromise = (async () => {
    try {
      const response = await axiosInstance.post<App.Service.Response<Api.Auth.LoginToken>>(
        `${servicePort.auth}/refresh`,
        { refreshToken: authStore.refreshToken },
        { baseURL: import.meta.env.VITE_SERVICE_BASE_URL },
      )

      const { data } = response.data
      if (response.data.code !== ResultEnum.SUCCESS || !data?.accessToken) {
        return false
      }

      authStore.setToken(data.accessToken)
      authStore.setTokenType(data.tokenType || 'Bearer')
      if (data.refreshToken) authStore.setRefreshToken(data.refreshToken)
      return true
    } catch {
      return false
    }
  })()

  try {
    return await refreshPromise
  } finally {
    refreshPromise = null
  }
}

/* ===================== Axios 实例与拦截器 ===================== */

/** 创建 Axios 实例 */
const service = createVakaoAxios<App.Service.Response<unknown>>(
  {
    baseURL: import.meta.env.VITE_SERVICE_BASE_URL,
    timeout: Number(ResultEnum.TIMEOUT) || 10000,
    withCredentials: true,
    cancelDuplicateRequest: true,
    headers: {
      'X-Api-Version': 1,
    },
  },
  {
    /** 请求拦截器 */
    onRequest: async (config: InternalAxiosRequestConfig) => {
      const authStore = useAuthStore()
      const token = authStore.token
      if (token) {
        config.headers.set('Authorization', `${authStore.tokenType} ${token}`)
      }

      const customConfig = config as CustomAxiosRequestConfig

      // 处理 loading
      if (customConfig.loading && !customConfig.isUpload) {
        loadingManager.open()
      }

      // 处理 upload
      if (customConfig.isUpload) {
        config.headers.set('Content-Type', 'multipart/form-data')
      }

      return config
    },
    /** 判断后端请求是否成功 */
    isBackendSuccess: (response: AxiosResponse<App.Service.Response<unknown>>) => {
      return (response.data as App.Service.Response<unknown>).code === ResultEnum.SUCCESS
    },
    /** 转换后端响应数据 */
    transformBackendResponse: (response: AxiosResponse<App.Service.Response<unknown>>) => {
      const cfg = response.config as CustomAxiosRequestConfig
      if (cfg.loading) loadingManager.close()
      if (cfg.isDownload) return response.data as unknown
      return response.data
    },
    /** 后端请求失败处理 (code !== SUCCESS) */
    onBackendFail: async (response: AxiosResponse<App.Service.Response<unknown>>) => {
      const cfg = response.config as CustomAxiosRequestConfig
      if (cfg?.loading) loadingManager.close()
    },
    /** 请求错误处理 (Network Error, Timeout, etc.) */
    onError: async (error: AxiosError | Error) => {
      const err = error as ExtendedAxiosError
      const config = (err.config || err.response?.config) as CustomAxiosRequestConfig | undefined
      if (config?.loading) loadingManager.close()

      let reqError: RequestError
      if (err.isBackendFail && err.response) {
        const resp = err.response as AxiosResponse<App.Service.Response<unknown>>
        const formattedMessage = getReasonForError(resp.data)
        reqError = new RequestError('business', formattedMessage, resp.data?.code, resp.data)
      } else if (axios.isCancel(error) || err.message === 'RequestCanceled') {
        reqError = new RequestError('cancel', '请求已取消', 'CANCEL', error)
      } else {
        reqError = RequestError.fromAxiosError(error as AxiosError)
      }

      if (reqError.type === 'cancel') {
        return
      }

      if (ENABLE_TOKEN_REFRESH && reqError.type === 'overdue' && config && !config.skipAuthRefresh && !config.__retriedAfterRefresh) {
        const success = await refreshTokenOnce(service.instance)
        if (success && config) {
          config.__retriedAfterRefresh = true
          ;(error as ExtendedAxiosError).retryPromise = service.instance.request(config as InternalAxiosRequestConfig)
          return
        }
        useAuthStore().setToken('')
        await router.replace(`/${RouteNameEnum.LOGIN}`)
      }

      if (config && !config.skipErrorHandler) {
        window.$message?.error(reqError.message)
      }
    },
  },
)

/* ===================== 请求方法封装 ===================== */

/**
 * 构建成功响应
 * @param payload 响应数据
 * @param isDownload 是否为下载请求
 * @returns 优化后的响应对象
 */
function buildSuccessResponse<T>(payload: unknown, isDownload: boolean): OptimizedResponse<T> {
  if (isDownload) {
    return {
      data: payload as T,
      error: false,
      message: 'success',
    }
  }
  const safeData = payload as { data?: unknown; message?: string; msg?: string }
  return {
    data: safeData?.data as T,
    error: false,
    message: safeData?.message || safeData?.msg || 'success',
  }
}

/**
 * 转换为请求错误对象
 * @param err 原始错误对象
 * @returns 格式化后的请求错误对象
 */
function toRequestError(err: unknown): RequestError {
  const extendedErr = err as BackendFailError
  if (extendedErr?.isBackendFail && extendedErr?.response) {
    const resp = extendedErr.response as AxiosResponse<App.Service.Response<unknown>>
    const formattedMessage = getReasonForError(resp.data)
    return new RequestError('business', formattedMessage, resp.data?.code, resp.data)
  } else if (axios.isCancel(err) || extendedErr?.message === 'RequestCanceled') {
    return new RequestError('cancel', '请求已取消', 'CANCEL', err)
  } else if (err instanceof RequestError) {
    return err
  } else {
    return RequestError.fromAxiosError(err as AxiosError)
  }
}

/**
 * 发送请求
 * @param method 请求方法
 * @param url 请求地址
 * @param data 请求数据 (params or data)
 * @param config 请求配置
 */
async function sendRequest<T>(
  method: string,
  url: string,
  data?: unknown,
  config: Partial<CustomAxiosRequestConfig> = {},
): Promise<OptimizedResponse<T>> {
  try {
    const isGet = method === 'GET'
    const requestConfig: CustomAxiosRequestConfig = {
      url,
      method,
      params: isGet ? data : undefined,
      data: isGet ? undefined : data,
      loading: config.loading ?? true,
      cancelDuplicateRequest: config.cancelDuplicateRequest ?? true,
      skipErrorHandler: config.skipErrorHandler ?? false,
      skipAuthRefresh: config.skipAuthRefresh ?? false,
      isUpload: config.isUpload ?? false,
      isDownload: config.isDownload ?? false,
      responseType: config.responseType,
      headers: config.headers,
    }

    const res = await service.request<App.Service.Response<T>>(requestConfig)
    return buildSuccessResponse<T>(res, !!requestConfig.isDownload)
  } catch (err) {
    const retryPromise = (err as ExtendedAxiosError)?.retryPromise
    if (retryPromise) {
      try {
        const rerun = await retryPromise
        return buildSuccessResponse<T>(rerun, !!config.isDownload)
      } catch (retryErr) {
        err = retryErr
      }
    }

    const reqError = toRequestError(err)

    return {
      data: null as T,
      error: true,
      message: reqError.message,
      errorType: reqError.type,
      rawError: reqError,
    }
  }
}

export const request = {
  /** 发送 GET 请求 */
  get<T>(url: string, params?: object, config?: Partial<CustomAxiosRequestConfig>) {
    return sendRequest<T>('GET', url, params, config)
  },

  /** 发送 POST 请求 */
  post<T>(url: string, data?: unknown, config?: Partial<CustomAxiosRequestConfig>) {
    return sendRequest<T>('POST', url, data, config)
  },

  /** 发送 PUT 请求 */
  put<T>(url: string, data?: unknown, config?: Partial<CustomAxiosRequestConfig>) {
    return sendRequest<T>('PUT', url, data, config)
  },

  /** 发送 DELETE 请求 */
  delete<T>(url: string, params?: object, config?: Partial<CustomAxiosRequestConfig>) {
    return sendRequest<T>('DELETE', url, params, config)
  },

  /** 发送 PATCH 请求 */
  patch<T>(url: string, data?: unknown, config?: Partial<CustomAxiosRequestConfig>) {
    return sendRequest<T>('PATCH', url, data, config)
  },

  /** 上传文件 (自动设置 Content-Type: multipart/form-data) */
  upload<T>(url: string, form: FormData, config?: Partial<CustomAxiosRequestConfig>) {
    return sendRequest<T>('POST', url, form, { ...config, isUpload: true })
  },

  /** 下载文件 (返回 Blob) */
  download(url: string, params?: object, config?: Partial<CustomAxiosRequestConfig>) {
    return sendRequest<Blob>('POST', url, params, {
      ...config,
      isDownload: true,
      responseType: 'blob',
    })
  },

  /** 取消所有请求 */
  cancelAll() {
    service.cancelAll()
  },

  /** 暴露原始 Axios 实例 */
  instance: service,
}

export default request
