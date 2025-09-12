import type { Directive, DirectiveBinding } from 'vue'

/**
 * v-focus 自动聚焦指令
 * 用法：
 * <input v-focus /> - 元素挂载时自动聚焦
 * <input v-focus="true" /> - 条件聚焦
 * <input v-focus="false" /> - 不聚焦
 */
const focus: Directive = {
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    // 如果没有传值或传值为true，则聚焦
    if (binding.value === undefined || binding.value) {
      // 使用nextTick确保DOM完全渲染后再聚焦
      setTimeout(() => {
        if (el && typeof el.focus === 'function') {
          el.focus()
        }
      }, 0)
    }
  },

  updated(el: HTMLElement, binding: DirectiveBinding) {
    // 当绑定值发生变化时，重新判断是否需要聚焦
    if (binding.value && !binding.oldValue) {
      setTimeout(() => {
        if (el && typeof el.focus === 'function') {
          el.focus()
        }
      }, 0)
    }
  },
}

export default focus
