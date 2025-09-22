import type { RouteKey } from '@elegant-router/types'
import { defineConfig } from 'elegant-router'
import type { RouteMeta } from 'vue-router'

// 常量路由配置
const CONSTANT_ROUTES: RouteKey[] = ['Login', '403', '404', '500', 'IframeUrl', 'UserCenter']

// 默认路由元信息
const DEFAULT_ROUTE_META: Partial<RouteMeta> = {
  icon: '',
  order: 2,
  hideInMenu: false,
  isKeepAlive: true,
  isAuth: false,
  menuType: 2,
}

/**
 * 生成路由键名
 * @param name 路由名称
 * @param path 路由路径
 * @returns 处理后的路由键名（小驼峰格式）
 */
function generateRouteKey(name: string, path?: string): string {
  // 将首字母转为小写，保持小驼峰格式
  const camelCaseKey = name.charAt(0).toLowerCase() + name.slice(1)

  // 如果路径包含参数，提取非参数部分作为键名
  if (path?.includes(':')) {
    const nonParamParts = path
      .split('/')
      .filter((part) => part && !part.startsWith(':'))
      .join('')

    // 将提取的部分转换为小驼峰格式
    if (nonParamParts) {
      return nonParamParts.charAt(0).toLowerCase() + nonParamParts.slice(1)
    }
  }

  return camelCaseKey
}

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
    // 生成标题：将驼峰命名转换为带空格的标题
    const title = node.name.replace(/([A-Z])/g, ' $1').trim()

    // 生成路由键名
    const routeKey = generateRouteKey(node.name, node.path)

    // 创建基础元信息
    const meta: Partial<RouteMeta> = {
      title,
      i18nKey: `route.${routeKey}` as App.I18n.I18nKey,
      ...DEFAULT_ROUTE_META,
    }

    // 特殊路由处理：隐藏常量路由
    if (CONSTANT_ROUTES.includes(node.name as RouteKey)) {
      meta.hideInMenu = true
    }

    // 首页特殊处理：设置最高优先级
    if (node.name.toLowerCase() === 'home') {
      meta.order = 1
    }

    return meta
  },
})
