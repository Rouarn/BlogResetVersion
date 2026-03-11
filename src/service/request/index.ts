import router from '@/router'
import { useAuthStore } from '@/stores/modules/auth'
import { toRequestError } from './error'
import { loadingManager } from './loading'
import { ENABLE_TOKEN_REFRESH, refreshTokenOnce } from './refresh'
import type { CustomAxiosRequestConfig, OptimizedResponse } from './types'
import { buildSuccessResponse } from './utils'
import { ResultEnum, RouteNameEnum } from '@/enum'
import { createVakaoAxios } from '@vakao-ui/axios'
import { type AxiosError, AxiosHeaders, type AxiosResponse, HttpStatusCode, type InternalAxiosRequestConfig } from 'axios'

/* ===================== Axios 实例与拦截器 ===================== */
const AUTHORIZATION_HEADER = 'Authorization' // 授权头名称

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
        config.headers[AUTHORIZATION_HEADER] = `${authStore.tokenType} ${token}`
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
    transform: (response: AxiosResponse<App.Service.Response<unknown>>) => {
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
    onError: async (error: AxiosError | Error): Promise<void> => {
      const err = error as AxiosError
      const config = (err.config || err.response?.config) as CustomAxiosRequestConfig | undefined
      if (config?.loading) loadingManager.close()

      const reqError = toRequestError(error)

      if (reqError.type === 'cancel') {
        return
      }

      if (config && !config.skipErrorHandler) {
        window.$message?.error(reqError.message)
      }
    },
  },
)

/* ===================== 原生 Axios 拦截器 (用于 Token 刷新) ===================== */

/**
 * 为原生 Axios 实例注册响应拦截器
 * 拦截器执行顺序：Axios 实例原生拦截器 -> createVakaoAxios 封装的钩子
 * 在此处处理 401 刷新 token，可以实现对上层“透明”的重试逻辑
 */
service.instance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const config = error.config as CustomAxiosRequestConfig
    if (!config || config.skipAuthRefresh || config.__retriedAfterRefresh) {
      return Promise.reject(error)
    }

    // 处理 401 错误
    if (error.response?.status === HttpStatusCode.Unauthorized) {
      // 开启了 Token 刷新则尝试刷新
      if (ENABLE_TOKEN_REFRESH) {
        const success = await refreshTokenOnce(service.instance)
        if (success) {
          config.__retriedAfterRefresh = true
          // 更新 Token 到配置中
          const authStore = useAuthStore()
          if (!config.headers) config.headers = new AxiosHeaders()
          config.headers[AUTHORIZATION_HEADER] = `${authStore.tokenType} ${authStore.token}`
          // 返回重试请求的 Promise，这样上层 service.request 就能拿到重试后的结果
          return service.instance.request(config)
        }
      }

      // 刷新失败或未开启刷新，清理 Token 并跳转登录
      const authStore = useAuthStore()
      authStore.setToken('')
      authStore.setRefreshToken('')
      await router.replace(`/${RouteNameEnum.LOGIN}`)
    }

    return Promise.reject(error)
  },
)

/* ===================== 请求方法封装 ===================== */

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
