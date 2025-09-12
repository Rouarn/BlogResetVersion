import type { RouteMeta } from 'vue-router'

/**
 * 文件夹显示配置
 * 文件夹名称为 key，文件夹显示配置为 value
 * 路由配置在对应文件中,不需要在这里配置
 * 没有定义的话，默认使用默认配置
 */
const FOLDER_DISPLAY_CONFIG: Record<string, RouteMeta> = {
  directives: {
    title: '自定义指令',
    icon: 'material-icon-theme:folder-vue-directives-open',
    order: 2,
    i18nKey: 'route.directives',
  },
  link: {
    title: '外部链接',
    icon: 'material-symbols:link',
    order: 3,
    i18nKey: 'route.link',
  },
  docs: {
    title: '文档',
    icon: 'material-icon-theme:folder-docs-open',
    order: 4,
    i18nKey: 'route.docs',
  },
}

export default FOLDER_DISPLAY_CONFIG
