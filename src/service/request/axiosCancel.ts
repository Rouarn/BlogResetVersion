import type { CustomAxiosRequestConfig } from './index'
import type { Canceler } from 'axios'
import axios from 'axios'

export const REQUEST_CANCEL_ERROR = '__REQUEST_CANCEL__'

/**
 * 管理和取消重复请求：
 * - 根据 method/url/params/data 生成唯一 key
 * - 在发起前移除同 key 的 pending 请求，避免重复
 * - 支持取消全部 pending 请求
 */
export class AxiosCanceler {
  private pendingMap: Map<string, Canceler> = new Map()

  /** 生成唯一 key */
  private getKey(config: CustomAxiosRequestConfig): string {
    const { url, method, params, data } = config
    return [method, url, JSON.stringify(params ?? {}), JSON.stringify(data ?? {})].join('&')
  }

  /** 添加请求 */
  public addPending(config: CustomAxiosRequestConfig): void {
    this.removePending(config)

    const key = this.getKey(config)
    config.cancelToken =
      config.cancelToken ||
      new axios.CancelToken((cancel) => {
        if (!this.pendingMap.has(key)) {
          this.pendingMap.set(key, cancel)
        }
      })
  }

  /** 移除请求 */
  public removePending(config: CustomAxiosRequestConfig): void {
    const key = this.getKey(config)

    if (this.pendingMap.has(key)) {
      const cancel = this.pendingMap.get(key)
      cancel?.(`${REQUEST_CANCEL_ERROR}: ${key}`)
      this.pendingMap.delete(key)
    }
  }

  /** 取消所有请求 */
  public removeAllPending(reason?: string): void {
    this.pendingMap.forEach((cancel) => cancel?.(reason || REQUEST_CANCEL_ERROR))
    this.pendingMap.clear()
  }

  /** 是否存在某个请求 */
  public isPending(config: CustomAxiosRequestConfig): boolean {
    const key = this.getKey(config)
    return this.pendingMap.has(key)
  }

  /** 获取 pending 请求数量 */
  public getPendingCount(): number {
    return this.pendingMap.size
  }
}
