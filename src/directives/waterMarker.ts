/**
 * 使用：设置水印文案，颜色，字体大小即可
 * <div v-waterMarker="{text:'版权所有',textColor:'rgba(180, 180, 180, 0.4)'}"></div>
 */

import type { Directive, DirectiveBinding } from 'vue'

interface WaterMarkerOptions {
  text: string
  font?: string
  textColor?: string
  rotate?: number
}

interface ElType extends HTMLElement {
  __watermarkCanvas__?: HTMLCanvasElement
}

const addWaterMarker = (
  text: string,
  parentNode: ElType,
  font: string = '16px Microsoft JhengHei',
  textColor: string = 'rgba(180, 180, 180, 0.3)',
  rotate: number = -20,
): void => {
  // 清理旧的 canvas
  if (parentNode.__watermarkCanvas__) {
    parentNode.__watermarkCanvas__.remove()
    parentNode.__watermarkCanvas__ = undefined
  }

  const canvas: HTMLCanvasElement = document.createElement('canvas')
  parentNode.appendChild(canvas)
  canvas.width = 205
  canvas.height = 140
  canvas.style.display = 'none'

  const ctx = canvas.getContext('2d')
  if (!ctx) {
    console.warn('Canvas context not supported')
    return
  }

  ctx.rotate((rotate * Math.PI) / 180)
  ctx.font = font
  ctx.fillStyle = textColor
  ctx.textAlign = 'left'
  ctx.textBaseline = 'middle'
  ctx.fillText(text, canvas.width / 10, canvas.height / 2)

  const dataURL = canvas.toDataURL('image/png')
  parentNode.style.backgroundImage = `url(${dataURL})`

  // 保存 canvas 引用用于后续清理
  parentNode.__watermarkCanvas__ = canvas
}

const waterMarker: Directive<ElType, WaterMarkerOptions> = {
  mounted(el, binding: DirectiveBinding<WaterMarkerOptions>) {
    const { text, font, textColor, rotate } = binding.value
    addWaterMarker(text, el, font, textColor, rotate)
  },
  updated(el, binding: DirectiveBinding<WaterMarkerOptions>) {
    const { text, font, textColor, rotate } = binding.value
    // 重新创建水印（addWaterMarker 内部会清理旧的 canvas）
    addWaterMarker(text, el, font, textColor, rotate)
  },
  unmounted(el) {
    // 清理 canvas 资源
    if (el.__watermarkCanvas__) {
      el.__watermarkCanvas__.remove()
      el.__watermarkCanvas__ = undefined
    }
    // 清理背景图片
    el.style.backgroundImage = ''
  },
}

export default waterMarker
