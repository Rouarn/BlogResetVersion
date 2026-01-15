import { h } from 'vue'
import type { Component, VNode } from 'vue'

export interface IconConfig {
  icon?: string
  localIcon?: string
  color?: string
  fontSize?: number
}

export default function useSvgIconRender(SvgIcon: Component) {
  type IconStyle = Partial<Pick<CSSStyleDeclaration, 'color' | 'fontSize'>>

  const SvgIconVNode = (config: IconConfig): (() => VNode) | undefined => {
    const { color, fontSize, icon, localIcon } = config

    const style: IconStyle = {}

    if (color) {
      style.color = color
    }
    if (fontSize) {
      style.fontSize = `${fontSize}px`
    }

    if (!icon && !localIcon) {
      return undefined
    }

    return () => h(SvgIcon, { icon, localIcon, style })
  }

  return {
    SvgIconVNode,
  }
}
