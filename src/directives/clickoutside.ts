import type { Directive, DirectiveBinding } from 'vue'

interface ClickOutsideElement extends HTMLElement {
  __clickOutsideHandler__?: (event: Event) => void
}

/**
 * v-clickoutside 点击外部指令
 * 用法：
 * <div v-clickoutside="handleClickOutside">内容</div>
 * <div v-clickoutside="{ handler: handleClickOutside, exclude: ['#exclude'] }">内容</div>
 */
const clickoutside: Directive = {
  mounted(el: ClickOutsideElement, binding: DirectiveBinding) {
    const handler = (event: Event) => {
      // 检查点击的目标是否在元素内部
      if (el.contains(event.target as Node)) {
        return
      }

      // 如果绑定值是对象，检查排除列表
      if (binding.value && typeof binding.value === 'object' && binding.value.exclude) {
        const excludeElements = binding.value.exclude
        for (const selector of excludeElements) {
          const excludeEl = document.querySelector(selector)
          if (excludeEl && excludeEl.contains(event.target as Node)) {
            return
          }
        }
      }

      // 执行回调函数
      const callback = typeof binding.value === 'function' ? binding.value : binding.value?.handler

      if (callback && typeof callback === 'function') {
        callback(event)
      }
    }

    // 保存处理函数引用，用于后续移除
    el.__clickOutsideHandler__ = handler

    // 使用 mousedown 事件而不是 click，以及延迟绑定以避免立即触发
    setTimeout(() => {
      document.addEventListener('mousedown', handler)
    }, 100) // 增加延迟时间
  },

  beforeUnmount(el: ClickOutsideElement) {
    // 移除事件监听器
    if (el.__clickOutsideHandler__) {
      document.removeEventListener('mousedown', el.__clickOutsideHandler__)
      delete el.__clickOutsideHandler__
    }
  },
}

export default clickoutside
