import router from '@/router'
import { useAuthStore } from '@/stores/modules/auth'
import { AxiosCanceler, REQUEST_CANCEL_ERROR } from './axiosCancel'
import { checkStatus, isServerError } from './checkStatus'
import { computeRetryDelay } from './utils'
import { ResultEnum } from '@/enum'
import type { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import axios from 'axios'

/* ---------------- 类型与结构 ---------------- */
/**
 * 错误类型标识
 */
export type ErrorType = 'overdue' | 'business' | 'network' | 'timeout' | 'cancel' | 'server'

/**
 * 统一返回结构（支持顶层解构 data、error、message）：
 * - 始终包含：error(boolean)、message(string)、data(T)
 * - 当 error=true 时：message 为错误文案，data 为 null（运行时），类型上仍为 T 以便通过 if(error) 收窄后使用
 * - 当 error=false 时：message 为空字符串，data 为后端数据（可能为 null，如更新类接口）
 */
export type OptimizedResponse<T> = { error: boolean; message: string; data: T; errorType?: ErrorType }

interface ExtendedAxiosResponse<T = unknown> extends AxiosResponse<App.Service.Response<T>> {
  __isError?: boolean
  __errorType?: ErrorType
}

export interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  loading?: boolean
  cancel?: boolean
  retry?: {
    count: number
    delay: number
    maxDelay?: number
    backoff?: 'linear' | 'exponential'
    jitter?: boolean
    retryCondition?: (error: AxiosError) => boolean
  }
  isUpload?: boolean
  isDownload?: boolean
  customErrorMessage?: string
  skipErrorHandler?: boolean
  skipAuthRefresh?: boolean
  __retryCount?: number
  __retriedAfterRefresh?: boolean
}

/* ---------------- Loading 管理（全局请求动效） ---------------- */
let loadingCount = 0

function openLoading() {
  if (loadingCount === 0) window.$loading?.open()
  loadingCount++
}

function closeLoading() {
  loadingCount = Math.max(0, loadingCount - 1)
  if (loadingCount === 0) window.$loading?.close()
}

/* ---------------- 默认配置与重试策略 ---------------- */
const DEFAULT_RETRY_CONFIG = {
  count: 2,
  delay: 1000,
  maxDelay: 8000,
  backoff: 'exponential' as const,
  jitter: true,
  retryCondition: (error: AxiosError) => {
    if (!error.response) return true
    return isServerError(error.response.status)
  },
}

const axiosConfig: AxiosRequestConfig = {
  baseURL: import.meta.env.VITE_SERVICE_BASE_URL as string,
  timeout: ResultEnum.TIMEOUT as number,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json;charset=UTF-8',
  },
}

const axiosCanceler = new AxiosCanceler()

/* ---------------- 工具函数 ---------------- */
const sleep = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms))

/** 提取 AxiosError 的后端 message，若无则使用 fallback */
function getBackendMessageFromAxiosError(error: AxiosError<App.Service.Response>, fallback: string): string {
  const backendMessage = error.response?.data?.message
  return backendMessage || fallback
}

/** 提取业务响应的后端 message，若无则使用 fallback */
function getBackendMessageFromResponse<T>(response: ExtendedAxiosResponse<T>, fallback: string): string {
  const backendMessage = response.data?.message
  return backendMessage || fallback
}

/* ---------------- Token 刷新管理 ---------------- */
const ENABLE_TOKEN_REFRESH = String(import.meta.env.VITE_ENABLE_TOKEN_REFRESH || 'N').toUpperCase() === 'Y'
const TOKEN_REFRESH_BUFFER_MS = 30_000

let isRefreshing = false
let refreshPromise: Promise<boolean> | null = null

async function refreshTokenOnce(): Promise<boolean> {
  if (!ENABLE_TOKEN_REFRESH) return false
  if (isRefreshing && refreshPromise) return refreshPromise

  const authStore = useAuthStore()
  if (!authStore.refreshToken) return false
  const rExp = Number(authStore.refreshTokenExpiresAt || 0)
  if (rExp && Date.now() >= rExp) return false

  isRefreshing = true
  const doRefresh = async () => {
    // 动态引入以避免循环依赖
    const { fetchRefreshToken } = await import('@/service/api/login')
    const { data, error } = await fetchRefreshToken(authStore.refreshToken)
    if (error) return false
    authStore.setToken(data?.accessToken || '')
    authStore.setTokenType(data?.tokenType || 'Bearer')
    if (data?.refreshToken) authStore.setRefreshToken(data.refreshToken)
    const expiresIn = Number(data?.expiresIn || 0)
    if (expiresIn > 0) authStore.setTokenExpiresAt(Date.now() + expiresIn * 1000)
    const refreshExpiresIn = Number(data?.refreshExpiresIn || 0)
    if (refreshExpiresIn > 0) authStore.setRefreshTokenExpiresAt(Date.now() + refreshExpiresIn * 1000)
    return Boolean(data?.accessToken)
  }

  refreshPromise = doRefresh()
  try {
    const ok = await refreshPromise
    return ok
  } finally {
    isRefreshing = false
    refreshPromise = null
  }
}

function willTokenExpireSoon(): boolean {
  if (!ENABLE_TOKEN_REFRESH) return false
  const authStore = useAuthStore()
  const exp = Number(authStore.tokenExpiresAt || 0)
  if (!exp) return false
  return Date.now() >= exp - TOKEN_REFRESH_BUFFER_MS
}

/* ---------------- 请求类（统一封装发送、重试、错误提示） ---------------- */
class RequestHttp {
  private service: AxiosInstance

  constructor(config: AxiosRequestConfig) {
    this.service = axios.create(config)
    this.setupInterceptors()
  }

  private setupInterceptors() {
    // 请求拦截器
    this.service.interceptors.request.use(
      async (config: CustomAxiosRequestConfig) => {
        const userStore = useAuthStore()

        // 请求取消
        config.cancel ??= true
        if (config.cancel) axiosCanceler.addPending(config)

        // Loading
        config.loading ??= true
        if (config.loading && !config.isUpload) openLoading()

        // 预刷新（可选）：在过期窗口内先刷新
        if (!config.skipAuthRefresh && ENABLE_TOKEN_REFRESH && willTokenExpireSoon()) {
          await refreshTokenOnce()
        }

        // 请求头
        if (config.headers) {
          // axios 的 headers 可能是普通对象或 Headers 结构，安全判断
          try {
            // 设置 header
            if (userStore.token) config.headers['Authorization'] = `${userStore.tokenType || 'Bearer'} ${userStore.token}`
            if (config.isUpload) config.headers['Content-Type'] = 'multipart/form-data'
          } catch {
            // ignore
          }
        }

        return config
      },
      (error) => Promise.reject(error),
    )

    // 响应拦截器（错误分支使用类型守卫）
    this.service.interceptors.response.use(
      async (response: ExtendedAxiosResponse & { config: CustomAxiosRequestConfig }) => {
        const { config, data } = response

        // 移除 pending
        try {
          axiosCanceler.removePending(config)
        } catch {
          // ignore
        }

        if (config.loading) closeLoading()

        // 文件下载直接返回原始 response
        if (config.isDownload) return response

        // 登录过期：尝试刷新后重试原请求
        if (data?.code === ResultEnum.OVERDUE) {
          const authStore = useAuthStore()
          let refreshed = false
          if (ENABLE_TOKEN_REFRESH && authStore.refreshToken && !config.__retriedAfterRefresh) {
            refreshed = await refreshTokenOnce()
            if (refreshed) {
              const newConfig: CustomAxiosRequestConfig = { ...config, __retriedAfterRefresh: true }
              return this.service.request(newConfig)
            }
          }

          authStore.setToken('')
          router.replace('/_builtin/login')

          if (!config.skipErrorHandler) {
            window.$message?.error(data?.message || '登录已过期，请重新登录')
          }

          response.__isError = true
          response.__errorType = 'overdue'
          return response
        }

        // 业务错误判断（后端约定）
        if (typeof data?.code === 'number' && data.code !== ResultEnum.SUCCESS) {
          const msg = config.customErrorMessage || data.message || '请求失败'
          if (!config.skipErrorHandler) window.$message?.error(msg)

          response.__isError = true
          response.__errorType = 'business'
          return response
        }

        response.__isError = false
        return response
      },
      // 错误分支：使用 unknown + 类型守卫进行安全访问
      async (err: unknown) => {
        // 若是 axios cancel（优先判断）
        if (axios.isCancel(err)) {
          return Promise.reject(err)
        }

        // 只有当 err 是 AxiosError 时我们做进一步处理
        if (!axios.isAxiosError(err)) {
          // 非 axios 错误，按网络错误处理并返回
          // 关闭 loading（如果能找到 config）
          try {
            const maybeConfig = (err as { config?: CustomAxiosRequestConfig })?.config
            if (maybeConfig?.loading) closeLoading()
          } catch {
            // ignore
          }
          window.$message?.error('网络异常，请稍后重试')
          return Promise.reject(err)
        }

        // 到这里，err 已经被类型守卫为 AxiosError
        const error = err as AxiosError<App.Service.Response> & { config?: CustomAxiosRequestConfig }

        const config = error.config
        // 关闭 loading（有 config 且开启 loading）
        if (config?.loading) closeLoading()

        // 如果是我们自定义的取消标识，也直接 reject
        const rawMessage = typeof error.message === 'string' ? error.message : String(error.message ?? '')
        if (rawMessage.includes(REQUEST_CANCEL_ERROR)) {
          return Promise.reject(error)
        }

        if (!config?.skipErrorHandler) {
          if (!error.response) {
            // 无 response，可能是超时或网络错误
            if (rawMessage.includes('timeout')) {
              window.$message?.error('请求超时，请稍后重试')
            } else if (rawMessage.includes('Network Error')) {
              window.$message?.error('网络错误，请检查连接')
            } else {
              window.$message?.error('网络异常，请稍后重试')
            }
          } else {
            // 有响应；优先使用后端返回的message，如果没有则使用状态码对应的message
            const backendMessage = error.response.data?.message
            const status = error.response && typeof error.response.status === 'number' ? error.response.status : undefined

            if (backendMessage) {
              // 如果后端返回了message，直接使用
              window.$message?.error(backendMessage)
            } else if (typeof status === 'number') {
              // 如果没有后端message，使用状态码对应的message
              checkStatus(status, config?.customErrorMessage)
            }
          }
        }

        // 移除 pending（如果有 config）
        if (config) {
          try {
            axiosCanceler.removePending(config)
          } catch {
            // ignore
          }
        }

        // 401 未授权：尝试刷新后重试原请求（避免死循环）
        if (ENABLE_TOKEN_REFRESH && error.response?.status === 401 && config && !config.__retriedAfterRefresh) {
          const ok = await refreshTokenOnce()
          if (ok) {
            const newConfig: CustomAxiosRequestConfig = { ...config, __retriedAfterRefresh: true }
            return this.service.request(newConfig)
          }
        }

        // 自动重试：只有在配置存在并满足 shouldRetry 时才触发
        if (config && this.shouldRetry(error)) {
          return this.retryRequest(config, error)
        }

        return Promise.reject(error)
      },
    )
  }

  private transformResponse<T>(response: ExtendedAxiosResponse<T> | AxiosError<App.Service.Response>): OptimizedResponse<T> {
    if ('isAxiosError' in response) {
      // axios 层错误（超时、断网等），优先使用后端返回message
      const fallbackMessage = response.message || '网络错误'
      const message = getBackendMessageFromAxiosError(response, fallbackMessage)
      let type: ErrorType = 'network'
      const rawMsg = typeof response.message === 'string' ? response.message : String(response.message ?? '')
      if (rawMsg.includes('timeout')) type = 'timeout'
      else if (response.response?.status === 401) type = 'overdue'
      else if (typeof response.response?.status === 'number' && isServerError(response.response.status)) type = 'server'
      return { data: null as unknown as T, error: true, message, errorType: type }
    }

    if (response.__isError) {
      // 业务错误（比如后端返回 code != 200），优先使用后端返回message
      const message = getBackendMessageFromResponse(response, '请求失败')
      return { data: null as unknown as T, error: true, message, errorType: response.__errorType }
    }

    if ((response.config as CustomAxiosRequestConfig)?.isDownload) {
      // 下载类请求，直接返回原始 response
      return { data: response as unknown as T, error: false, message: '' }
    }

    const responseData = (response.data?.data ?? null) as unknown as T

    return { data: responseData, error: false, message: '' }
  }

  private shouldRetry(error: AxiosError): boolean {
    const config = error.config as CustomAxiosRequestConfig | undefined
    if (!config?.retry) return false

    const currentRetryCount = config.__retryCount || 0
    if (currentRetryCount >= config.retry.count) return false

    const retryCondition = config.retry.retryCondition || DEFAULT_RETRY_CONFIG.retryCondition
    return retryCondition(error)
  }

  private async retryRequest(config: CustomAxiosRequestConfig, _error: AxiosError): Promise<OptimizedResponse<unknown>> {
    const retryCfg = { ...DEFAULT_RETRY_CONFIG, ...config.retry }
    const attempt = (config.__retryCount || 0) + 1
    config.__retryCount = attempt

    const delay = computeRetryDelay(attempt, retryCfg.delay, {
      backoff: retryCfg.backoff,
      jitter: retryCfg.jitter,
      maxDelay: retryCfg.maxDelay,
    })

    await sleep(delay)

    try {
      const response = await this.service.request(config)
      return this.transformResponse(response)
    } catch (retryError) {
      return this.transformResponse(retryError as AxiosError<App.Service.Response>)
    }
  }

  /** 通用发送方法（统一 GET/POST/PUT/PATCH/DELETE） */
  private async send<T>(
    method: CustomAxiosRequestConfig['method'],
    url: string,
    dataOrParams?: unknown,
    config: Partial<CustomAxiosRequestConfig> = {},
  ): Promise<OptimizedResponse<T>> {
    try {
      const isParams = method === 'GET' || method === 'DELETE'
      const response = await this.service.request<App.Service.Response<T>>({
        url,
        method,
        ...(isParams ? { params: dataOrParams } : { data: dataOrParams }),
        ...config,
      })

      return this.transformResponse<T>(response)
    } catch (error) {
      return this.transformResponse<T>(error as AxiosError<App.Service.Response>)
    }
  }

  get<T = unknown>(url: string, params?: object, config?: Partial<CustomAxiosRequestConfig>) {
    return this.send<T>('GET', url, params, config)
  }
  post<T = unknown>(url: string, data?: unknown, config?: Partial<CustomAxiosRequestConfig>) {
    return this.send<T>('POST', url, data, config)
  }
  put<T = unknown>(url: string, data?: unknown, config?: Partial<CustomAxiosRequestConfig>) {
    return this.send<T>('PUT', url, data, config)
  }
  patch<T = unknown>(url: string, data?: unknown, config?: Partial<CustomAxiosRequestConfig>) {
    return this.send<T>('PATCH', url, data, config)
  }
  delete<T = unknown>(url: string, params?: unknown, config?: Partial<CustomAxiosRequestConfig>) {
    return this.send<T>('DELETE', url, params, config)
  }

  upload<T = unknown>(url: string, formData: FormData, config?: Partial<CustomAxiosRequestConfig>) {
    return this.send<T>('POST', url, formData, { ...config, isUpload: true })
  }

  download(url: string, params?: object, config?: Partial<CustomAxiosRequestConfig>) {
    return this.send<AxiosResponse<Blob>>('POST', url, params, {
      ...config,
      isDownload: true,
      responseType: 'blob',
    })
  }

  cancelAllRequests(reason?: string) {
    axiosCanceler.removeAllPending(reason)
  }

  getPendingRequestCount() {
    return axiosCanceler.getPendingCount()
  }

  isPending(config: CustomAxiosRequestConfig): boolean {
    return axiosCanceler.isPending(config)
  }
}

/* ---------------- 导出实例 ---------------- */
const httpRequest = new RequestHttp(axiosConfig)
export const request = httpRequest
export default httpRequest
