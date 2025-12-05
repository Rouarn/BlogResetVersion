import type { Directive, DirectiveBinding } from 'vue'

// 扩展 CSSStyleDeclaration 类型
declare global {
  interface CSSStyleDeclaration {
    msOverflowStyle?: string
    webkitOverflowScrolling?: string
  }
}

// 扩展 CSSStyleDeclaration 接口以支持非标准 CSS 属性
type ExtendedCSSStyleDeclaration = CSSStyleDeclaration & {
  scrollbarWidth?: string
  msOverflowStyle?: string
}

// 滚动数据接口
interface ScrollData {
  position: number
  percentage: number
  direction: string
  velocity: number
}

// 滚动配置接口
interface ScrollOptions {
  direction?: 'vertical' | 'horizontal' | 'both'
  threshold?: number
  smooth?: boolean
  showScrollbar?: boolean
  autoScroll?: boolean
  autoScrollSpeed?: number
  responsive?: boolean
  mobileOptimized?: boolean
  touchEnabled?: boolean
  momentum?: boolean
  wheelHorizontal?: boolean // 新增：支持鼠标滚轮水平滚动
  onScroll?: (data: ScrollData) => void
  onScrollStart?: () => void
  onScrollEnd?: () => void
  onEnter?: (el: HTMLElement) => void
  onLeave?: (el: HTMLElement) => void
}

// 滚动状态数据
interface ScrollState {
  isScrolling: boolean
  lastScrollTop: number
  lastScrollLeft: number
  lastTimestamp: number
  velocity: number
  direction: string
  scrollEndTimer?: number
  autoScrollTimer?: number
  resizeObserver?: ResizeObserver
}

// 扩展元素类型
interface ElType extends HTMLElement {
  __scrollState?: ScrollState
  __scrollHandler?: () => void
  __wheelHandler?: (event: WheelEvent) => void
  scrollbarWidth?: number
}

// 计算滚动百分比
function calculatePercentage(element: HTMLElement, direction: string): number {
  if (direction === 'horizontal') {
    const maxScroll = element.scrollWidth - element.clientWidth
    return maxScroll > 0 ? (element.scrollLeft / maxScroll) * 100 : 0
  } else {
    const maxScroll = element.scrollHeight - element.clientHeight
    return maxScroll > 0 ? (element.scrollTop / maxScroll) * 100 : 0
  }
}

// 计算滚动方向
function calculateDirection(currentTop: number, currentLeft: number, lastTop: number, lastLeft: number, direction: string): string {
  if (direction === 'horizontal') {
    if (currentLeft > lastLeft) return 'right'
    if (currentLeft < lastLeft) return 'left'
  } else if (direction === 'vertical') {
    if (currentTop > lastTop) return 'down'
    if (currentTop < lastTop) return 'up'
  } else if (direction === 'both') {
    const vDiff = Math.abs(currentTop - lastTop)
    const hDiff = Math.abs(currentLeft - lastLeft)
    if (vDiff > hDiff) {
      return currentTop > lastTop ? 'down' : 'up'
    } else if (hDiff > 0) {
      return currentLeft > lastLeft ? 'right' : 'left'
    }
  }
  return 'none'
}

// 处理滚动事件
function handleScroll(element: HTMLElement, options: ScrollOptions, state: ScrollState) {
  const now = Date.now()
  const deltaTime = now - state.lastTimestamp

  const currentTop = element.scrollTop
  const currentLeft = element.scrollLeft

  // 计算滚动速度
  if (deltaTime > 0) {
    const deltaY = Math.abs(currentTop - state.lastScrollTop)
    const deltaX = Math.abs(currentLeft - state.lastScrollLeft)
    const delta = options.direction === 'horizontal' ? deltaX : deltaY
    state.velocity = (delta / deltaTime) * 1000 // px/s
  }

  // 计算滚动方向
  const direction = calculateDirection(currentTop, currentLeft, state.lastScrollTop, state.lastScrollLeft, options.direction || 'vertical')

  // 计算滚动百分比
  const percentage = calculatePercentage(element, options.direction || 'vertical')

  // 计算滚动位置
  const position = options.direction === 'horizontal' ? currentLeft : currentTop

  // 创建滚动数据
  const scrollData: ScrollData = {
    position,
    percentage,
    direction,
    velocity: state.velocity,
  }

  // 触发滚动回调
  if (options.onScroll) {
    options.onScroll(scrollData)
  }

  // 更新状态
  state.lastScrollTop = currentTop
  state.lastScrollLeft = currentLeft
  state.lastTimestamp = now
  state.direction = direction

  // 处理滚动开始
  if (!state.isScrolling) {
    state.isScrolling = true
    if (options.onScrollStart) {
      options.onScrollStart()
    }
  }

  // 处理滚动结束
  if (state.scrollEndTimer) {
    clearTimeout(state.scrollEndTimer)
  }

  state.scrollEndTimer = window.setTimeout(() => {
    state.isScrolling = false
    if (options.onScrollEnd) {
      options.onScrollEnd()
    }
  }, 150)
}

// 处理鼠标滚轮事件（支持水平滚动）
function handleWheel(event: WheelEvent, element: HTMLElement, options: ScrollOptions) {
  // 只在水平滚动模式下处理
  if (options.direction === 'horizontal' && options.wheelHorizontal !== false) {
    event.preventDefault()

    // 根据滚轮方向计算滚动距离
    const deltaY = event.deltaY || event.detail || 0
    const scrollAmount = deltaY * 2 // 调整滚动灵敏度

    // 执行水平滚动
    element.scrollLeft += scrollAmount
  }

  // 支持双向滚动
  if (options.direction === 'both') {
    // 检测 Shift 键按下，切换为水平滚动
    if (event.shiftKey) {
      event.preventDefault()
      const deltaY = event.deltaY || event.detail || 0
      const scrollAmount = deltaY * 2
      element.scrollLeft += scrollAmount
    }
  }
}

// 启动自动滚动
function startAutoScroll(element: HTMLElement, options: ScrollOptions, state: ScrollState) {
  if (!options.autoScroll || state.autoScrollTimer) return

  const speed = options.autoScrollSpeed || 50
  const direction = options.direction || 'vertical'

  state.autoScrollTimer = window.setInterval(() => {
    if (direction === 'horizontal') {
      element.scrollLeft += speed / 20
      if (element.scrollLeft >= element.scrollWidth - element.clientWidth) {
        element.scrollLeft = 0
      }
    } else {
      element.scrollTop += speed / 20
      if (element.scrollTop >= element.scrollHeight - element.clientHeight) {
        element.scrollTop = 0
      }
    }
  }, 50)
}

// 停止自动滚动
function stopAutoScroll(state: ScrollState) {
  if (state.autoScrollTimer) {
    clearInterval(state.autoScrollTimer)
    state.autoScrollTimer = undefined
  }
}

// 设置滚动条样式
function setScrollbarStyle(element: HTMLElement, options: ScrollOptions) {
  if (options.showScrollbar === false) {
    // 使用扩展接口处理非标准 CSS 属性
    const extendedStyle = element.style as ExtendedCSSStyleDeclaration
    extendedStyle.scrollbarWidth = 'none'
    // 处理 IE/Edge 滚动条隐藏
    extendedStyle.msOverflowStyle = 'none'

    // 添加 webkit 滚动条隐藏样式
    const style = document.createElement('style')
    style.textContent = `
      .v-scroll-hidden::-webkit-scrollbar {
        display: none;
      }
    `
    document.head.appendChild(style)
    element.classList.add('v-scroll-hidden')
  }

  // 设置平滑滚动
  if (options.smooth) {
    element.style.scrollBehavior = 'smooth'
  }
}

// 检测移动设备
function detectMobileDevice(): boolean {
  const userAgent = navigator.userAgent.toLowerCase()
  const mobileKeywords = ['mobile', 'android', 'iphone', 'ipod', 'blackberry', 'windows phone']
  const isMobileUA = mobileKeywords.some((keyword) => userAgent.includes(keyword))
  const isMobileScreen = window.innerWidth <= 768
  const hasTouch = 'ontouchstart' in window

  return isMobileUA || (isMobileScreen && hasTouch)
}

// 检测平板设备
function detectTabletDevice(): boolean {
  const userAgent = navigator.userAgent.toLowerCase()
  const tabletKeywords = ['ipad', 'tablet', 'kindle']
  const isTabletUA = tabletKeywords.some((keyword) => userAgent.includes(keyword))
  const isTabletScreen = window.innerWidth > 768 && window.innerWidth <= 1024
  const hasTouch = 'ontouchstart' in window

  return isTabletUA || (isTabletScreen && hasTouch && !detectMobileDevice())
}

// 更新设备显示状态
function updateDeviceDisplay(isMobile: boolean, isTablet: boolean) {
  // 查找所有设备标签页
  const deviceTabs = document.querySelectorAll('.device-tabs .tab')

  deviceTabs.forEach((tab) => {
    tab.classList.remove('active')
  })

  // 根据设备类型激活相应标签
  if (isMobile) {
    deviceTabs[2]?.classList.add('active') // 移动端
  } else if (isTablet) {
    deviceTabs[1]?.classList.add('active') // 平板端
  } else {
    deviceTabs[0]?.classList.add('active') // 桌面端
  }
}

// 设置响应式优化
function setupResponsive(element: HTMLElement, options: ScrollOptions, state: ScrollState) {
  if (!options.responsive) return

  // 检测设备类型
  const isMobile = detectMobileDevice()
  const isTablet = detectTabletDevice()

  // 动态更新设备显示状态
  updateDeviceDisplay(isMobile, isTablet)

  // 监听尺寸变化
  state.resizeObserver = new ResizeObserver(() => {
    // 重新检测设备类型
    const newIsMobile = detectMobileDevice()
    const newIsTablet = detectTabletDevice()
    updateDeviceDisplay(newIsMobile, newIsTablet)

    // 重新计算滚动参数
    if (options.onScroll) {
      const percentage = calculatePercentage(element, options.direction || 'vertical')
      const position = options.direction === 'horizontal' ? element.scrollLeft : element.scrollTop

      options.onScroll({
        position,
        percentage,
        direction: state.direction,
        velocity: state.velocity,
      })
    }
  })

  state.resizeObserver.observe(element)

  // 移动端优化
  if (options.mobileOptimized && isMobile) {
    // 使用类型断言处理 webkit 滚动优化
    element.style.webkitOverflowScrolling = 'touch'
    element.style.overscrollBehavior = 'contain'

    // 移动端禁用鼠标滚轮水平滚动
    options.wheelHorizontal = false
  }
}

// 清理函数
function cleanup(element: HTMLElement, state: ScrollState) {
  stopAutoScroll(state)

  if (state.scrollEndTimer) {
    clearTimeout(state.scrollEndTimer)
  }

  if (state.resizeObserver) {
    state.resizeObserver.disconnect()
  }

  element.classList.remove('v-scroll-hidden')
}

const scroll: Directive<HTMLElement, ScrollOptions | undefined> = {
  mounted(el: HTMLElement, binding: DirectiveBinding<ScrollOptions | undefined>) {
    const options = binding.value || {}

    // 创建滚动状态
    const state: ScrollState = {
      isScrolling: false,
      lastScrollTop: el.scrollTop,
      lastScrollLeft: el.scrollLeft,
      lastTimestamp: Date.now(),
      velocity: 0,
      direction: 'none',
    }

    // 存储状态到元素上
    ;(el as ElType).__scrollState = state

    // 设置样式
    setScrollbarStyle(el, options)

    // 设置响应式
    setupResponsive(el, options, state)

    // 绑定滚动事件
    const scrollHandler = () => handleScroll(el, options, state)
    el.addEventListener('scroll', scrollHandler, { passive: true })

    // 绑定鼠标滚轮事件（支持水平滚动）
    const wheelHandler = (event: WheelEvent) => handleWheel(event, el, options)
    if (options.direction === 'horizontal' || options.direction === 'both') {
      el.addEventListener('wheel', wheelHandler, { passive: false })
    }

    // 存储事件处理器以便清理
    ;(el as HTMLElement & { __scrollHandler?: () => void; __wheelHandler?: (event: WheelEvent) => void }).__scrollHandler = scrollHandler
    ;(el as HTMLElement & { __scrollHandler?: () => void; __wheelHandler?: (event: WheelEvent) => void }).__wheelHandler = wheelHandler

    // 启动自动滚动
    if (options.autoScroll) {
      startAutoScroll(el, options, state)
    }
  },

  updated(el: HTMLElement, binding: DirectiveBinding<ScrollOptions | undefined>) {
    const options = binding.value || {}
    const elementWithState = el as HTMLElement & { __scrollState?: ScrollState }
    const state = elementWithState.__scrollState

    if (!state) return

    // 更新自动滚动
    if (options.autoScroll) {
      startAutoScroll(el, options, state)
    } else {
      stopAutoScroll(state)
    }

    // 更新样式
    setScrollbarStyle(el, options)
  },

  unmounted(el: HTMLElement) {
    const elementWithHandlers = el as HTMLElement & {
      __scrollState?: ScrollState
      __scrollHandler?: () => void
      __wheelHandler?: (event: WheelEvent) => void
    }
    const state = elementWithHandlers.__scrollState
    const scrollHandler = elementWithHandlers.__scrollHandler
    const wheelHandler = elementWithHandlers.__wheelHandler

    if (scrollHandler) {
      el.removeEventListener('scroll', scrollHandler)
    }

    if (wheelHandler) {
      el.removeEventListener('wheel', wheelHandler)
    }

    if (state) {
      cleanup(el, state)
    }

    // 清理引用
    delete elementWithHandlers.__scrollState
    delete elementWithHandlers.__scrollHandler
    delete elementWithHandlers.__wheelHandler
  },
}

export default scroll
