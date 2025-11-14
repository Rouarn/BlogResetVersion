/**
 * 检查 HTTP 状态码并提示
 * - 当无后端 message 且存在状态码时使用内置文案
 */
export function checkStatus(status: number, customMessage?: string): void {
  let message = ''

  switch (status) {
    case 400:
      message = '请求参数错误'
      break
    case 401:
      message = '未授权或登录已过期'
      break
    case 403:
      message = '没有权限访问'
      break
    case 404:
      message = '请求地址不存在'
      break
    case 408:
      message = '请求超时'
      break
    case 500:
      message = '服务器内部错误'
      break
    case 502:
      message = '网关错误'
      break
    case 503:
      message = '服务不可用'
      break
    case 504:
      message = '网关超时'
      break
    default:
      message = customMessage || `请求错误：${status}`
  }

  if (message) {
    window.$message?.error(message)
  }
}

/**
 * 是否为服务端错误（5xx）
 */
export function isServerError(status: number): boolean {
  return status >= 500 && status < 600
}
