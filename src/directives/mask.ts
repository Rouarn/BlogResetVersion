import type { Directive, DirectiveBinding } from 'vue'

// 遮罩配置接口
interface MaskOptions {
  visible?: boolean
  background?: string
  opacity?: number
  zIndex?: number
  clickToClose?: boolean
  content?: string
  contentStyle?: Record<string, string>
}

// 扩展元素接口
interface MaskElement extends HTMLElement {
  __maskInstance__?: HTMLElement
  __maskClickHandler__?: (event: Event) => void
}

// 移除遮罩
function removeMask(el: MaskElement) {
  if (el.__maskInstance__) {
    // 移除点击事件监听器
    if (el.__maskClickHandler__) {
      el.__maskInstance__.removeEventListener('click', el.__maskClickHandler__)
      delete el.__maskClickHandler__
    }

    // 移除遮罩元素
    el.removeChild(el.__maskInstance__)
    delete el.__maskInstance__

    // 恢复元素的原始定位
    if (el.style.position === 'relative' && !el.dataset.originalPosition) {
      el.style.position = ''
    } else if (el.dataset.originalPosition) {
      el.style.position = el.dataset.originalPosition
      delete el.dataset.originalPosition
    }
  }
}

// 显示遮罩
function showMask(el: MaskElement, options: MaskOptions) {
  // 如果已经有遮罩，先移除
  if (el.__maskInstance__) {
    removeMask(el)
  }

  // 获取配置选项
  const { background = 'rgba(0, 0, 0, 0.5)', opacity = 1, zIndex = 9999, clickToClose = false, content = '', contentStyle = {} } = options

  // 确保父元素有相对定位
  if (getComputedStyle(el).position === 'static') {
    el.dataset.originalPosition = el.style.position || 'static'
    el.style.position = 'relative'
  }

  // 创建遮罩层
  const maskEl = document.createElement('div')
  maskEl.style.cssText = `
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: ${background};
    opacity: ${opacity};
    z-index: ${zIndex};
    display: flex;
    align-items: center;
    justify-content: center;
    transition: opacity 0.3s ease;
    ${clickToClose ? 'cursor: pointer;' : ''}
  `

  // 如果有内容，创建内容容器
  if (content) {
    const contentEl = document.createElement('div')
    contentEl.innerHTML = content

    // 应用内容样式
    const defaultContentStyle = {
      color: 'white',
      fontSize: '16px',
      textAlign: 'center',
      padding: '20px',
      borderRadius: '4px',
      background: 'rgba(0, 0, 0, 0.8)',
      maxWidth: '80%',
      wordWrap: 'break-word',
    }

    const finalContentStyle = { ...defaultContentStyle, ...contentStyle }

    Object.entries(finalContentStyle).forEach(([key, value]) => {
      const cssKey = key.replace(/([A-Z])/g, '-$1').toLowerCase()
      contentEl.style.setProperty(cssKey, value as string)
    })

    maskEl.appendChild(contentEl)
  }

  // 添加点击关闭功能
  if (clickToClose) {
    const clickHandler = (event: Event) => {
      // 只有点击遮罩本身（不是内容区域）才关闭
      if (event.target === maskEl) {
        removeMask(el)
        // 触发自定义事件
        el.dispatchEvent(new CustomEvent('mask-close', { detail: { reason: 'click' } }))
      }
    }

    maskEl.addEventListener('click', clickHandler)
    el.__maskClickHandler__ = clickHandler
  }

  // 添加遮罩到元素
  el.appendChild(maskEl)
  el.__maskInstance__ = maskEl

  // 触发显示动画
  requestAnimationFrame(() => {
    maskEl.style.opacity = opacity.toString()
  })
}

// 更新遮罩
function updateMask(el: MaskElement, binding: DirectiveBinding<boolean | MaskOptions>) {
  const value = binding.value

  if (typeof value === 'boolean') {
    if (value) {
      showMask(el, {})
    } else {
      removeMask(el)
    }
  } else if (typeof value === 'object' && value !== null) {
    const options = value as MaskOptions
    if (options.visible === true) {
      showMask(el, options)
    } else {
      removeMask(el)
    }
  } else {
    removeMask(el)
  }
}

// 遮罩指令
const mask: Directive<MaskElement, boolean | MaskOptions> = {
  mounted(el: MaskElement, binding: DirectiveBinding<boolean | MaskOptions>) {
    updateMask(el, binding)
  },

  updated(el: MaskElement, binding: DirectiveBinding<boolean | MaskOptions>) {
    updateMask(el, binding)
  },

  beforeUnmount(el: MaskElement) {
    removeMask(el)
  },
}

// 设置深度监听
mask.deep = true

export default mask
