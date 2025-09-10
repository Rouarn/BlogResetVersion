/**
 * HTTP 请求封装模块
 * 基于 Axios 封装的 HTTP 请求工具，提供统一的请求/响应拦截器、错误处理、重试机制等
 */

import router from '@/router'
import { useAuthStore } from '@/stores/modules/auth'
import { AxiosCanceler, REQUEST_CANCEL_ERROR } from './axiosCancel'
import { checkStatus, isServerError } from './checkStatus'
import { GlobalConfig, ResultEnum } from '@/enum'
import type { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import axios from 'axios'

/** 自定义请求配置接口 */
export interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  /** 是否显示 loading 加载状态 */
  loading?: boolean
  /** 是否启用请求取消机制 */
  cancel?: boolean
  /** 重试配置 */
  retry?: {
    /** 重试次数 */
    count: number
    /** 重试间隔（毫秒） */
    delay: number
    /** 需要重试的 HTTP 状态码 */
    retryCondition?: (error: AxiosError) => boolean
  }
  /** 是否为文件上传请求 */
  isUpload?: boolean
  /** 是否为文件下载请求 */
  isDownload?: boolean
  /** 自定义错误信息 */
  customErrorMessage?: string
  /** 是否忽略全局错误处理 */
  skipErrorHandler?: boolean
  /** 内部重试计数器 */
  __retryCount?: number
}

/** 默认重试配置 */
const DEFAULT_RETRY_CONFIG = {
  count: 2,
  delay: 1000,
  retryCondition: (error: AxiosError) => {
    // 只有网络错误和 5xx 错误才重试
    if (!error.response) return true // 网络错误
    return isServerError(error.response.status) // 5xx 错误
  },
}

/** Axios 配置 */
const config: AxiosRequestConfig = {
  // 默认请求地址，可在 .env.** 文件中修改
  baseURL: import.meta.env.VITE_SERVICE_BASE_URL as string,
  // 设置超时时间
  timeout: ResultEnum.TIMEOUT as number,
  // 跨域时候允许携带凭证
  withCredentials: true,
  // 默认请求头
  headers: {
    'Content-Type': 'application/json;charset=UTF-8',
  },
}

/** 全局取消器实例 */
const axiosCanceler = new AxiosCanceler()

/**
 * 睡眠函数，用于重试时的延迟
 * @param ms 延迟时间（毫秒）
 */
const sleep = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * HTTP 请求类
 */
class RequestHttp {
  /** Axios 实例 */
  private service: AxiosInstance

  public constructor(config: AxiosRequestConfig) {
    // 创建 Axios 实例
    this.service = axios.create(config)

    // 设置请求拦截器
    this.setupRequestInterceptor()

    // 设置响应拦截器
    this.setupResponseInterceptor()
  }

  /**
   * 设置请求拦截器
   */
  private setupRequestInterceptor(): void {
    this.service.interceptors.request.use(
      (config: CustomAxiosRequestConfig) => {
        const userStore = useAuthStore()

        // 重复请求取消控制
        config.cancel ??= true
        if (config.cancel) {
          axiosCanceler.addPending(config)
        }

        // Loading 状态控制
        config.loading ??= true
        if (config.loading && !config.isUpload) {
          window.$loading?.open()
        }

        // 设置请求头
        if (config.headers) {
          // 设置认证 token
          if (userStore.token && typeof config.headers.set === 'function') {
            config.headers.set('Authorization', `Bearer ${userStore.token}`)
          }

          // 开发环境下的测试 token（生产环境应移除）
          if (import.meta.env.DEV && typeof config.headers.set === 'function') {
            config.headers.set('apifoxToken', '')
          }

          // 文件上传特殊处理
          if (config.isUpload && typeof config.headers.set === 'function') {
            config.headers.set('Content-Type', 'multipart/form-data')
          }
        }

        // 记录请求日志
        if (import.meta.env.DEV) {
          console.debug(`[Request] ${config.method?.toUpperCase()} ${config.url}`, {
            params: config.params,
            data: config.data,
          })
        }

        return config
      },
      (error: AxiosError) => {
        console.error('[Request Error]', error)
        return Promise.reject(error)
      },
    )
  }

  /**
   * 设置响应拦截器
   */
  private setupResponseInterceptor(): void {
    this.service.interceptors.response.use(
      (response: AxiosResponse & { config: CustomAxiosRequestConfig }) => {
        const { data, config, status } = response
        const userStore = useAuthStore()

        // 移除已完成的请求
        axiosCanceler.removePending(config)

        // 关闭 loading
        if (config.loading) {
          window.$loading?.close()
        }

        // 文件下载特殊处理
        if (config.isDownload) {
          return response
        }

        // 登录失效处理
        if (data?.code === ResultEnum.OVERDUE) {
          userStore.setToken('')
          router.replace(GlobalConfig.LOGIN_URL)

          if (!config.skipErrorHandler) {
            window.$message?.error(data.msg || '登录已过期，请重新登录')
          }

          return Promise.reject(new Error('Token expired'))
        }

        // 全局错误信息拦截（防止下载文件时返回数据流，没有 code 直接报错）
        if (data?.code && data.code !== ResultEnum.SUCCESS) {
          const errorMessage = config.customErrorMessage || data.msg || '请求失败'

          if (!config.skipErrorHandler) {
            window.$message?.error(errorMessage)
          }

          return Promise.reject(new Error(errorMessage))
        }

        // 记录响应日志
        if (import.meta.env.DEV) {
          console.debug(`[Response] ${config.method?.toUpperCase()} ${config.url}`, {
            status,
            data,
          })
        }

        // 成功请求（在页面上除非特殊情况，否则不用处理失败逻辑）
        return data ?? response
      },
      (error: AxiosError & { config: CustomAxiosRequestConfig }) => {
        return this.handleResponseError(error)
      },
    )
  }

  /**
   * 处理响应错误
   * @param error Axios 错误对象
   */
  private async handleResponseError(error: AxiosError & { config: CustomAxiosRequestConfig }): Promise<unknown> {
    const { config, response } = error
    const message = error.message || '未知错误'

    // 关闭 loading
    if (config?.loading) {
      window.$loading?.close()
    }

    // 如果是取消请求，直接拖绝
    if (axios.isCancel(error) || message.includes(REQUEST_CANCEL_ERROR)) {
      console.debug('[Request Cancelled]', config?.url)
      return Promise.reject(error)
    }

    // 重试逻辑
    if (config?.retry && this.shouldRetry(error)) {
      return this.retryRequest(config, error)
    }

    // 处理网络错误
    if (!response) {
      if (message.includes('timeout')) {
        if (!config?.skipErrorHandler) {
          window.$message?.error('请求超时！请您稍后重试')
        }
      } else if (message.includes('Network Error')) {
        if (!config?.skipErrorHandler) {
          window.$message?.error('网络错误！请检查网络连接')
        }
      } else {
        if (!config?.skipErrorHandler) {
          window.$message?.error('网络异常，请稍后重试')
        }
      }
    } else {
      // 根据服务器响应的错误状态码做不同处理
      if (!config?.skipErrorHandler) {
        checkStatus(response.status, config?.customErrorMessage)
      }
    }

    // 离线处理：可以跳转到离线页面
    if (!window.navigator.onLine) {
      router.replace('/500')
    }

    // 记录错误日志
    if (import.meta.env.DEV) {
      console.error('[Response Error]', {
        url: config?.url,
        method: config?.method,
        status: response?.status,
        message,
        response: response?.data,
      })
    }

    return Promise.reject(error)
  }

  /**
   * 判断是否应该重试
   * @param error Axios 错误对象
   */
  private shouldRetry(error: AxiosError): boolean {
    const config = error.config as CustomAxiosRequestConfig

    if (!config?.retry) return false

    // 检查是否达到重试次数上限
    const currentRetryCount = config.__retryCount || 0
    if (currentRetryCount >= config.retry.count) {
      return false
    }

    // 使用自定义重试条件或默认条件
    const retryCondition = config.retry.retryCondition || DEFAULT_RETRY_CONFIG.retryCondition
    return retryCondition(error)
  }

  /**
   * 重试请求
   * @param config 请求配置
   * @param _originalError 原始错误（未使用）
   */
  private async retryRequest(config: CustomAxiosRequestConfig, _originalError: AxiosError): Promise<unknown> {
    const retryConfig = { ...DEFAULT_RETRY_CONFIG, ...config.retry }
    const currentRetryCount = (config.__retryCount || 0) + 1

    // 更新重试次数
    config.__retryCount = currentRetryCount

    // 等待指定时间后重试
    await sleep(retryConfig.delay)

    // 记录重试日志
    if (import.meta.env.DEV) {
      console.warn(`[Request Retry] ${config.url} - Attempt ${currentRetryCount}/${retryConfig.count}`)
    }

    try {
      return await this.service.request(config)
    } catch (retryError) {
      // 如果重试还是失败，递归调用错误处理
      return this.handleResponseError(retryError as AxiosError & { config: CustomAxiosRequestConfig })
    }
  }

  /**
   * GET 请求
   * @param url 请求地址
   * @param params 请求参数
   * @param config 自定义配置
   */
  get<T = unknown>(url: string, params?: object, config: Partial<CustomAxiosRequestConfig> = {}): Promise<App.Service.Response<T>> {
    return this.service.get(url, {
      ...config,
      params,
    })
  }

  /**
   * POST 请求
   * @param url 请求地址
   * @param data 请求数据
   * @param config 自定义配置
   */
  post<T = unknown>(url: string, data?: unknown, config: Partial<CustomAxiosRequestConfig> = {}): Promise<App.Service.Response<T>> {
    return this.service.post(url, data, config)
  }

  /**
   * PUT 请求
   * @param url 请求地址
   * @param data 请求数据
   * @param config 自定义配置
   */
  put<T = unknown>(url: string, data?: unknown, config: Partial<CustomAxiosRequestConfig> = {}): Promise<App.Service.Response<T>> {
    return this.service.put(url, data, config)
  }

  /**
   * PATCH 请求
   * @param url 请求地址
   * @param data 请求数据
   * @param config 自定义配置
   */
  patch<T = unknown>(url: string, data?: unknown, config: Partial<CustomAxiosRequestConfig> = {}): Promise<App.Service.Response<T>> {
    return this.service.patch(url, data, config)
  }

  /**
   * DELETE 请求
   * @param url 请求地址
   * @param params 请求参数
   * @param config 自定义配置
   */
  delete<T = unknown>(url: string, params?: unknown, config: Partial<CustomAxiosRequestConfig> = {}): Promise<App.Service.Response<T>> {
    return this.service.delete(url, {
      ...config,
      params,
    })
  }

  /**
   * 文件上传
   * @param url 上传地址
   * @param formData 表单数据
   * @param config 自定义配置
   */
  upload<T = unknown>(url: string, formData: FormData, config: Partial<CustomAxiosRequestConfig> = {}): Promise<App.Service.Response<T>> {
    const requestConfig: CustomAxiosRequestConfig = {
      ...config,
      method: 'POST',
      url,
      data: formData,
      isUpload: true,
    }

    // 单独处理 headers
    if (config.headers || requestConfig.isUpload) {
      requestConfig.headers = {
        ...(config.headers || {}),
        'Content-Type': 'multipart/form-data',
      }
    }

    return this.service.request(requestConfig)
  }

  /**
   * 文件下载
   * @param url 下载地址
   * @param params 请求参数
   * @param config 自定义配置
   */
  download(url: string, params?: object, config: Partial<CustomAxiosRequestConfig> = {}): Promise<AxiosResponse<Blob>> {
    const requestConfig: CustomAxiosRequestConfig = {
      ...config,
      method: 'POST',
      url,
      data: params,
      isDownload: true,
      responseType: 'blob',
    }

    return this.service.request(requestConfig)
  }

  /**
   * 取消所有正在进行的请求
   * @param reason 取消原因
   */
  cancelAllRequests(reason?: string): void {
    axiosCanceler.removeAllPending(reason)
  }

  /**
   * 获取当前正在进行的请求数量
   */
  getPendingRequestCount(): number {
    return axiosCanceler.getPendingCount()
  }

  /**
   * 检查请求是否在等待队列中
   * @param config 请求配置
   */
  isPending(config: CustomAxiosRequestConfig): boolean {
    return axiosCanceler.isPending(config)
  }

  /**
   * 创建一个带有重试机制的请求
   * @param retryConfig 重试配置
   */
  createRetryRequest(retryConfig: CustomAxiosRequestConfig['retry']) {
    return {
      get: <T = unknown>(url: string, params?: object, config: Partial<CustomAxiosRequestConfig> = {}) =>
        this.get<T>(url, params, { ...config, retry: retryConfig }),
      post: <T = unknown>(url: string, data?: unknown, config: Partial<CustomAxiosRequestConfig> = {}) =>
        this.post<T>(url, data, { ...config, retry: retryConfig }),
      put: <T = unknown>(url: string, data?: unknown, config: Partial<CustomAxiosRequestConfig> = {}) =>
        this.put<T>(url, data, { ...config, retry: retryConfig }),
      delete: <T = unknown>(url: string, params?: unknown, config: Partial<CustomAxiosRequestConfig> = {}) =>
        this.delete<T>(url, params, { ...config, retry: retryConfig }),
    }
  }
}

/** 导出默认实例 */
const httpRequest = new RequestHttp(config)

/** 常用的重试配置 */
export const retryRequest = httpRequest.createRetryRequest(DEFAULT_RETRY_CONFIG)

/** 不显示 loading 的请求实例 */
export const silentRequest = {
  get: <T = unknown>(url: string, params?: object, config: Partial<CustomAxiosRequestConfig> = {}) =>
    httpRequest.get<T>(url, params, { ...config, loading: false }),
  post: <T = unknown>(url: string, data?: unknown, config: Partial<CustomAxiosRequestConfig> = {}) =>
    httpRequest.post<T>(url, data, { ...config, loading: false }),
  put: <T = unknown>(url: string, data?: unknown, config: Partial<CustomAxiosRequestConfig> = {}) =>
    httpRequest.put<T>(url, data, { ...config, loading: false }),
  delete: <T = unknown>(url: string, params?: unknown, config: Partial<CustomAxiosRequestConfig> = {}) =>
    httpRequest.delete<T>(url, params, { ...config, loading: false }),
}

export default httpRequest
