import type { OptimizedResponse } from './types'

/**
 * 构建成功响应
 * @param payload 响应数据
 * @param isDownload 是否为下载请求
 * @returns 优化后的响应对象
 */
export function buildSuccessResponse<T>(payload: unknown, isDownload: boolean): OptimizedResponse<T> {
  if (isDownload) {
    return {
      data: payload as T,
      error: false,
      message: 'success',
    }
  }
  const safeData = payload as { data?: unknown; message?: string }
  return {
    data: safeData?.data as T,
    error: false,
    message: safeData?.message || 'success',
  }
}
