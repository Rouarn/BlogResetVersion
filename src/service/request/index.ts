import router from '@/router'
import { useAuthStore } from '@/stores/modules/auth'
import { RequestError, type RequestErrorType } from './requestError'
import servicePort from './servicePort'
import { getReasonForError } from './utils'
import { ResultEnum, RouteNameEnum } from '@/enum'
import { type BackendFailError, createVakaoAxios, type FlatRequestInstanceConfig } from '@vakao-ui/axios'
import axios, { type AxiosError, type AxiosResponse, type InternalAxiosRequestConfig } from 'axios'

/* ===================== 类型定义 ===================== */

/**
 * 扩展 Axios 错误类型，包含自定义属性
 */
interface ExtendedAxiosError extends AxiosError {
  isBackendFail?: BackendFailError['isBackendFail']
  retryPromise?: Promise<unknown>
}

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
export interface CustomAxiosRequestConfig extends FlatRequestInstanceConfig {
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
    onRequest: async (config: InternalAxiosRequestConfig) => {
      const authStore = useAuthStore()
      const token = authStore.token
      if (token) {
        config.headers.set('Authorization', `${authStore.tokenType} ${token}`)
      }

      const customConfig = config as CustomAxiosRequestConfig

      // 处理 cancel
      if (customConfig.cancel === false) {
        customConfig.cancelDuplicateRequest = false
      }

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
    isBackendSuccess: (response: AxiosResponse<App.Service.Response<unknown>>) => {
      return (response.data as App.Service.Response<unknown>).code === ResultEnum.SUCCESS
    },
    transformBackendResponse: (response: AxiosResponse<App.Service.Response<unknown>>) => {
      const cfg = response.config as CustomAxiosRequestConfig
      if (cfg.loading) loadingManager.close()
      if (cfg.isDownload) return response.data as unknown
      return response.data
    },
    onBackendFail: async (response: AxiosResponse<App.Service.Response<unknown>>) => {
      const cfg = response.config as CustomAxiosRequestConfig
      if (cfg?.loading) loadingManager.close()
    },
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
        const success = await refreshTokenOnce()
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
      cancel: config.cancel ?? true,
      skipErrorHandler: config.skipErrorHandler ?? false,
      skipAuthRefresh: config.skipAuthRefresh ?? false,
      isUpload: config.isUpload ?? false,
      isDownload: config.isDownload ?? false,
      responseType: config.responseType,
      headers: config.headers,
    }

    const res = await service.request<App.Service.Response<T>>(requestConfig)

    if (requestConfig.isDownload) {
      return {
        data: res as unknown as T,
        error: false,
        message: 'success',
      }
    }

    const safeData = res as { data?: unknown; message?: string; msg?: string }
    return {
      data: safeData?.data as T,
      error: false,
      message: safeData?.message || safeData?.msg || 'success',
    }
  } catch (err) {
    const retryPromise = (err as ExtendedAxiosError)?.retryPromise
    if (retryPromise) {
      try {
        const rerun = await retryPromise
        if (config.isDownload) {
          return {
            data: rerun as unknown as T,
            error: false,
            message: 'success',
          }
        }
        const safeData = rerun as { data?: unknown; message?: string; msg?: string }
        return {
          data: safeData?.data as T,
          error: false,
          message: safeData?.message || safeData?.msg || 'success',
        }
      } catch (retryErr) {
        err = retryErr
      }
    }

    let reqError: RequestError
    const extendedErr = err as ExtendedAxiosError
    if (extendedErr?.isBackendFail && extendedErr?.response) {
      const resp = extendedErr.response as AxiosResponse<App.Service.Response<unknown>>
      const formattedMessage = getReasonForError(resp.data)
      reqError = new RequestError('business', formattedMessage, resp.data?.code, resp.data)
    } else if (axios.isCancel(err) || extendedErr?.message === 'RequestCanceled') {
      reqError = new RequestError('cancel', '请求已取消', 'CANCEL', err)
    } else if (err instanceof RequestError) {
      reqError = err
    } else {
      reqError = RequestError.fromAxiosError(err as AxiosError)
    }

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
