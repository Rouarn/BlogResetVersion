import { getReasonForError } from './utils'
import axios from 'axios'
import { type AxiosError, HttpStatusCode } from 'axios'

/**
 * 错误类型枚举
 * - 'business': 业务逻辑错误 (code !== SUCCESS)
 * - 'network': 网络错误 (断网/DNS失败)
 * - 'timeout': 请求超时
 * - 'cancel': 请求取消
 * - 'server': 服务端错误 (5xx)
 * - 'overdue': 授权过期 (401)
 * - 'client': 客户端错误 (4xx)
 * - 'unknown': 未知错误
 */
export type RequestErrorType = 'business' | 'network' | 'timeout' | 'cancel' | 'server' | 'overdue' | 'client' | 'unknown'

const STATUS_TEXT: Record<number, string> = {
  400: '请求参数错误',
  401: '未授权或登录已过期',
  403: '没有权限访问',
  404: '请求地址不存在',
  408: '请求超时',
  500: '服务器内部错误',
  502: '网关错误',
  503: '服务不可用',
  504: '网关超时',
}

/**
 * 统一请求错误类
 */
export class RequestError extends Error {
  /** 错误类型 */
  public type: RequestErrorType
  /** 错误代码 (HTTP Status 或 业务 Code) */
  public code: number | string
  /** 原始错误对象 */
  public originalError: unknown

  constructor(type: RequestErrorType, message: string, code: number | string = 0, originalError?: unknown) {
    super(message)
    this.name = 'RequestError'
    this.type = type
    this.code = code
    this.originalError = originalError
  }

  /**
   * 从 AxiosError 创建 RequestError
   */
  static fromAxiosError(error: AxiosError): RequestError {
    const { response, message, code } = error
    const status = response?.status

    // 1. 请求被取消
    if (code === 'ERR_CANCELED' || axios.isCancel(error)) {
      return new RequestError('cancel', '请求已取消', 'CANCEL', error)
    }

    // 2. 超时
    if (code === 'ECONNABORTED' || message.includes('timeout')) {
      return new RequestError('timeout', '请求超时，请稍后重试', 'TIMEOUT', error)
    }

    // 3. 网络错误 (无 response)
    if (!status) {
      return new RequestError('network', '网络连接异常，请检查网络', 'NETWORK', error)
    }

    // 4. HTTP 错误处理
    const data = response?.data as App.Service.Response<unknown>
    let statusMsg = STATUS_TEXT[status] || response?.statusText

    // 如果有 data 对象，使用 getReasonForError 格式化错误信息
    if (data) {
      statusMsg = getReasonForError(data)
    }

    if (status === HttpStatusCode.Unauthorized) {
      return new RequestError('overdue', data?.message || '登录已过期，请重新登录', status, error)
    }

    if (status >= HttpStatusCode.InternalServerError) {
      return new RequestError('server', statusMsg || '服务器内部错误', status, error)
    }

    if (status >= HttpStatusCode.BadRequest) {
      return new RequestError('client', statusMsg || '客户端请求错误', status, error)
    }

    return new RequestError('unknown', statusMsg || message || '未知请求错误', 'UNKNOWN', error)
  }
}
