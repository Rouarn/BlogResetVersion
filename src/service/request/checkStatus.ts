/**
 * 状态码与错误处理工具
 * - `showToast`：根据 HTTP 状态码给出友好提示
 * - `isServerError`：判断是否为服务端错误（5xx）
 * - `normalizeAxiosError`：统一 axios 错误为业务可识别形态
 */
import { type AxiosError, HttpStatusCode } from 'axios'

/**
 *   检查 HTTP 状态码并提示
 * - 当无后端 message 且存在状态码时使用内置文案
 */
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

export function showToast(status: number, customMessage?: string): void {
  const message = customMessage || STATUS_TEXT[status] || `请求错误：${status}`
  if (message) window.$message?.error(message)
}

export type ErrorType = 'overdue' | 'business' | 'network' | 'timeout' | 'cancel' | 'server'
export interface NormalizedError {
  type: ErrorType
  message: string
  original?: unknown
}

/** 是否为服务端错误（5xx） */
export function isServerError(status: number): boolean {
  return status >= 500 && status < 600
}

/** 归一化 axios 错误 */
export function normalizeAxiosError(error: AxiosError): NormalizedError {
  const status = error.response?.status
  const message = (error.response?.data as App.Service.Response | undefined)?.message

  if (status === undefined) {
    return error.message.includes('timeout') ? { type: 'timeout', message: '请求超时' } : { type: 'network', message: '网络异常' }
  }

  if (status === HttpStatusCode.Unauthorized) {
    return { type: 'overdue', message: '登录已过期' }
  }

  if (isServerError(status)) {
    return { type: 'server', message: message || '服务器错误' }
  }

  return { type: 'network', message: message || '请求失败' }
}
