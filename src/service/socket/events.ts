/**
 * Socket.IO 事件处理器
 *
 * 提供事件监听和触发的统一管理
 */

import type { EventListener, EventMap } from './types'

/**
 * 事件处理器类
 */
export class EventHandler {
  private listeners = new Map<string, Set<EventListener>>()

  /**
   * 添加事件监听器
   * @param event 事件名称
   * @param listener 监听器函数
   */
  on<K extends keyof EventMap>(event: K, listener: EventMap[K]): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set())
    }
    this.listeners.get(event)!.add(listener as EventListener)
  }

  /**
   * 移除事件监听器
   * @param event 事件名称
   * @param listener 监听器函数
   */
  off<K extends keyof EventMap>(event: K, listener?: EventMap[K]): void {
    const eventListeners = this.listeners.get(event)
    if (!eventListeners) return

    if (listener) {
      eventListeners.delete(listener as EventListener)
    } else {
      eventListeners.clear()
    }

    if (eventListeners.size === 0) {
      this.listeners.delete(event)
    }
  }

  /**
   * 添加一次性事件监听器
   * @param event 事件名称
   * @param listener 监听器函数
   */
  once<K extends keyof EventMap>(event: K, listener: EventMap[K]): void {
    const onceListener = ((...args: unknown[]) => {
      this.off(event, onceListener as EventMap[K])
      ;(listener as EventListener)(...args)
    }) as EventMap[K]

    this.on(event, onceListener)
  }

  /**
   * 触发事件
   * @param event 事件名称
   * @param args 事件参数
   */
  emit<K extends keyof EventMap>(event: K, ...args: Parameters<EventMap[K]>): void {
    const eventListeners = this.listeners.get(event)
    if (!eventListeners) return

    eventListeners.forEach((listener) => {
      try {
        listener(...args)
      } catch (error) {
        console.error(`Error in event listener for '${event}':`, error)
      }
    })
  }

  /**
   * 移除所有事件监听器
   */
  removeAllListeners(): void {
    this.listeners.clear()
  }

  /**
   * 获取事件监听器数量
   * @param event 事件名称
   */
  listenerCount(event: keyof EventMap): number {
    return this.listeners.get(event)?.size || 0
  }

  /**
   * 获取所有事件名称
   */
  eventNames(): string[] {
    return Array.from(this.listeners.keys())
  }
}
