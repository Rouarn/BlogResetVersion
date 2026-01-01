import router from '@/router'
import { useAuthStore } from '@/stores/modules/auth'
import { REQUEST_CANCEL_MSG, RequestCanceler } from './axiosCancel'
import { RequestError, type RequestErrorType } from './requestError'
import servicePort from './servicePort'
import { ResultEnum, RouteNameEnum } from '@/enum'
import axios, {
  type AxiosError,
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from 'axios'

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
export interface CustomAxiosRequestConfig extends AxiosRequestConfig {
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
  /** 重试配置（默认不重试！） */
  retry?: RequestRetryOptions
  /** 内部字段：当前重试次数 */
  __retryCount?: number
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

/* ===================== 工具函数 ===================== */

/** 延迟函数 */
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

/** 判断是否应该重试 */
function shouldRetry(error: RequestError, config?: CustomAxiosRequestConfig): boolean {
  if (!config || !config.retry || config.retry.count <= 0) return false

  // 仅针对网络错误、超时、服务端错误(5xx)进行重试
  // 业务错误(business)、客户端错误(client)、取消(cancel)、401(overdue) 不重试
  return ['network', 'timeout', 'server'].includes(error.type)
}

/* ===================== Axios 实例与拦截器 ===================== */

const service: AxiosInstance = axios.create({
  // 接口根地址
  baseURL: import.meta.env.VITE_SERVICE_BASE_URL,
  // 请求超时时间（默认 10s）
  timeout: Number(ResultEnum.TIMEOUT) || 10000,
  // 跨域携带凭证
  withCredentials: true,
})

const requestCanceler = new RequestCanceler()

// 请求拦截器
service.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const cfg = config as unknown as CustomAxiosRequestConfig
    const authStore = useAuthStore()

    // 初始化默认配置
    cfg.cancel ??= true
    cfg.loading ??= true
    cfg.headers ??= {}

    // 全局 Loading
    if (cfg.loading && !cfg.isUpload) loadingManager.open()

    // 重复请求自动取消
    if (cfg.cancel) requestCanceler.addPending(cfg)

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
  (error) => Promise.reject(error),
)

// 响应拦截器
service.interceptors.response.use(
  (response: AxiosResponse) => {
    const { config, data } = response
    const cfg = config as CustomAxiosRequestConfig

    // 清理操作（移除 pending，关闭 loading）
    requestCanceler.removeRecord(cfg)
    if (cfg.loading) loadingManager.close()

    // 处理下载请求
    if (cfg.isDownload) return response

    // 处理业务错误
    if (data.code !== ResultEnum.SUCCESS) {
      // 构造业务错误
      const err = new RequestError('business', data.message || '请求失败', data.code, data)
      return Promise.reject(err)
    }

    return response
  },
  async (error: AxiosError) => {
    const config = error.config as CustomAxiosRequestConfig | undefined

    // 清理操作
    if (config) {
      requestCanceler.removeRecord(config)
      if (config.loading) loadingManager.close()
    }

    // 转换为标准 RequestError
    let reqError: RequestError
    if (error instanceof RequestError) {
      reqError = error
    } else if (axios.isCancel(error) || error.message === REQUEST_CANCEL_MSG) {
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
        return service.request(config)
      }
      // 刷新失败，强制退出
      useAuthStore().setToken('')
      await router.replace(`/${RouteNameEnum.LOGIN}`)
      return Promise.reject(reqError)
    }

    // 自动重试机制
    if (config && shouldRetry(reqError, config)) {
      config.__retryCount = config.__retryCount || 0
      const retryOpts = config.retry!

      if (config.__retryCount < retryOpts.count) {
        config.__retryCount++
        await delay(retryOpts.delay)
        // 显式传递 __retryCount 确保计数状态不丢失
        return service.request(config)
      }
    }

    // 全局错误提示
    if (config && !config.skipErrorHandler) {
      window.$message?.error(reqError.message)
    }

    return Promise.reject(reqError)
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
      retry: {
        count: 0,
        delay: 1000,
      },
      loading: true,
      cancel: true,
      ...config,
    }

    const res = await service.request<App.Service.Response<T>>(requestConfig)

    // 直接返回下载结果
    if (config.isDownload) {
      return {
        data: res as unknown as T,
        error: false,
        message: 'success',
      }
    }

    return {
      data: res.data?.data as T,
      error: false,
      message: res.data?.message || 'success',
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
    requestCanceler.removeAllPending()
  },

  // 暴露原始实例
  instance: service,
}

export default request
