/**
 * v-copy
 * 复制某个值至剪贴板
 * 接收参数：string类型/Ref<string>类型/Reactive<string>类型
 */

import type { Directive, DirectiveBinding } from 'vue'

interface ElType extends HTMLElement {
  copyData: string | number
}

// 传统复制方法（兼容性降级）
function fallbackCopyTextToClipboard(text: string) {
  const textArea = document.createElement('textarea')
  textArea.value = text

  // 避免在页面上显示
  textArea.style.position = 'fixed'
  textArea.style.left = '-999999px'
  textArea.style.top = '-999999px'
  textArea.setAttribute('readonly', '')

  document.body.appendChild(textArea)
  textArea.focus()
  textArea.select()

  try {
    const successful = document.execCommand('copy')
    if (!successful) {
      throw new Error('execCommand copy failed')
    }
  } finally {
    document.body.removeChild(textArea)
  }
}

async function handleClick(this: ElType) {
  const text = String(this.copyData)

  try {
    // 优先使用现代 Clipboard API
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text)
      window.$message?.success('复制成功')
      return
    }

    // 降级到传统方法
    fallbackCopyTextToClipboard(text)
    window.$message?.success('复制成功')
  } catch (err) {
    console.error('复制操作失败: ', err)
    window.$message?.error('复制失败，请手动复制')
  }
}

const copy: Directive = {
  mounted(el: ElType, binding: DirectiveBinding) {
    el.copyData = binding.value
    el.addEventListener('click', handleClick)
  },
  updated(el: ElType, binding: DirectiveBinding) {
    el.copyData = binding.value
  },
  beforeUnmount(el: ElType) {
    el.removeEventListener('click', handleClick)
  },
}

export default copy
