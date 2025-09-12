import type { RouteMeta } from 'vue-router'

/**
 * 文件夹显示配置
 * 文件夹名称为 key，文件夹显示配置为 value
 * 路由配置在对应文件中,不需要在这里配置
 * 没有定义的话，默认使用默认配置
 */
const FOLDER_DISPLAY_CONFIG: Partial<Record<keyof App.I18n.Schema['route'], RouteMeta>> = {
  directives: {
    title: '自定义指令',
    icon: 'material-icon-theme:folder-vue-directives-open',
    order: 2,
    i18nKey: 'route.directives',
    hidden: true,
  },
}

export default FOLDER_DISPLAY_CONFIG
