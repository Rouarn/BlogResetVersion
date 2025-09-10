/**
 * Axios 请求取消管理器
 * 管理所有正在进行的 HTTP 请求，支持取消重复请求和批量取消
 */

import type { CustomAxiosRequestConfig } from './index'
import qs from 'qs'

/** 存储正在进行的请求 */
const pendingRequestMap = new Map<string, AbortController>()

/** 请求取消的错误类型 */
export const REQUEST_CANCEL_ERROR = 'REQUEST_CANCEL_ERROR'

/**
 * 序列化参数，确保对象属性顺序一致
 * @param obj 需要序列化的对象
 * @returns 序列化后的字符串
 */
const sortedStringify = (obj: unknown): string => {
  if (!obj || typeof obj !== 'object') {
    return String(obj ?? '')
  }

  return qs.stringify(obj, {
    arrayFormat: 'repeat',
    sort: (a, b) => a.localeCompare(b),
    skipNulls: true,
    strictNullHandling: true,
  })
}

/**
 * 生成请求的唯一标识符
 * @param config Axios 请求配置
 * @returns 请求的唯一标识符
 */
export const generateRequestKey = (config: CustomAxiosRequestConfig): string => {
  const { method = 'GET', url = '', data, params } = config

  return [method.toUpperCase(), url, sortedStringify(data), sortedStringify(params)].join('&')
}

/**
 * @deprecated 使用 generateRequestKey 替代
 */
export const getPendingUrl = generateRequestKey

/**
 * Axios 请求取消管理器
 */
export class AxiosCanceler {
  /**
   * 添加请求到等待队列
   * @param config Axios 请求配置
   */
  addPending(config: CustomAxiosRequestConfig): void {
    // 在添加新请求前，先移除相同的请求
    this.removePending(config)

    const requestKey = generateRequestKey(config)
    const controller = new AbortController()

    // 设置取消信号
    config.signal = controller.signal

    // 存储请求控制器
    pendingRequestMap.set(requestKey, controller)

    // 开发环境下记录日志
    if (import.meta.env.DEV) {
      console.debug(`[Request Added] ${requestKey}`)
    }
  }

  /**
   * 从等待队列中移除请求
   * @param config Axios 请求配置
   */
  removePending(config: CustomAxiosRequestConfig): void {
    const requestKey = generateRequestKey(config)
    const controller = pendingRequestMap.get(requestKey)

    if (controller) {
      // 取消请求
      controller.abort(REQUEST_CANCEL_ERROR)

      // 从 Map 中删除
      pendingRequestMap.delete(requestKey)

      // 开发环境下记录日志
      if (import.meta.env.DEV) {
        console.debug(`[Request Removed] ${requestKey}`)
      }
    }
  }

  /**
   * 清空所有等待中的请求
   * @param reason 取消原因（可选）
   */
  removeAllPending(reason?: string): void {
    const cancelReason = reason || REQUEST_CANCEL_ERROR

    pendingRequestMap.forEach((controller, requestKey) => {
      if (controller) {
        controller.abort(cancelReason)

        // 开发环境下记录日志
        if (import.meta.env.DEV) {
          console.debug(`[Request Cancelled] ${requestKey} - Reason: ${cancelReason}`)
        }
      }
    })

    pendingRequestMap.clear()

    if (import.meta.env.DEV) {
      console.debug('[All Requests Cleared]')
    }
  }

  /**
   * 获取当前等待中的请求数量
   * @returns 等待中的请求数量
   */
  getPendingCount(): number {
    return pendingRequestMap.size
  }

  /**
   * 检查请求是否在等待队列中
   * @param config Axios 请求配置
   * @returns 是否在等待队列中
   */
  isPending(config: CustomAxiosRequestConfig): boolean {
    const requestKey = generateRequestKey(config)
    return pendingRequestMap.has(requestKey)
  }

  /**
   * 获取所有等待中的请求标识
   * @returns 等待中的请求标识数组
   */
  getPendingKeys(): string[] {
    return Array.from(pendingRequestMap.keys())
  }
}
