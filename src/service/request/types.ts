import type { RequestError, RequestErrorType } from './error'
import type { FlatRequestInstanceConfig } from '@vakao-ui/axios'

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
