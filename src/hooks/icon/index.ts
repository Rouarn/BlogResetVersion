import SvgIcon from '@/components/custom/svg-icon.vue'
import useSvgIconRender from './use-svg-icon-render'

export function useSvgIcon() {
  const { SvgIconVNode } = useSvgIconRender(SvgIcon)

  return {
    SvgIconVNode,
  }
}
