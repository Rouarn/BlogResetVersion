import type { RequestError, RequestErrorType } from './error'

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
