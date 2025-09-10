/**
 * HTTP 状态码处理器
 * 根据 HTTP 状态码显示相应的错误信息
 */

/** HTTP 状态码和错误信息的映射 */
const STATUS_CODE_MESSAGE_MAP: Record<number, string> = {
  400: '请求参数错误！请您检查后重试',
  401: '登录失效！请您重新登录',
  403: '当前账号无权限访问！',
  404: '您所访问的资源不存在！',
  405: '请求方式错误！请您稍后重试',
  408: '请求超时！请您稍后重试',
  409: '资源冲突！请检查后重试',
  422: '数据验证失败！请检查输入',
  429: '请求过于频繁！请稍后重试',
  500: '服务器内部错误！',
  502: '网关错误！',
  503: '服务不可用！',
  504: '网关超时！',
  507: '服务器存储空间不足！',
}

/**
 * 校验网络请求状态码
 * @param status HTTP 状态码
 * @param customMessage 自定义错误信息（可选）
 * @returns 是否为成功状态码
 */
export const checkStatus = (status: number, customMessage?: string): boolean => {
  // 2xx 范围的状态码表示成功
  if (status >= 200 && status < 300) {
    return true
  }

  // 获取错误信息
  const message = customMessage || STATUS_CODE_MESSAGE_MAP[status] || `请求失败！状态码: ${status}`

  // 显示错误信息
  window.$message?.error(message)

  // 记录错误日志（生产环境中可以发送到日志服务）
  if (import.meta.env.DEV) {
    console.error(`[HTTP Error] Status: ${status}, Message: ${message}`)
  }

  return false
}

/**
 * 获取状态码对应的错误信息
 * @param status HTTP 状态码
 * @returns 错误信息
 */
export const getStatusMessage = (status: number): string => {
  return STATUS_CODE_MESSAGE_MAP[status] || `未知错误（状态码: ${status}）`
}

/**
 * 检查是否为客户端错误（4xx）
 * @param status HTTP 状态码
 * @returns 是否为客户端错误
 */
export const isClientError = (status: number): boolean => {
  return status >= 400 && status < 500
}

/**
 * 检查是否为服务器错误（5xx）
 * @param status HTTP 状态码
 * @returns 是否为服务器错误
 */
export const isServerError = (status: number): boolean => {
  return status >= 500 && status < 600
}
