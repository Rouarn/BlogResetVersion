import { RequestError as ClientRequestError } from '@vakao/axios'
import { HttpStatusCode } from 'axios'

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
 * 获取错误原因
 */
export function getReasonForError(error: App.Service.Response<unknown>): string {
  if (!error) return ''

  // 提取错误信息
  const message = error.message || ''
  const data = error.data || {}

  // 收集所有错误原因
  const reasons: string[] = []

  // 遍历 data 对象，收集所有数组类型的错误信息
  Object.values(data).forEach((value) => {
    if (Array.isArray(value)) {
      value.forEach((reason) => {
        if (typeof reason === 'string' && reason.trim()) {
          reasons.push(reason.trim())
        }
      })
    } else if (typeof value === 'string' && value.trim()) {
      reasons.push(value.trim())
    } else if (typeof value === 'object' && value !== null) {
      // 递归处理嵌套对象
      const nestedReason = getReasonForError(value as App.Service.Response<unknown>)
      if (nestedReason) {
        reasons.push(nestedReason)
      }
    }
  })

  // 构建最终错误信息
  let result = message

  if (reasons.length > 0) {
    result += '\n原因：'
    reasons.forEach((reason, index) => {
      result += `\n${index + 1}.${reason}`
    })
  }

  return result
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
}

/**
 * 转换为请求错误对象
 * @param err 库抛出的 RequestError
 * @returns 格式化后的请求错误对象
 */
export function toRequestError(err: unknown): RequestError {
  if (err instanceof ClientRequestError) {
    const { type, code, data, response } = err
    const body = (response?.data ?? (data ? { message: '', data } : undefined)) as App.Service.Response<unknown> | undefined
    const reason = body ? getReasonForError(body) : ''

    if (type === 'cancel') return new RequestError('cancel', '请求已取消', 'CANCEL', err)
    if (type === 'timeout') return new RequestError('timeout', '请求超时，请稍后重试', 'TIMEOUT', err)
    if (type === 'network') return new RequestError('network', '网络连接异常，请检查网络', 'NETWORK', err)
    if (type === 'business') return new RequestError('business', reason, code, err)

    const statusMsg = reason || STATUS_TEXT[code] || '请求失败'
    if (code === HttpStatusCode.Unauthorized) return new RequestError('overdue', statusMsg, code, err)
    if (code >= HttpStatusCode.InternalServerError) return new RequestError('server', statusMsg, code, err)
    if (code >= HttpStatusCode.BadRequest) return new RequestError('client', statusMsg, code, err)
    return new RequestError('unknown', statusMsg, code, err)
  }

  const message = err instanceof Error ? err.message : String(err)
  return new RequestError('unknown', message, 'UNKNOWN', err)
}
