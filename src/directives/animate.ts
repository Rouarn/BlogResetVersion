import type { Directive, DirectiveBinding } from 'vue'

// 动画配置接口
interface AnimateOptions {
  name?: string
  duration?: number
  delay?: number
  iteration?: number | 'infinite'
  direction?: 'normal' | 'reverse' | 'alternate' | 'alternate-reverse'
  fillMode?: 'none' | 'forwards' | 'backwards' | 'both'
  timingFunction?: string
  trigger?: 'immediate' | 'hover' | 'click' | 'visible'
  disabled?: boolean
}

// 动画数据
interface AnimateData {
  observer?: IntersectionObserver
  isAnimated?: boolean
  originalTransform?: string
  originalTransition?: string
}

// 预定义动画
const animations = {
  fadeIn: {
    keyframes: [{ opacity: 0 }, { opacity: 1 }],
    options: { duration: 500, fill: 'forwards' },
  },
  fadeOut: {
    keyframes: [{ opacity: 1 }, { opacity: 0 }],
    options: { duration: 500, fill: 'forwards' },
  },
  slideInLeft: {
    keyframes: [
      { transform: 'translateX(-100%)', opacity: 0 },
      { transform: 'translateX(0)', opacity: 1 },
    ],
    options: { duration: 600, fill: 'forwards' },
  },
  slideInRight: {
    keyframes: [
      { transform: 'translateX(100%)', opacity: 0 },
      { transform: 'translateX(0)', opacity: 1 },
    ],
    options: { duration: 600, fill: 'forwards' },
  },
  slideInUp: {
    keyframes: [
      { transform: 'translateY(100%)', opacity: 0 },
      { transform: 'translateY(0)', opacity: 1 },
    ],
    options: { duration: 600, fill: 'forwards' },
  },
  slideInDown: {
    keyframes: [
      { transform: 'translateY(-100%)', opacity: 0 },
      { transform: 'translateY(0)', opacity: 1 },
    ],
    options: { duration: 600, fill: 'forwards' },
  },
  zoomIn: {
    keyframes: [
      { transform: 'scale(0)', opacity: 0 },
      { transform: 'scale(1)', opacity: 1 },
    ],
    options: { duration: 500, fill: 'forwards' },
  },
  zoomOut: {
    keyframes: [
      { transform: 'scale(1)', opacity: 1 },
      { transform: 'scale(0)', opacity: 0 },
    ],
    options: { duration: 500, fill: 'forwards' },
  },
  bounce: {
    keyframes: [
      { transform: 'translateY(0)' },
      { transform: 'translateY(-30px)' },
      { transform: 'translateY(0)' },
      { transform: 'translateY(-15px)' },
      { transform: 'translateY(0)' },
    ],
    options: { duration: 1000, fill: 'forwards' },
  },
  shake: {
    keyframes: [
      { transform: 'translateX(0)' },
      { transform: 'translateX(-10px)' },
      { transform: 'translateX(10px)' },
      { transform: 'translateX(-10px)' },
      { transform: 'translateX(10px)' },
      { transform: 'translateX(0)' },
    ],
    options: { duration: 500, fill: 'forwards' },
  },
  pulse: {
    keyframes: [{ transform: 'scale(1)' }, { transform: 'scale(1.1)' }, { transform: 'scale(1)' }],
    options: { duration: 800, fill: 'forwards' },
  },
  flip: {
    keyframes: [{ transform: 'rotateY(0)' }, { transform: 'rotateY(180deg)' }],
    options: { duration: 600, fill: 'forwards' },
  },
  rotate: {
    keyframes: [{ transform: 'rotate(0deg)' }, { transform: 'rotate(360deg)' }],
    options: { duration: 1000, fill: 'forwards' },
  },
}

// 执行动画
function playAnimation(el: HTMLElement, binding: DirectiveBinding<AnimateOptions | string>) {
  const animateData = (el as HTMLElement & { __animateData?: AnimateData }).__animateData
  if (!animateData || animateData.isAnimated) return

  const options = typeof binding.value === 'string' ? { name: binding.value } : binding.value || {}

  if (options.disabled || !options.name) return

  const {
    name = 'fadeIn',
    duration = 500,
    delay = 0,
    iteration = 1,
    direction = 'normal',
    fillMode = 'forwards',
    timingFunction = 'ease',
  } = options

  // 获取预定义动画
  const animation = animations[name as keyof typeof animations]
  if (!animation) {
    console.warn(`Animation '${name}' not found`)
    return
  }

  // 设置动画选项
  const animationOptions: KeyframeAnimationOptions = {
    duration,
    delay,
    iterations: typeof iteration === 'number' ? iteration : iteration === 'infinite' ? Infinity : undefined,
    direction,
    fill: fillMode as FillMode,
    easing: timingFunction,
  }

  // 执行动画
  const webAnimation = el.animate(animation.keyframes, animationOptions)
  animateData.isAnimated = true

  // 动画完成后重置状态
  webAnimation.addEventListener('finish', () => {
    if (iteration !== 'infinite') {
      animateData.isAnimated = false
    }
  })
}

// 处理可见性触发
function handleVisibilityTrigger(el: HTMLElement, binding: DirectiveBinding<AnimateOptions | string>) {
  const animateData = (el as HTMLElement & { __animateData?: AnimateData }).__animateData
  if (!animateData) return

  // 创建 Intersection Observer
  animateData.observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !animateData.isAnimated) {
          playAnimation(el, binding)
          // 一次性动画，观察完成后断开连接
          if (animateData.observer) {
            animateData.observer.disconnect()
          }
        }
      })
    },
    {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px',
    },
  )

  animateData.observer.observe(el)
}

// 处理悬停触发
function handleMouseEnter(event: Event) {
  const el = event.currentTarget as HTMLElement
  const binding = (el as HTMLElement & { __animateBinding?: DirectiveBinding<AnimateOptions | string> }).__animateBinding
  if (binding) playAnimation(el, binding)
}

// 处理点击触发
function handleClick(event: Event) {
  const el = event.currentTarget as HTMLElement
  const binding = (el as HTMLElement & { __animateBinding?: DirectiveBinding<AnimateOptions | string> }).__animateBinding
  if (binding) playAnimation(el, binding)
}

// 绑定动画
function bindAnimate(el: HTMLElement, binding: DirectiveBinding<AnimateOptions | string>) {
  const options = typeof binding.value === 'string' ? { name: binding.value } : binding.value || {}

  // 存储数据
  ;(el as HTMLElement & { __animateBinding?: DirectiveBinding<AnimateOptions | string>; __animateData?: AnimateData }).__animateBinding =
    binding
  ;(el as HTMLElement & { __animateBinding?: DirectiveBinding<AnimateOptions | string>; __animateData?: AnimateData }).__animateData = {
    originalTransform: el.style.transform,
    originalTransition: el.style.transition,
  }

  const { trigger = 'immediate' } = options

  // 根据触发方式绑定事件
  switch (trigger) {
    case 'immediate':
      // 立即执行动画
      setTimeout(() => playAnimation(el, binding), 0)
      break
    case 'hover':
      el.addEventListener('mouseenter', handleMouseEnter)
      break
    case 'click':
      el.addEventListener('click', handleClick)
      break
    case 'visible':
      handleVisibilityTrigger(el, binding)
      break
  }
}

// 解绑动画
function unbindAnimate(el: HTMLElement) {
  const animateData = (el as HTMLElement & { __animateData?: AnimateData }).__animateData

  // 断开观察器
  if (animateData?.observer) {
    animateData.observer.disconnect()
  }

  // 移除事件监听
  el.removeEventListener('mouseenter', handleMouseEnter)
  el.removeEventListener('click', handleClick)

  // 恢复原始样式
  if (animateData) {
    if (animateData.originalTransform !== undefined) {
      el.style.transform = animateData.originalTransform
    }
    if (animateData.originalTransition !== undefined) {
      el.style.transition = animateData.originalTransition
    }
  }

  // 清理数据
  delete (el as HTMLElement & { __animateBinding?: DirectiveBinding<AnimateOptions | string>; __animateData?: AnimateData })
    .__animateBinding
  delete (el as HTMLElement & { __animateBinding?: DirectiveBinding<AnimateOptions | string>; __animateData?: AnimateData }).__animateData
}

// 更新动画
function updateAnimate(el: HTMLElement, binding: DirectiveBinding<AnimateOptions | string>) {
  // 如果配置发生变化，重新绑定
  const oldBinding = (el as HTMLElement & { __animateBinding?: DirectiveBinding<AnimateOptions | string> }).__animateBinding
  if (JSON.stringify(oldBinding?.value) !== JSON.stringify(binding.value)) {
    unbindAnimate(el)
    bindAnimate(el, binding)
  }
}

// 动画指令
const animate: Directive<HTMLElement, AnimateOptions | string> = {
  mounted(el, binding) {
    bindAnimate(el, binding)
  },

  updated(el, binding) {
    updateAnimate(el, binding)
  },

  beforeUnmount(el) {
    unbindAnimate(el)
  },
}

export default animate
