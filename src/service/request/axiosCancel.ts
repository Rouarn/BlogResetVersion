/**
 * 请求去重与取消管理
 * - 根据 `method + url + params + data` 生成唯一 key，避免重复请求
 * - 在请求发起前登记 pending，请求结束或报错后移除 pending
 * - 支持主动取消单个或全部 pending 请求
 *
 * 使用方式：
 * 1) 请求拦截器：`axiosCanceler.addPending(config)`
 * 2) 响应拦截器/错误处理：`axiosCanceler.removePending(config)` 或 `axiosCanceler.removeAllPending()`
 */
import type { CustomAxiosRequestConfig } from './index'
import { stableStringify } from './utils'
import type { Canceler } from 'axios'
import axios from 'axios'

export const REQUEST_CANCEL_ERROR = '__REQUEST_CANCEL__'

/**
 * 管理和取消重复请求
 */
export class AxiosCanceler {
  private pendingMap: Map<string, Canceler> = new Map()

  /**
   * 生成唯一 key
   * @param config 请求配置
   * @returns 唯一 key：`METHOD&URL&PARAMS&DATA`
   */
  private getKey(config: CustomAxiosRequestConfig): string {
    const { url, method, params, data } = config
    return [String(method || '').toUpperCase(), String(url || ''), stableStringify(params ?? {}), stableStringify(data ?? {})].join('&')
  }

  /**
   * 添加 pending（若已存在同 key，则先移除）
   * @param config 请求配置
   */
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

  /**
   * 移除指定请求的 pending
   * @param config 请求配置
   */
  public removePending(config: CustomAxiosRequestConfig): void {
    const key = this.getKey(config)

    if (this.pendingMap.has(key)) {
      const cancel = this.pendingMap.get(key)
      cancel?.(`${REQUEST_CANCEL_ERROR}: ${key}`)
      this.pendingMap.delete(key)
    }
  }

  /**
   * 取消全部 pending 请求
   * @param reason 取消原因
   */
  public removeAllPending(reason?: string): void {
    this.pendingMap.forEach((cancel) => cancel?.(reason || REQUEST_CANCEL_ERROR))
    this.pendingMap.clear()
  }

  /**
   * 判断某个请求是否处于 pending
   * @param config 请求配置
   * @returns 是否 pending
   */
  public isPending(config: CustomAxiosRequestConfig): boolean {
    const key = this.getKey(config)
    return this.pendingMap.has(key)
  }

  /**
   * 获取当前 pending 请求数量
   */
  public getPendingCount(): number {
    return this.pendingMap.size
  }
}
