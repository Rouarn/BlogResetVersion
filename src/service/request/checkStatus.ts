/**
 * 检查 HTTP 状态码并提示
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

export function checkStatus(status: number, customMessage?: string): void {
  const message = customMessage || STATUS_TEXT[status] || `请求错误：${status}`
  if (message) window.$message?.error(message)
}

/** 是否为服务端错误（5xx） */
export function isServerError(status: number): boolean {
  return status >= 500 && status < 600
}
