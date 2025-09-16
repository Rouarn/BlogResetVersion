import type { Directive, DirectiveBinding } from 'vue'

interface LazyElement extends HTMLImageElement {
  __lazyObserver__?: IntersectionObserver
  __lazyLoaded__?: boolean
  __lazyOriginalSrc__?: string
}

interface LazyOptions {
  src: string
  loading?: string // 加载中的占位图
  error?: string // 加载失败的占位图
  threshold?: number // 触发加载的阈值
  rootMargin?: string // 根边距
}

/**
 * v-lazy 图片懒加载指令
 * 用法：
 * <img v-lazy="imageSrc" />
 * <img v-lazy="{ src: imageSrc, loading: loadingImg, error: errorImg }" />
 */
/**
 * 创建占位符 Data URL
 */
function createPlaceholderDataURL(width: number, height: number, backgroundColor: string, text: string): string {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')!

  canvas.width = width
  canvas.height = height

  // 设置背景色
  ctx.fillStyle = backgroundColor
  ctx.fillRect(0, 0, width, height)

  // 设置文字
  ctx.fillStyle = '#999'
  ctx.font = '14px Arial'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(text, width / 2, height / 2)

  return canvas.toDataURL()
}

function parseOptions(value: unknown): LazyOptions {
  if (typeof value === 'string') {
    return { src: value }
  }

  if (typeof value === 'object' && value !== null) {
    const config = value as Record<string, unknown>
    return {
      src: config.src as string,
      loading: config.loading as string | undefined,
      error: config.error as string | undefined,
      threshold: config.threshold as number | undefined,
      rootMargin: config.rootMargin as string | undefined,
    }
  }

  throw new Error('v-lazy: 指令值必须是字符串或对象')
}

// 处理图片加载错误
function handleImageError(el: LazyElement, options: LazyOptions) {
  // 加载失败，设置错误占位图
  if (options.error) {
    el.src = options.error
  } else {
    // 设置默认的错误占位符
    el.src = createPlaceholderDataURL(el.width || 300, el.height || 200, '#ffebee', '加载失败')
  }

  el.classList.remove('lazy-loading')
  el.classList.add('lazy-error')

  // 触发自定义事件
  el.dispatchEvent(
    new CustomEvent('lazy-error', {
      detail: { src: options.src },
    }),
  )
}

function loadImage(el: LazyElement, binding: DirectiveBinding) {
  const options = parseOptions(binding.value)

  // 防止重复加载
  if (el.classList.contains('lazy-loading') || el.__lazyLoaded__) {
    return
  }

  el.classList.add('lazy-loading')

  // 创建新的图片对象来预加载
  const img = new Image()

  // 设置超时处理
  const timeoutId = window.setTimeout(() => {
    img.onload = null
    img.onerror = null
    handleImageError(el, options)
  }, 10000) // 10秒超时

  img.onload = () => {
    clearTimeout(timeoutId)
    // 加载成功，设置图片源
    el.src = options.src
    el.__lazyLoaded__ = true
    el.classList.remove('lazy-loading')

    // 添加加载完成的类名，可用于 CSS 动画
    el.classList.add('lazy-loaded')

    // 触发自定义事件
    el.dispatchEvent(
      new CustomEvent('lazy-loaded', {
        detail: { src: options.src },
      }),
    )
  }

  img.onerror = () => {
    clearTimeout(timeoutId)
    handleImageError(el, options)
  }

  // 开始加载图片
  img.src = options.src
}

// 节流函数
function throttle<T extends (...args: Parameters<T>) => void>(func: T, delay: number): T {
  let timeoutId: number | null = null
  let lastExecTime = 0

  return ((...args: Parameters<T>) => {
    const currentTime = Date.now()

    if (currentTime - lastExecTime > delay) {
      func(...args)
      lastExecTime = currentTime
    } else {
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
      timeoutId = window.setTimeout(
        () => {
          func(...args)
          lastExecTime = Date.now()
          timeoutId = null
        },
        delay - (currentTime - lastExecTime),
      )
    }
  }) as T
}

function setupLazyLoading(el: LazyElement, binding: DirectiveBinding) {
  const options = parseOptions(binding.value)

  // 保存原始 src
  el.__lazyOriginalSrc__ = options.src

  // 设置加载中的占位图
  if (options.loading) {
    el.src = options.loading
  } else {
    // 设置默认的加载占位符
    el.src = createPlaceholderDataURL(el.width || 300, el.height || 200, '#f0f0f0', '加载中...')
  }

  // 节流处理 IntersectionObserver 回调
  const throttledCallback = throttle((entries: IntersectionObserverEntry[]) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && !el.__lazyLoaded__) {
        loadImage(el, binding)
        el.__lazyObserver__?.unobserve(el)
      }
    })
  }, 100) // 100ms 节流

  // 创建 IntersectionObserver
  const observer = new IntersectionObserver(throttledCallback, {
    threshold: options.threshold || 0.1,
    rootMargin: options.rootMargin || '50px',
  })

  // 保存观察器引用
  el.__lazyObserver__ = observer

  // 开始观察
  observer.observe(el)
}

const lazy: Directive = {
  mounted(el: LazyElement, binding: DirectiveBinding) {
    // 检查浏览器是否支持 IntersectionObserver
    if (!window.IntersectionObserver) {
      // 不支持则直接加载图片
      loadImage(el, binding)
      return
    }

    setupLazyLoading(el, binding)
  },

  updated(el: LazyElement, binding: DirectiveBinding) {
    // 如果 src 发生变化，重新设置懒加载
    const newSrc = typeof binding.value === 'string' ? binding.value : binding.value?.src
    const oldSrc = el.__lazyOriginalSrc__

    if (newSrc !== oldSrc) {
      // 清理旧的观察器
      if (el.__lazyObserver__) {
        el.__lazyObserver__.unobserve(el)
        el.__lazyObserver__.disconnect()
      }

      // 重置状态
      el.__lazyLoaded__ = false
      el.__lazyOriginalSrc__ = newSrc

      // 重新设置懒加载
      setupLazyLoading(el, binding)
    }
  },

  beforeUnmount(el: LazyElement) {
    // 清理观察器
    if (el.__lazyObserver__) {
      el.__lazyObserver__.unobserve(el)
      el.__lazyObserver__.disconnect()
      delete el.__lazyObserver__
    }

    // 清理元素状态
    el.classList.remove('lazy-loading', 'lazy-loaded', 'lazy-error')
    delete el.__lazyLoaded__
    delete el.__lazyOriginalSrc__
  },
}

// 导出懒加载辅助函数
export const LazyHelper = {
  /**
   * 手动触发图片加载
   */
  loadImage(el: HTMLImageElement) {
    const lazyEl = el as LazyElement
    if (lazyEl.__lazyOriginalSrc__ && !lazyEl.__lazyLoaded__) {
      const img = new Image()
      img.onload = () => {
        el.src = lazyEl.__lazyOriginalSrc__!
        lazyEl.__lazyLoaded__ = true
        el.classList.add('lazy-loaded')
      }
      img.src = lazyEl.__lazyOriginalSrc__
    }
  },

  /**
   * 检查图片是否已加载
   */
  isLoaded(el: HTMLImageElement): boolean {
    return (el as LazyElement).__lazyLoaded__ || false
  },
}

export default lazy
