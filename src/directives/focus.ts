import { nextTick } from 'vue'
import type { Directive, DirectiveBinding } from 'vue'

/**
 * v-focus 自动聚焦指令
 * 用法：
 * <input v-focus /> - 元素挂载时自动聚焦
 * <input v-focus="true" /> - 条件聚焦
 * <input v-focus="false" /> - 不聚焦
 */

// 查找可聚焦的元素
function findFocusableElement(el: HTMLElement): HTMLElement | null {
  // 如果元素本身可以聚焦，直接返回
  if (typeof el.focus === 'function' && el.tabIndex >= 0) {
    return el
  }

  // 查找内部的可聚焦元素
  const focusableSelectors = [
    'input:not([disabled]):not([readonly])',
    'textarea:not([disabled]):not([readonly])',
    'select:not([disabled])',
    'button:not([disabled])',
    '[tabindex]:not([tabindex="-1"]):not([disabled])',
    '[contenteditable="true"]',
  ]

  for (const selector of focusableSelectors) {
    const focusableEl = el.querySelector(selector) as HTMLElement
    if (focusableEl) {
      return focusableEl
    }
  }

  return null
}

// 执行聚焦逻辑
function doFocus(el: HTMLElement) {
  const focusableEl = findFocusableElement(el)
  if (focusableEl) {
    focusableEl.focus()
    // 如果是输入框，还可以选中文本
    if (focusableEl instanceof HTMLInputElement && focusableEl.type === 'text') {
      focusableEl.select()
    }
  }
}

const focus: Directive = {
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    // 如果没有传值或传值为true，则聚焦
    if (binding.value === undefined || binding.value) {
      // 使用nextTick确保DOM完全渲染后再聚焦
      nextTick(() => {
        // 延迟一小段时间，确保组件完全渲染
        setTimeout(() => {
          doFocus(el)
        }, 100)
      })
    }
  },

  updated(el: HTMLElement, binding: DirectiveBinding) {
    // 当绑定值发生变化时，重新判断是否需要聚焦
    if (binding.value && !binding.oldValue) {
      nextTick(() => {
        setTimeout(() => {
          doFocus(el)
        }, 100)
      })
    }
  },
}

export default focus
