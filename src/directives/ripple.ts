import type { Directive, DirectiveBinding } from 'vue'

// 波纹效果配置接口
interface RippleOptions {
  color?: string
  opacity?: number
  duration?: number
  disabled?: boolean
}

// 波纹效果数据
interface RippleData {
  removeRipple?: () => void
}

// 创建波纹效果
function createRipple(event: MouseEvent, el: HTMLElement, options: RippleOptions) {
  const { color = 'rgba(255, 255, 255, 0.6)', opacity = 0.6, duration = 600 } = options

  // 获取元素位置和尺寸
  const rect = el.getBoundingClientRect()
  const size = Math.max(rect.width, rect.height)
  const x = event.clientX - rect.left - size / 2
  const y = event.clientY - rect.top - size / 2

  // 创建波纹元素
  const ripple = document.createElement('span')
  ripple.className = 'v-ripple-effect'
  ripple.style.cssText = `
    position: absolute;
    border-radius: 50%;
    background-color: ${color};
    opacity: ${opacity};
    pointer-events: none;
    transform: scale(0);
    animation: ripple-animation ${duration}ms ease-out;
    left: ${x}px;
    top: ${y}px;
    width: ${size}px;
    height: ${size}px;
    z-index: 1000;
  `

  // 添加动画样式
  if (!document.querySelector('#ripple-keyframes')) {
    const style = document.createElement('style')
    style.id = 'ripple-keyframes'
    style.textContent = `
      @keyframes ripple-animation {
        0% {
          transform: scale(0);
          opacity: ${opacity};
        }
        50% {
          opacity: ${opacity * 0.5};
        }
        100% {
          transform: scale(2);
          opacity: 0;
        }
      }
    `
    document.head.appendChild(style)
  }

  // 添加到元素中
  el.appendChild(ripple)

  // 动画结束后移除
  setTimeout(() => {
    if (ripple.parentNode) {
      ripple.parentNode.removeChild(ripple)
    }
  }, duration)
}

// 处理点击事件
function handleClick(event: MouseEvent) {
  const el = event.currentTarget as HTMLElement
  const rippleData = (el as HTMLElement & { __rippleData?: RippleData }).__rippleData

  if (!rippleData || !el) return

  const binding = (el as HTMLElement & { __rippleBinding?: DirectiveBinding<RippleOptions | boolean> }).__rippleBinding
  if (!binding) return
  const options = typeof binding.value === 'object' ? binding.value : {}

  if (options.disabled) return

  createRipple(event, el, options)
}

// 绑定事件
function bindRipple(el: HTMLElement, binding: DirectiveBinding<RippleOptions | boolean>) {
  // 确保元素有相对定位
  const position = getComputedStyle(el).position
  if (position === 'static') {
    el.style.position = 'relative'
  }

  // 确保元素有溢出隐藏
  el.style.overflow = 'hidden'

  // 存储绑定信息
  ;(el as HTMLElement & { __rippleBinding?: DirectiveBinding<RippleOptions | boolean>; __rippleData?: RippleData }).__rippleBinding =
    binding
  ;(el as HTMLElement & { __rippleBinding?: DirectiveBinding<RippleOptions | boolean>; __rippleData?: RippleData }).__rippleData = {}

  // 添加事件监听
  el.addEventListener('click', handleClick)
}

// 解绑事件
function unbindRipple(el: HTMLElement) {
  el.removeEventListener('click', handleClick)
  delete (el as HTMLElement & { __rippleBinding?: DirectiveBinding<RippleOptions | boolean>; __rippleData?: RippleData }).__rippleBinding
  delete (el as HTMLElement & { __rippleBinding?: DirectiveBinding<RippleOptions | boolean>; __rippleData?: RippleData }).__rippleData
}

// 更新配置
function updateRipple(el: HTMLElement, binding: DirectiveBinding<RippleOptions | boolean>) {
  ;(el as HTMLElement & { __rippleBinding?: DirectiveBinding<RippleOptions | boolean> }).__rippleBinding = binding
}

// 波纹指令
const ripple: Directive<HTMLElement, RippleOptions | boolean> = {
  mounted(el, binding) {
    bindRipple(el, binding)
  },

  updated(el, binding) {
    updateRipple(el, binding)
  },

  beforeUnmount(el) {
    unbindRipple(el)
  },
}

export default ripple
