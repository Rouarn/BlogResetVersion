import type { RouteMeta } from 'vue-router'

/**
 * 文件夹显示配置类型
 * 定义文件夹名称到路由元信息的映射
 */
type FolderDisplayConfig = Partial<Record<keyof App.I18n.Schema['route'], RouteMeta>>

/**
 * 菜单默认配置
 */
export const MENU_DEFAULT_CONFIG = {
  defaultIcon: 'material-symbols:folder',
  defaultOrder: 999,
  /** 自定义排除的文件夹（不显示在菜单中），默认排除_开头的文件夹 */
  customExcludeFolders: [] as string[],
}

/**
 * 文件夹显示配置
 * 文件夹名称为 key，文件夹显示配置为 value
 * 路由配置在对应文件中,不需要在这里配置
 * 没有定义的话，默认使用默认配置
 */
const FOLDER_DISPLAY_CONFIG: FolderDisplayConfig = {
  directives: {
    title: '自定义指令',
    icon: 'material-icon-theme:folder-vue-directives-open',
    order: 2,
    i18nKey: 'route.directives',
  },
  demos: {
    title: '功能演示',
    icon: 'mdi:play-circle-outline',
    order: 3,
    i18nKey: 'route.demos',
  },
}

export default FOLDER_DISPLAY_CONFIG
