import router from '@/router'
import { useAuthStore } from '@/stores/modules/auth'
import { RequestError, type RequestErrorType } from './requestError'
import servicePort from './servicePort'
import { getReasonForError } from './utils'
import { ResultEnum, RouteNameEnum } from '@/enum'
import { createVakaoAxios, type VakaoInstanceConfig } from '@vakao-ui/axios'
import axios, { type AxiosError, type AxiosRequestConfig, type AxiosResponse, type InternalAxiosRequestConfig } from 'axios'

/* ===================== 类型定义 ===================== */

export interface OptimizedResponse<T> {
  data: T
  error: boolean
  message: string
  errorType?: RequestErrorType
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
export interface CustomAxiosRequestConfig extends Omit<VakaoInstanceConfig, 'retry'> {
  /** 是否开启全局 Loading (默认 true) */
  loading?: boolean
  /** 是否开启重复请求取消 (默认 true) */
  cancel?: boolean
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
  /** 重试配置 */
  retry?: RequestRetryOptions
}

/* ===================== Loading 管理 ===================== */

class LoadingManager {
  private count = 0

  open() {
    if (this.count === 0) window.$loading?.open()
    this.count++
  }

  close() {
    this.count = Math.max(0, this.count - 1)
    if (this.count === 0) window.$loading?.close()
  }
}

const loadingManager = new LoadingManager()

/* ===================== Token 刷新 ===================== */

const ENABLE_TOKEN_REFRESH = String(import.meta.env.VITE_ENABLE_TOKEN_REFRESH || 'N').toUpperCase() === 'Y'
let refreshPromise: Promise<boolean> | null = null

async function refreshTokenOnce(): Promise<boolean> {
  if (refreshPromise) return refreshPromise

  const authStore = useAuthStore()
  if (!authStore.refreshToken) return false

  refreshPromise = (async () => {
    try {
      const cleanAxios = axios.create()
      const response = await cleanAxios.post<App.Service.Response<Api.Auth.LoginToken>>(
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

const service = createVakaoAxios({
  // 接口根地址
  baseURL: import.meta.env.VITE_SERVICE_BASE_URL,
  // 请求超时时间（默认 10s）
  timeout: Number(ResultEnum.TIMEOUT) || 10000,
  // 跨域携带凭证
  withCredentials: true,
  // 默认不重试
  retry: 0,
  // 默认开启取消重复请求
  cancelDuplicateRequest: true,

  interceptors: {
    requestInterceptor: (config: InternalAxiosRequestConfig) => {
      const cfg = config as unknown as CustomAxiosRequestConfig
      const authStore = useAuthStore()

      // 初始化默认配置
      cfg.loading ??= true
      cfg.headers ??= {}

      // 映射 cancel 到 cancelDuplicateRequest
      if (cfg.cancel === false) {
        cfg.cancelDuplicateRequest = false
      }

      // 全局 Loading
      if (cfg.loading && !cfg.isUpload) loadingManager.open()

      // 配置 Token
      if (authStore.token) {
        cfg.headers.Authorization = `${authStore.tokenType || 'Bearer'} ${authStore.token}`
      }

      // 配置上传请求头
      if (cfg.isUpload) {
        cfg.headers['Content-Type'] = 'multipart/form-data'
      }

      cfg.headers['X-Api-Version'] = 1

      return cfg as InternalAxiosRequestConfig
    },

    // 必须返回 AxiosResponse，因此使用 throw 抛出错误
    responseInterceptor: (response: AxiosResponse): AxiosResponse => {
      const { config, data } = response
      const cfg = config as CustomAxiosRequestConfig

      // 关闭 loading
      if (cfg.loading) loadingManager.close()

      // 处理下载请求
      if (cfg.isDownload) return response

      // 处理业务错误
      if (data.code !== ResultEnum.SUCCESS) {
        // 格式化错误信息
        const formattedMessage = getReasonForError(data)
        // 构造业务错误
        const err = new RequestError('business', formattedMessage, data.code, data)
        throw err
      }

      return response
    },

    responseInterceptorCatch: async (error: AxiosError) => {
      const config = error.config as CustomAxiosRequestConfig | undefined

      // 关闭 loading
      if (config?.loading) loadingManager.close()

      // 转换为标准 RequestError
      let reqError: RequestError
      if (error instanceof RequestError) {
        reqError = error
      } else if (axios.isCancel(error) || error.message === 'RequestCanceled') {
        reqError = new RequestError('cancel', '请求已取消', 'CANCEL', error)
      } else {
        reqError = RequestError.fromAxiosError(error as AxiosError)
      }

      // 如果是取消请求，静默处理（不报错）
      if (reqError.type === 'cancel') {
        return Promise.reject(reqError)
      }

      // 401 Token 过期处理
      if (ENABLE_TOKEN_REFRESH && reqError.type === 'overdue' && config && !config.skipAuthRefresh && !config.__retriedAfterRefresh) {
        const success = await refreshTokenOnce()
        if (success) {
          config.__retriedAfterRefresh = true
          // 刷新成功，重试原请求
          return service.request(config as InternalAxiosRequestConfig)
        }
        // 刷新失败，强制退出
        useAuthStore().setToken('')
        await router.replace(`/${RouteNameEnum.LOGIN}`)
        return Promise.reject(reqError)
      }

      // 全局错误提示
      if (config && !config.skipErrorHandler) {
        window.$message?.error(reqError.message)
      }

      return Promise.reject(reqError)
    },
  },
})

/* ===================== 请求方法封装 ===================== */

async function sendRequest<T>(
  method: string,
  url: string,
  data?: unknown,
  config: Partial<CustomAxiosRequestConfig> = {},
): Promise<OptimizedResponse<T>> {
  try {
    const isGet = method === 'GET'

    // 构造符合 vakao-axios 的配置
    // 分离出 retry 配置，避免类型冲突
    const { retry, ...rest } = config

    const requestConfig = {
      url,
      method,
      params: isGet ? data : undefined,
      data: isGet ? undefined : data,
      loading: true,
      cancel: true,
      ...rest,
    } as AxiosRequestConfig & { retry?: number; retryDelay?: number }

    // 映射 retry 配置
    if (retry) {
      requestConfig.retry = retry.count
      requestConfig.retryDelay = retry.delay
    }

    const res = await service.request<App.Service.Response<T>>(requestConfig)
    const responseData = res.data

    // 直接返回下载结果
    if (config.isDownload) {
      return {
        data: res as unknown as T,
        error: false,
        message: 'success',
      }
    }

    const safeData = responseData as { data?: unknown; message?: string }
    return {
      data: safeData?.data as T,
      error: false,
      message: safeData?.message || 'success',
    }
  } catch (err) {
    const reqError = err as RequestError
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
  get<T>(url: string, params?: object, config?: Partial<CustomAxiosRequestConfig>) {
    return sendRequest<T>('GET', url, params, config)
  },

  post<T>(url: string, data?: unknown, config?: Partial<CustomAxiosRequestConfig>) {
    return sendRequest<T>('POST', url, data, config)
  },

  put<T>(url: string, data?: unknown, config?: Partial<CustomAxiosRequestConfig>) {
    return sendRequest<T>('PUT', url, data, config)
  },

  delete<T>(url: string, params?: object, config?: Partial<CustomAxiosRequestConfig>) {
    return sendRequest<T>('DELETE', url, params, config)
  },

  patch<T>(url: string, data?: unknown, config?: Partial<CustomAxiosRequestConfig>) {
    return sendRequest<T>('PATCH', url, data, config)
  },

  upload<T>(url: string, form: FormData, config?: Partial<CustomAxiosRequestConfig>) {
    return sendRequest<T>('POST', url, form, { ...config, isUpload: true })
  },

  download(url: string, params?: object, config?: Partial<CustomAxiosRequestConfig>) {
    return sendRequest<Blob>('POST', url, params, {
      ...config,
      isDownload: true,
      responseType: 'blob',
    })
  },

  cancelAll() {
    service.cancelAll()
  },

  // 暴露原始实例
  instance: service,
}

export default request
