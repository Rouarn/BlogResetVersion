/**
 * 统一请求封装（Axios）
 * - 加载状态：在请求发起/结束时控制全局 Loading
 * - 请求去重：同 key 重复请求自动取消，避免并发浪费
 * - 鉴权注入：自动附加 `Authorization`，并支持上传场景的 `Content-Type`
 * - 令牌刷新：401 时按需刷新一次，成功后自动重试原请求
 * - 统一出入口：仅通过 `send` 发送，返回标准化结果 `OptimizedResponse<T>`
 */
import router from '@/router'
import { useAuthStore } from '@/stores/modules/auth'
import { AxiosCanceler, REQUEST_CANCEL_ERROR } from './axiosCancel'
import { type ErrorType, normalizeAxiosError, type NormalizedError } from './checkStatus'
import servicePort from './servicePort'
import { ResultEnum } from '@/enum'
import axios, { type AxiosError, type AxiosInstance, type AxiosRequestConfig, HttpStatusCode, type InternalAxiosRequestConfig } from 'axios'

/* ===================== 类型 ===================== */

export type OptimizedResponse<T> = {
  data: T
  error: boolean
  message: string
  errorType?: ErrorType
}

/**
 * 扩展的 axios 请求配置
 * - loading：是否显示全局 Loading
 * - cancel：是否参与去重取消逻辑
 * - skipErrorHandler：是否跳过统一错误提示
 * - skipAuthRefresh：是否跳过 401 刷新处理
 * - isUpload：是否为上传请求（自动设置 Content-Type）
 * - isDownload：是否为下载请求（直接返回 response）
 * - customErrorMessage：自定义错误文案
 * - retry：重试参数（预留，目前由 401 刷新触发一次重试）
 * - __retryCount/__retriedAfterRefresh：内部标记，限制重试次数
 */
export interface CustomAxiosRequestConfig extends AxiosRequestConfig {
  loading?: boolean
  cancel?: boolean
  skipErrorHandler?: boolean
  skipAuthRefresh?: boolean
  isUpload?: boolean
  isDownload?: boolean
  customErrorMessage?: string
  retry?: {
    count: number
    delay: number
  }
  __retryCount?: number
  __retriedAfterRefresh?: boolean
}

/* ===================== Loading ===================== */

let loadingCount = 0

const openLoading = () => {
  if (loadingCount === 0) window.$loading?.open()
  loadingCount++
}

const closeLoading = () => {
  loadingCount = Math.max(0, loadingCount - 1)
  if (loadingCount === 0) window.$loading?.close()
}

/* ===================== Token Refresh ===================== */

const ENABLE_TOKEN_REFRESH = String(import.meta.env.VITE_ENABLE_TOKEN_REFRESH || 'N').toUpperCase() === 'Y'

let refreshPromise: Promise<boolean> | null = null
async function refreshTokenOnce(service: AxiosInstance): Promise<boolean> {
  if (refreshPromise) return refreshPromise

  const authStore = useAuthStore()
  if (!authStore.refreshToken) return false

  refreshPromise = (async () => {
    const { data, error } = await service
      .post<App.Service.Response<Api.Auth.LoginToken>>(`${servicePort.auth}/refresh`, { refreshToken: authStore.refreshToken }, {
        skipAuthRefresh: true,
        skipErrorHandler: true,
        loading: false,
        cancel: false,
      } as CustomAxiosRequestConfig)
      .then((res) => ({
        data: res.data?.data as Api.Auth.LoginToken | undefined,
        error: false,
      }))
      .catch(() => ({
        data: undefined,
        error: true,
      }))

    if (error || !data?.accessToken) return false

    authStore.setToken(data.accessToken)
    authStore.setTokenType(data.tokenType || 'Bearer')
    if (data.refreshToken) authStore.setRefreshToken(data.refreshToken)

    return true
  })()

  try {
    return await refreshPromise
  } finally {
    refreshPromise = null
  }
}

/* ===================== Axios 实例 ===================== */
const axiosConfig: AxiosRequestConfig = {
  baseURL: import.meta.env.VITE_SERVICE_BASE_URL,
  timeout: Number(ResultEnum.TIMEOUT),
  withCredentials: true,
}

const axiosCanceler = new AxiosCanceler()

class RequestHttp {
  private service: AxiosInstance

  constructor(config: AxiosRequestConfig) {
    this.service = axios.create(config)
    this.setupInterceptors()
  }

  private setupInterceptors() {
    /* ---------- request ---------- */
    this.service.interceptors.request.use((config: InternalAxiosRequestConfig) => {
      const authStore = useAuthStore()
      const cfg = config as unknown as CustomAxiosRequestConfig

      cfg.cancel ??= true
      cfg.loading ??= true

      if (cfg.cancel) axiosCanceler.addPending(cfg)
      if (cfg.loading && !cfg.isUpload) openLoading()

      if (authStore.token) {
        cfg.headers = {
          ...(cfg.headers || {}),
          Authorization: `${authStore.tokenType || 'Bearer'} ${authStore.token}`,
        } as typeof config.headers
      }

      if (cfg.isUpload) {
        cfg.headers = {
          ...(cfg.headers || {}),
          'Content-Type': 'multipart/form-data',
        } as typeof config.headers
      }

      return cfg as unknown as InternalAxiosRequestConfig
    })

    /* ---------- response ---------- */
    this.service.interceptors.response.use(
      (response) => {
        const { config, data } = response as { config: CustomAxiosRequestConfig; data: App.Service.Response }

        axiosCanceler.removePending(config)
        if (config.loading) closeLoading()

        if (config.isDownload) return response

        if (data.code !== ResultEnum.SUCCESS) {
          throw {
            type: 'business',
            message: data.message || '请求失败',
          } as NormalizedError
        }

        return response
      },
      async (error: AxiosError) => {
        const config = error.config as CustomAxiosRequestConfig | undefined

        if (config?.loading) closeLoading()
        if (config) axiosCanceler.removePending(config)

        if (axios.isCancel(error)) {
          throw { type: 'cancel', message: REQUEST_CANCEL_ERROR }
        }
        // 401 → refresh once
        if (
          ENABLE_TOKEN_REFRESH &&
          error.response?.status === HttpStatusCode.Unauthorized &&
          config &&
          !config.__retriedAfterRefresh &&
          !config.skipAuthRefresh
        ) {
          const ok = await refreshTokenOnce(this.service)
          if (ok && config) {
            config.__retriedAfterRefresh = true
            config.cancelToken = undefined
            return this.service.request(config)
          }
          useAuthStore().resetAuthStore()
          await router.replace('/_builtin/login')
        }

        throw normalizeAxiosError(error)
      },
    )
  }

  /* ===================== send（唯一出口） ===================== */

  private async send<T>(
    method: CustomAxiosRequestConfig['method'],
    url: string,
    data?: unknown,
    config: Partial<CustomAxiosRequestConfig> = {},
  ): Promise<OptimizedResponse<T>> {
    try {
      const res = await this.service.request<App.Service.Response<T>>({
        url,
        method,
        ...(method === 'GET' || method === 'DELETE' ? { params: data } : { data }),
        ...config,
      })

      return {
        data: (res.data?.data ?? null) as T,
        error: false,
        message: '',
      }
    } catch (err) {
      const e = err as NormalizedError

      if (!config.skipErrorHandler && e.type !== 'cancel') {
        window.$message?.error(e.message)
      }

      return {
        data: null as T,
        error: true,
        message: e.message,
        errorType: e.type,
      }
    }
  }

  /* ===================== API ===================== */

  /** 发送 GET 请求 */
  get<T>(url: string, params?: object, config?: Partial<CustomAxiosRequestConfig>) {
    return this.send<T>('GET', url, params, config)
  }

  /** 发送 POST 请求 */
  post<T>(url: string, data?: unknown, config?: Partial<CustomAxiosRequestConfig>) {
    return this.send<T>('POST', url, data, config)
  }

  /** 发送 PUT 请求 */
  put<T>(url: string, data?: unknown, config?: Partial<CustomAxiosRequestConfig>) {
    return this.send<T>('PUT', url, data, config)
  }

  /** 发送 DELETE 请求 */
  delete<T>(url: string, params?: object, config?: Partial<CustomAxiosRequestConfig>) {
    return this.send<T>('DELETE', url, params, config)
  }

  /** 发送 PATCH 请求 */
  patch<T>(url: string, data?: unknown, config?: Partial<CustomAxiosRequestConfig>) {
    return this.send<T>('PATCH', url, data, config)
  }

  /** 上传表单 */
  upload<T>(url: string, form: FormData, config?: Partial<CustomAxiosRequestConfig>) {
    return this.send<T>('POST', url, form, { ...config, isUpload: true })
  }

  /** 下载文件（返回 Blob） */
  download(url: string, params?: object, config?: Partial<CustomAxiosRequestConfig>) {
    return this.send<Blob>('POST', url, params, {
      ...config,
      isDownload: true,
      responseType: 'blob',
    })
  }

  /** 取消全部请求 */
  cancelAllRequests(reason?: string) {
    axiosCanceler.removeAllPending(reason)
  }
}

/* ===================== export ===================== */

export const request = new RequestHttp(axiosConfig)
export default request
