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

const addWaterMarker = (
  text: string,
  parentNode: HTMLElement,
  font: string = '16px Microsoft JhengHei',
  textColor: string = 'rgba(180, 180, 180, 0.3)',
  rotate: number = -20,
): void => {
  const canvas: HTMLCanvasElement = document.createElement('canvas')
  parentNode.appendChild(canvas)
  canvas.width = 205
  canvas.height = 140
  canvas.style.display = 'none'

  const ctx = canvas.getContext('2d')
  if (!ctx) return

  ctx.rotate((rotate * Math.PI) / 180)
  ctx.font = font
  ctx.fillStyle = textColor
  ctx.textAlign = 'left'
  ctx.textBaseline = 'middle'
  ctx.fillText(text, canvas.width / 10, canvas.height / 2)

  parentNode.style.backgroundImage = `url(${canvas.toDataURL('image/png')})`
}

const waterMarker: Directive<HTMLElement, WaterMarkerOptions> = {
  mounted(el, binding: DirectiveBinding<WaterMarkerOptions>) {
    const { text, font, textColor, rotate } = binding.value
    addWaterMarker(text, el, font, textColor, rotate)
  },
  updated(el, binding: DirectiveBinding<WaterMarkerOptions>) {
    const { text, font, textColor, rotate } = binding.value
    // 清除旧的canvas元素
    const oldCanvas = el.querySelector('canvas')
    if (oldCanvas) {
      oldCanvas.remove()
    }
    // 重新创建水印
    addWaterMarker(text, el, font, textColor, rotate)
  },
}

export default waterMarker
