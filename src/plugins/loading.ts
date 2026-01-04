import { useThemeStore } from '@/stores/modules/theme'
import type { App } from 'vue'

/* ---------------- 类型定义 ---------------- */
export interface LoadingAPI {
  /** 打开加载动画 */
  open(): void
  /** 关闭加载动画 */
  close(): void
  /** 是否正在加载 */
  isLoading(): boolean
  /** 设置加载文本 */
  setText(text: string): void
  /** 销毁实例 */
  destroy(): void
}

export interface LoadingOptions {
  /** 加载文本 */
  text?: string
  /** 背景色 */
  background?: string
  /** 主题色 */
  color?: string
  /** z-index */
  zIndex?: number
  /** 最小显示时间(ms) */
  minTime?: number
}

/* ---------------- 默认配置 ---------------- */
const DEFAULT_OPTIONS: Required<LoadingOptions> = {
  text: '加载中...',
  background: 'rgba(255, 255, 255, 0.9)',
  color: '#18a058',
  zIndex: 9999,
  minTime: 300,
}

/* ---------------- Loading 实现 ---------------- */
class ModernLoading implements LoadingAPI {
  private container: HTMLElement | null = null
  private isVisible = false
  private startTime = 0
  private options: Required<LoadingOptions>
  private loadingCount = 0
  private themeStore = useThemeStore()

  constructor(options: LoadingOptions = {}) {
    this.options = { ...DEFAULT_OPTIONS, ...options, color: this.themeStore.themeColor }
  }

  open(): void {
    this.loadingCount++
    if (this.isVisible) return

    this.startTime = Date.now()
    this.isVisible = true
    this.createContainer()
  }

  close(): void {
    this.loadingCount = Math.max(0, this.loadingCount - 1)
    if (this.loadingCount > 0) return

    if (!this.isVisible) return

    const elapsed = Date.now() - this.startTime
    const delay = Math.max(0, this.options.minTime - elapsed)

    setTimeout(() => {
      this.hideContainer()
    }, delay)
  }

  isLoading(): boolean {
    return this.isVisible
  }

  setText(text: string): void {
    this.options.text = text
    if (this.container) {
      const textEl = this.container.querySelector('.modern-loading-text')
      if (textEl) {
        textEl.textContent = text
      }
    }
  }

  destroy(): void {
    this.hideContainer()
    this.loadingCount = 0
  }

  private createContainer(): void {
    if (this.container) return

    // 创建容器
    this.container = document.createElement('div')
    this.container.className = 'modern-loading-container'
    this.container.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: ${this.options.background};
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      z-index: ${this.options.zIndex};
      backdrop-filter: blur(2px);
      opacity: 0;
      transition: opacity 0.3s ease;
    `

    // 创建加载动画
    const spinner = document.createElement('div')
    spinner.className = 'modern-loading-spinner'
    spinner.style.cssText = `
      width: 40px;
      height: 40px;
      border: 3px solid transparent;
      border-top: 3px solid ${this.options.color};
      border-radius: 50%;
      animation: modern-spin 1s linear infinite;
      margin-bottom: 16px;
      position: relative;
    `

    // 创建内圈
    const innerSpinner = document.createElement('div')
    innerSpinner.style.cssText = `
      position: absolute;
      top: 6px;
      left: 6px;
      right: 6px;
      bottom: 6px;
      border: 2px solid transparent;
      border-bottom: 2px solid ${this.options.color};
      border-radius: 50%;
      animation: modern-spin 0.8s linear infinite reverse;
      opacity: 0.6;
    `
    spinner.appendChild(innerSpinner)

    // 创建文本
    const text = document.createElement('div')
    text.className = 'modern-loading-text'
    text.textContent = this.options.text
    text.style.cssText = `
      font-size: 14px;
      color: ${this.options.color};
      font-weight: 500;
      letter-spacing: 0.5px;
    `

    // 添加样式
    this.addStyles()

    // 组装
    this.container.appendChild(spinner)
    this.container.appendChild(text)
    document.body.appendChild(this.container)

    // 触发显示动画
    requestAnimationFrame(() => {
      if (this.container) {
        this.container.style.opacity = '1'
      }
    })
  }

  private hideContainer(): void {
    if (!this.container) return

    this.container.style.opacity = '0'

    setTimeout(() => {
      if (this.container && this.container.parentNode) {
        this.container.parentNode.removeChild(this.container)
        this.container = null
        this.isVisible = false
      }
    }, 300)
  }

  private addStyles(): void {
    if (document.querySelector('#modern-loading-styles')) return

    const style = document.createElement('style')
    style.id = 'modern-loading-styles'
    style.textContent = `
      @keyframes modern-spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }

      .modern-loading-container {
        user-select: none;
        pointer-events: auto;
      }

      .modern-loading-spinner {
        filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
      }

      .modern-loading-text {
        text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
      }

      @media (prefers-reduced-motion: reduce) {
        .modern-loading-spinner,
        .modern-loading-spinner > div {
          animation-duration: 2s;
        }
      }
    `
    document.head.appendChild(style)
  }
}

/* ---------------- 插件安装 ---------------- */
let globalLoading: ModernLoading | null = null

export function setupLoading(app: App, options: LoadingOptions = {}): void {
  // 创建全局实例
  globalLoading = new ModernLoading(options)

  // 挂载到 window
  window.$loading = globalLoading

  // 提供给 Vue 应用
  app.provide('$loading', globalLoading)
  app.config.globalProperties.$loading = globalLoading
}

/* ---------------- 工厂函数 ---------------- */
export function createLoading(options: LoadingOptions = {}): LoadingAPI {
  return new ModernLoading(options)
}

/* ---------------- 默认导出 ---------------- */
export default {
  install: setupLoading,
}
