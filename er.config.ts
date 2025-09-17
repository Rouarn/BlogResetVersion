import { defineConfig } from 'elegant-router'

export default defineConfig({
  // 页面目录
  pageDir: 'src/views',
  // 页面文件匹配模式
  pageInclude: ['**/*.vue'],
  // 排除的页面文件
  pageExclude: ['**/components/**', '**/modules/**'],
  // 路由生成目录
  routerGeneratedDir: 'src/router/_generated',
  // 布局配置
  layouts: {
    base: 'src/layouts/components/base-layout.vue',
    blank: 'src/layouts/components/blank-layout.vue',
  },
  // 类型声明文件路径
  dts: 'src/typings/elegant-router.d.ts',
  // vue-router类型声明文件路径
  vueRouterDts: 'src/typings/typed-router.d.ts',
  // 根路由重定向
  rootRedirect: '/home',
  // 404路由组件
  notFoundRouteComponent: '404',
  // 默认布局
  getRouteLayout: () => 'base',
  // 路由元信息生成
  getRouteMeta: (node) => {
    const title = node.name.replace(/([A-Z])/g, ' $1').trim()

    return {
      title,
      i18nKey: `route.${node.name.toLowerCase()}`,
      icon: '',
      order: 2,
      hideInMenu: false,
      isKeepAlive: true,
      isAuth: false,
    }
  },
})
