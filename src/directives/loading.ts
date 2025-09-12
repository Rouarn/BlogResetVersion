import type { Directive, DirectiveBinding } from 'vue'

interface LoadingElement extends HTMLElement {
  __loadingInstance__?: HTMLElement
}

function removeLoading(el: LoadingElement) {
  if (el.__loadingInstance__) {
    el.removeChild(el.__loadingInstance__)
    delete el.__loadingInstance__
  }
}

function showLoading(el: LoadingElement, options: unknown) {
  // 如果已经有loading实例，先移除
  if (el.__loadingInstance__) {
    removeLoading(el)
  }

  // 获取配置选项
  const config = typeof options === 'object' && options !== null ? (options as Record<string, unknown>) : {}
  const text = config.text || '加载中...'
  const background = config.background || 'rgba(255, 255, 255, 0.9)'
  const color = config.color || '#409eff'

  // 创建loading遮罩层
  const loadingEl = document.createElement('div')
  loadingEl.style.cssText = `
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: ${background};
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    z-index: 9999;
    font-size: 14px;
    color: ${color};
  `

  // 创建loading动画
  const spinner = document.createElement('div')
  spinner.style.cssText = `
    width: 32px;
    height: 32px;
    border: 3px solid #f3f3f3;
    border-top: 3px solid ${color};
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-bottom: 12px;
  `

  // 创建loading文本
  const textEl = document.createElement('div')
  textEl.textContent = text as string

  // 添加CSS动画
  if (!document.querySelector('#loading-keyframes')) {
    const style = document.createElement('style')
    style.id = 'loading-keyframes'
    style.textContent = `
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `
    document.head.appendChild(style)
  }

  loadingEl.appendChild(spinner)
  loadingEl.appendChild(textEl)

  // 设置目标元素为相对定位
  const originalPosition = el.style.position
  if (!originalPosition || originalPosition === 'static') {
    el.style.position = 'relative'
  }

  // 添加到目标元素
  el.appendChild(loadingEl)
  el.__loadingInstance__ = loadingEl
}

function updateLoading(el: LoadingElement, binding: DirectiveBinding) {
  const isLoading = typeof binding.value === 'boolean' ? binding.value : binding.value?.loading

  if (isLoading) {
    showLoading(el, binding.value)
  } else {
    removeLoading(el)
  }
}

/**
 * v-loading 加载状态指令
 * 用法：
 * <div v-loading="isLoading">内容</div>
 * <div v-loading="{ loading: isLoading, text: '加载中...', background: 'rgba(0,0,0,0.8)' }">内容</div>
 */
const loading: Directive = {
  mounted(el: LoadingElement, binding: DirectiveBinding) {
    updateLoading(el, binding)
  },

  updated(el: LoadingElement, binding: DirectiveBinding) {
    updateLoading(el, binding)
  },

  beforeUnmount(el: LoadingElement) {
    removeLoading(el)
  },
}

export default loading
