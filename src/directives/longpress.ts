/**
 * v-longpress
 * 长按指令，长按时触发事件
 * <button v-longpress="handleLongPress">Click me</button>
 */
import type { Directive, DirectiveBinding } from 'vue'

type LongPressHandler = (e: MouseEvent | TouchEvent) => void

interface LongPressDirectiveBinding extends Omit<DirectiveBinding, 'value'> {
  value: LongPressHandler
}
interface HTMLEL extends HTMLElement {
  _longPressCleanup?: () => void
}

const directive: Directive<HTMLElement, LongPressHandler> = {
  mounted(el: HTMLEL, binding: LongPressDirectiveBinding) {
    if (typeof binding.value !== 'function') {
      throw new Error('v-longpress directive value must be a function')
    }

    let pressTimer: number | null = null
    const pressDuration = 1000 // 长按时间阈值，单位毫秒

    const handler = (e: MouseEvent | TouchEvent) => {
      binding.value(e)
    }

    const start = (e: MouseEvent | TouchEvent) => {
      // 如果是鼠标事件且不是左键点击，则忽略
      if ('button' in e && e.type === 'click' && e.button !== 0) {
        return
      }

      if (pressTimer === null) {
        pressTimer = window.setTimeout(() => {
          handler(e)
        }, pressDuration)
      }
    }

    const cancel = () => {
      if (pressTimer !== null) {
        clearTimeout(pressTimer)
        pressTimer = null
      }
    }

    // 添加事件监听
    el.addEventListener('mousedown', start)
    el.addEventListener('touchstart', start)

    // 取消事件监听
    el.addEventListener('click', cancel)
    el.addEventListener('mouseup', cancel)
    el.addEventListener('mouseleave', cancel)
    el.addEventListener('touchend', cancel)
    el.addEventListener('touchcancel', cancel)

    // 在元素卸载时清除事件
    el._longPressCleanup = () => {
      el.removeEventListener('mousedown', start)
      el.removeEventListener('touchstart', start)
      el.removeEventListener('click', cancel)
      el.removeEventListener('mouseup', cancel)
      el.removeEventListener('mouseleave', cancel)
      el.removeEventListener('touchend', cancel)
      el.removeEventListener('touchcancel', cancel)
    }
  },

  unmounted(el: HTMLEL) {
    // 清理事件监听
    if (el._longPressCleanup) {
      el._longPressCleanup()
      delete el._longPressCleanup
    }
  },
}

export default directive
