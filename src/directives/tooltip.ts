import type { Directive, DirectiveBinding } from 'vue'

// 提示框配置接口
interface TooltipOptions {
  content?: string
  placement?: 'top' | 'bottom' | 'left' | 'right'
  trigger?: 'hover' | 'click' | 'focus'
  delay?: number
  offset?: number
  disabled?: boolean
  theme?: 'dark' | 'light'
  maxWidth?: number
}

// 提示框数据
interface TooltipData {
  tooltip?: HTMLElement
  showTimer?: number
  hideTimer?: number
  isVisible?: boolean
}

// 创建提示框元素
function createTooltip(content: string, options: TooltipOptions): HTMLElement {
  const { theme = 'dark', maxWidth = 200 } = options

  const tooltip = document.createElement('div')
  tooltip.className = `v-tooltip v-tooltip-${theme}`
  tooltip.innerHTML = content

  // 基础样式
  tooltip.style.cssText = `
    position: absolute;
    z-index: 9999;
    padding: 8px 12px;
    border-radius: 4px;
    font-size: 12px;
    line-height: 1.4;
    word-wrap: break-word;
    max-width: ${maxWidth}px;
    pointer-events: none;
    opacity: 0;
    transform: scale(0.8);
    transition: all 0.15s ease;
    ${
      theme === 'dark'
        ? 'background: rgba(0, 0, 0, 0.9); color: white; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);'
        : 'background: white; color: #333; border: 1px solid #e0e0e0; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);'
    }
  `

  return tooltip
}

// 计算提示框位置
function calculatePosition(el: HTMLElement, tooltip: HTMLElement, placement: string, offset: number) {
  const elRect = el.getBoundingClientRect()
  const tooltipRect = tooltip.getBoundingClientRect()
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop
  const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft

  let top = 0
  let left = 0

  switch (placement) {
    case 'top':
      top = elRect.top + scrollTop - tooltipRect.height - offset
      left = elRect.left + scrollLeft + (elRect.width - tooltipRect.width) / 2
      break
    case 'bottom':
      top = elRect.bottom + scrollTop + offset
      left = elRect.left + scrollLeft + (elRect.width - tooltipRect.width) / 2
      break
    case 'left':
      top = elRect.top + scrollTop + (elRect.height - tooltipRect.height) / 2
      left = elRect.left + scrollLeft - tooltipRect.width - offset
      break
    case 'right':
      top = elRect.top + scrollTop + (elRect.height - tooltipRect.height) / 2
      left = elRect.right + scrollLeft + offset
      break
  }

  // 边界检测
  const viewportWidth = window.innerWidth
  const viewportHeight = window.innerHeight

  if (left < 0) left = 8
  if (left + tooltipRect.width > viewportWidth) left = viewportWidth - tooltipRect.width - 8
  if (top < scrollTop) top = scrollTop + 8
  if (top + tooltipRect.height > scrollTop + viewportHeight) {
    top = scrollTop + viewportHeight - tooltipRect.height - 8
  }

  return { top, left }
}

// 显示提示框
function showTooltip(el: HTMLElement, binding: DirectiveBinding<TooltipOptions | string>) {
  const tooltipData = (el as HTMLElement & { __tooltipData?: TooltipData }).__tooltipData
  if (!tooltipData || tooltipData.isVisible) return

  const options = typeof binding.value === 'string' ? { content: binding.value } : binding.value || {}

  if (options.disabled || !options.content) return

  const { content = '', placement = 'top', delay = 0, offset = 8 } = options

  // 清除隐藏定时器
  if (tooltipData.hideTimer) {
    clearTimeout(tooltipData.hideTimer)
    tooltipData.hideTimer = undefined
  }

  // 设置显示定时器
  tooltipData.showTimer = window.setTimeout(() => {
    if (!tooltipData.tooltip) {
      tooltipData.tooltip = createTooltip(content, options)
      document.body.appendChild(tooltipData.tooltip)
    }

    // 更新内容
    tooltipData.tooltip.innerHTML = content

    // 计算位置
    const position = calculatePosition(el, tooltipData.tooltip, placement, offset)
    tooltipData.tooltip.style.top = `${position.top}px`
    tooltipData.tooltip.style.left = `${position.left}px`

    // 显示动画
    requestAnimationFrame(() => {
      if (tooltipData.tooltip) {
        tooltipData.tooltip.style.opacity = '1'
        tooltipData.tooltip.style.transform = 'scale(1)'
        tooltipData.isVisible = true
      }
    })
  }, delay)
}

// 隐藏提示框
function hideTooltip(el: HTMLElement) {
  const tooltipData = (el as HTMLElement & { __tooltipData?: TooltipData }).__tooltipData
  if (!tooltipData) return

  // 清除显示定时器
  if (tooltipData.showTimer) {
    clearTimeout(tooltipData.showTimer)
    tooltipData.showTimer = undefined
  }

  if (tooltipData.tooltip && tooltipData.isVisible) {
    tooltipData.tooltip.style.opacity = '0'
    tooltipData.tooltip.style.transform = 'scale(0.8)'
    tooltipData.isVisible = false

    tooltipData.hideTimer = window.setTimeout(() => {
      if (tooltipData.tooltip && tooltipData.tooltip.parentNode) {
        tooltipData.tooltip.parentNode.removeChild(tooltipData.tooltip)
        tooltipData.tooltip = undefined
      }
    }, 150)
  }
}

// 事件处理函数
function handleMouseEnter(event: Event) {
  const el = event.currentTarget as HTMLElement
  const binding = (el as HTMLElement & { __tooltipBinding?: DirectiveBinding<TooltipOptions | string> }).__tooltipBinding
  if (!binding) return
  const options = typeof binding.value === 'string' ? {} : binding.value || {}

  if (options.trigger === 'hover' || !options.trigger) {
    showTooltip(el, binding)
  }
}

function handleMouseLeave(event: Event) {
  const el = event.currentTarget as HTMLElement
  const binding = (el as HTMLElement & { __tooltipBinding?: DirectiveBinding<TooltipOptions | string> }).__tooltipBinding
  if (!binding) return
  const options = typeof binding.value === 'string' ? {} : binding.value || {}

  if (options.trigger === 'hover' || !options.trigger) {
    hideTooltip(el)
  }
}

function handleClick(event: Event) {
  const el = event.currentTarget as HTMLElement
  const binding = (el as HTMLElement & { __tooltipBinding?: DirectiveBinding<TooltipOptions | string> }).__tooltipBinding
  if (!binding) return
  const options = typeof binding.value === 'string' ? {} : binding.value || {}

  if (options.trigger === 'click') {
    const tooltipData = (el as HTMLElement & { __tooltipData?: TooltipData }).__tooltipData
    if (tooltipData?.isVisible) {
      hideTooltip(el)
    } else {
      showTooltip(el, binding)
    }
  }
}

function handleFocus(event: Event) {
  const el = event.currentTarget as HTMLElement
  const binding = (el as HTMLElement & { __tooltipBinding?: DirectiveBinding<TooltipOptions | string> }).__tooltipBinding
  if (!binding) return
  const options = typeof binding.value === 'string' ? {} : binding.value || {}

  if (options.trigger === 'focus') {
    showTooltip(el, binding)
  }
}

function handleBlur(event: Event) {
  const el = event.currentTarget as HTMLElement
  const binding = (el as HTMLElement & { __tooltipBinding?: DirectiveBinding<TooltipOptions | string> }).__tooltipBinding
  if (!binding) return
  const options = typeof binding.value === 'string' ? {} : binding.value || {}

  if (options.trigger === 'focus') {
    hideTooltip(el)
  }
}

// 绑定事件
function bindTooltip(el: HTMLElement, binding: DirectiveBinding<TooltipOptions | string>) {
  // 存储数据
  ;(el as HTMLElement & { __tooltipBinding?: DirectiveBinding<TooltipOptions | string>; __tooltipData?: TooltipData }).__tooltipBinding =
    binding
  ;(el as HTMLElement & { __tooltipBinding?: DirectiveBinding<TooltipOptions | string>; __tooltipData?: TooltipData }).__tooltipData = {}

  // 添加事件监听
  el.addEventListener('mouseenter', handleMouseEnter)
  el.addEventListener('mouseleave', handleMouseLeave)
  el.addEventListener('click', handleClick)
  el.addEventListener('focus', handleFocus)
  el.addEventListener('blur', handleBlur)
}

// 解绑事件
function unbindTooltip(el: HTMLElement) {
  // 隐藏提示框
  hideTooltip(el)

  // 移除事件监听
  el.removeEventListener('mouseenter', handleMouseEnter)
  el.removeEventListener('mouseleave', handleMouseLeave)
  el.removeEventListener('click', handleClick)
  el.removeEventListener('focus', handleFocus)
  el.removeEventListener('blur', handleBlur)

  // 清理数据
  delete (el as HTMLElement & { __tooltipBinding?: DirectiveBinding<TooltipOptions | string>; __tooltipData?: TooltipData })
    .__tooltipBinding
  delete (el as HTMLElement & { __tooltipBinding?: DirectiveBinding<TooltipOptions | string>; __tooltipData?: TooltipData }).__tooltipData
}

// 更新配置
function updateTooltip(el: HTMLElement, binding: DirectiveBinding<TooltipOptions | string>) {
  ;(el as HTMLElement & { __tooltipBinding?: DirectiveBinding<TooltipOptions | string> }).__tooltipBinding = binding
}

// 提示框指令
const tooltip: Directive<HTMLElement, TooltipOptions | string> = {
  mounted(el, binding) {
    bindTooltip(el, binding)
  },

  updated(el, binding) {
    updateTooltip(el, binding)
  },

  beforeUnmount(el) {
    unbindTooltip(el)
  },
}

export default tooltip
