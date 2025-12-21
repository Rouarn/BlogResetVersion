/**
 * 请求取消管理 (使用 AbortController)
 * - 自动取消重复请求
 * - 支持手动取消
 */
import type { CustomAxiosRequestConfig } from './index'
import { stableStringify } from './utils'

export const REQUEST_CANCEL_MSG = 'RequestCanceled'

export class RequestCanceler {
  // Map<key, AbortController>
  private pendingMap: Map<string, AbortController> = new Map()

  /**
   * 生成唯一 key
   * @param config 请求配置
   */
  private getKey(config: CustomAxiosRequestConfig): string {
    const { url, method, params, data } = config
    return [String(method || 'GET').toUpperCase(), String(url || ''), stableStringify(params ?? {}), stableStringify(data ?? {})].join('&')
  }

  /**
   * 添加请求到 pending Map
   * - 如果存在重复请求，先取消旧的
   * - 创建新的 AbortController 并绑定到 config.signal
   * @param config 请求配置
   */
  public addPending(config: CustomAxiosRequestConfig): void {
    this.removePending(config) // 移除(并取消)同 key 的旧请求

    const key = this.getKey(config)
    const controller = new AbortController()

    config.signal = controller.signal
    this.pendingMap.set(key, controller)
  }

  /**
   * 移除 pending 状态
   * - 默认会执行 abort()，确保重复请求被取消
   * - 如果请求已完成，abort() 无副作用
   * @param config 请求配置
   */
  public removePending(config: CustomAxiosRequestConfig): void {
    const key = this.getKey(config)

    if (this.pendingMap.has(key)) {
      const controller = this.pendingMap.get(key)
      // 注意：abort() 可以传递 reason，但在 Axios/Fetch 中通常只是 signal 变为 aborted
      controller?.abort(REQUEST_CANCEL_MSG)
      this.pendingMap.delete(key)
    }
  }

  /**
   * 取消全部请求
   */
  public removeAllPending(): void {
    this.pendingMap.forEach((controller) => {
      controller.abort(REQUEST_CANCEL_MSG)
    })
    this.pendingMap.clear()
  }

  /**
   * 仅仅从 Map 中移除，不执行 abort
   * (用于请求成功后的清理，虽然 abort 完成的请求没副作用，但这样更语义化)
   */
  public removeRecord(config: CustomAxiosRequestConfig): void {
    const key = this.getKey(config)
    this.pendingMap.delete(key)
  }
}
