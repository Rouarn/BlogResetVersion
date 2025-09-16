/**
 * 使用：在 Dom 上加上 v-draggable 即可
 * <div class="dialog-model" v-draggable></div>
 *
 * 优化版本：
 * - 使用 requestAnimationFrame 优化渲染性能
 * - 使用 transform 替代 left/top 减少重排
 * - 缓存父元素尺寸避免重复计算
 * - 添加节流处理提升性能
 */

import type { Directive } from 'vue'

interface ElType extends HTMLElement {
  parentNode: HTMLElement
  _dragData?: {
    isDragging: boolean
    animationId: number | null
    parentBounds: { width: number; height: number }
    elementSize: { width: number; height: number }
  }
  _cleanup?: () => void
}

const draggable: Directive = {
  mounted: function (el: ElType) {
    el.style.cursor = 'move'
    el.style.position = 'absolute'

    // 初始化拖拽数据
    el._dragData = {
      isDragging: false,
      animationId: null,
      parentBounds: { width: 0, height: 0 },
      elementSize: { width: 0, height: 0 },
    }

    // 缓存尺寸信息
    const updateBounds = () => {
      if (el._dragData) {
        el._dragData.parentBounds = {
          width: el.parentNode.offsetWidth,
          height: el.parentNode.offsetHeight,
        }
        el._dragData.elementSize = {
          width: el.offsetWidth,
          height: el.offsetHeight,
        }
      }
    }

    // 初始化时更新边界
    updateBounds()

    // 监听窗口大小变化
    const resizeObserver = new ResizeObserver(() => {
      updateBounds()
    })
    resizeObserver.observe(el.parentNode)

    el.onmousedown = function (e: MouseEvent) {
      e.preventDefault()

      if (!el._dragData) return

      el._dragData.isDragging = true

      // 更新边界信息
      updateBounds()

      const startX = e.clientX
      const startY = e.clientY
      const initialTransform = getComputedStyle(el).transform

      // 解析当前的 transform 值
      let currentX = 0
      let currentY = 0
      if (initialTransform && initialTransform !== 'none') {
        const matrix = initialTransform.match(/matrix\((.+)\)/)
        if (matrix && matrix[1]) {
          const values = matrix[1].split(', ')
          currentX = parseFloat(values[4] || '0') || 0
          currentY = parseFloat(values[5] || '0') || 0
        }
      }

      let pendingX = currentX
      let pendingY = currentY

      const handleMouseMove = (e: MouseEvent) => {
        if (!el._dragData?.isDragging) return

        const deltaX = e.clientX - startX
        const deltaY = e.clientY - startY

        pendingX = currentX + deltaX
        pendingY = currentY + deltaY

        // 边界检测
        const maxX = el._dragData.parentBounds.width - el._dragData.elementSize.width
        const maxY = el._dragData.parentBounds.height - el._dragData.elementSize.height

        pendingX = Math.max(0, Math.min(pendingX, maxX))
        pendingY = Math.max(0, Math.min(pendingY, maxY))

        // 取消之前的动画帧
        if (el._dragData.animationId) {
          cancelAnimationFrame(el._dragData.animationId)
        }

        // 使用 requestAnimationFrame 优化渲染
        el._dragData.animationId = requestAnimationFrame(() => {
          if (el._dragData?.isDragging) {
            el.style.transform = `translate(${pendingX}px, ${pendingY}px)`
          }
        })
      }

      const handleMouseUp = () => {
        if (el._dragData) {
          el._dragData.isDragging = false

          if (el._dragData.animationId) {
            cancelAnimationFrame(el._dragData.animationId)
            el._dragData.animationId = null
          }
        }

        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
      }

      document.addEventListener('mousemove', handleMouseMove, { passive: true })
      document.addEventListener('mouseup', handleMouseUp, { once: true })
    }

    // 存储清理函数
    el._cleanup = () => {
      resizeObserver.disconnect()
      if (el._dragData?.animationId) {
        cancelAnimationFrame(el._dragData.animationId)
      }
    }
  },

  unmounted: function (el: ElType) {
    // 清理资源
    if (el._cleanup) {
      el._cleanup()
    }

    if (el._dragData?.animationId) {
      cancelAnimationFrame(el._dragData.animationId)
    }

    delete el._dragData
    delete el._cleanup
  },
}

export default draggable
