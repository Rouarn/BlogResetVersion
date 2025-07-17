import SvgIcon from '@/components/custom/svg-icon.vue'
import useSvgIconRender from '@/hooks/common/use-svg-icon-render'

export function useSvgIcon() {
  const { SvgIconVNode } = useSvgIconRender(SvgIcon)

  return {
    SvgIconVNode,
  }
}
