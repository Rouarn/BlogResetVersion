import type { RouteMeta } from 'vue-router'

/**
 * 父级菜单图标映射表
 *
 * 该对象定义了不同菜单分类对应的图标名称映射关系，
 * 用于在界面中显示相应的图标标识
 */
export const PARENT_MENU_META_MAP: Partial<Record<keyof App.I18n.Schema['route'], Partial<RouteMeta>>> = {
  demos: { icon: 'mdi:play-circle-outline', order: 3 },
  directives: { icon: 'mdi:code-tags', order: 2 },
}
