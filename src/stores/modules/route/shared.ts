import { h } from 'vue'
import SvgIcon from '@/components/custom/svg-icon.vue'
import type { AutoRouterRoute } from '@elegant-router/types'
import type { RouteRecordRaw } from 'vue-router'

/**
 * Create icon render function for menu
 *
 * @param icon Icon name
 */
function createIconRender(icon?: string) {
  if (!icon) return undefined
  return () => h(SvgIcon, { icon })
}

/**
 * whether the route is cached
 *
 * @param _routeName
 */
export function isRouteExistByRouteName(_routeName: string) {
  return false
}

/**
 * get global menus by auth routes
 *
 * @param _routes auth routes
 */
export function getGlobalMenusByAuthRoutes(_routes: RouteRecordRaw[]): App.Global.Menu[] {
  return []
}

/**
 * 获取父级菜单名称
 */
function getParentMenuName(parentKey: string): string {
  // 将kebab-case转换为PascalCase
  return parentKey
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join('')
}

/**
 * 格式化菜单标签
 */
function formatMenuLabel(key: string): string {
  return key
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

/**
 * 获取父级菜单图标
 */
function getParentMenuIcon(parentKey: string): string {
  const iconMap: Record<string, string> = {
    demos: 'mdi:play-circle-outline',
    directives: 'mdi:code-tags',
    components: 'mdi:view-dashboard',
    pages: 'mdi:file-document',
    user: 'mdi:account',
    system: 'mdi:cog',
  }

  return iconMap[parentKey] || 'mdi:folder'
}

/**
 * 排序菜单
 */
function sortMenus(menus: App.Global.Menu[]): App.Global.Menu[] {
  return menus
    .sort((a, b) => (a.order || 0) - (b.order || 0))
    .map((menu) => {
      if (menu.children && menu.children.length > 0) {
        menu.children = menu.children.sort((a, b) => (a.order || 0) - (b.order || 0))
      }
      return menu
    })
}

function filterAuthRoutesByRoles(routes: RouteRecordRaw[], roles: string[]) {
  return routes.filter((route) => {
    const { meta } = route

    // 如果没有角色要求，则允许访问
    if (!meta?.roles) {
      return true
    }

    // 检查用户角色是否匹配
    return meta.roles.some((role: string) => roles.includes(role))
  })
}

function filterAuthElegantRoutesByRoles(routes: AutoRouterRoute[], roles: string[]) {
  return routes.filter((route) => {
    const { meta } = route

    // 如果没有角色要求，则允许访问
    if (!meta?.roles) {
      return true
    }

    // 检查用户角色是否匹配
    return meta.roles.some((role: string) => roles.includes(role))
  })
}

/**
 * get global menus by elegant router routes
 *
 * @param routes elegant router routes
 */
export function getGlobalMenusByElegantRoutes(routes: AutoRouterRoute[]): App.Global.Menu[] {
  const menus: App.Global.Menu[] = []
  const menuMap = new Map<string, App.Global.Menu>()

  // 过滤掉不需要在菜单中显示的路由
  const validRoutes = routes.filter((route) => {
    const meta = route.meta
    // 过滤掉内置路由、错误页面等
    if (route.name?.startsWith('_builtin') || route.name === 'NotFound' || route.name === 'Root') {
      return false
    }
    // 过滤掉在菜单中隐藏的路由
    if (meta?.hideInMenu) {
      return false
    }
    return true
  })

  validRoutes.forEach((route) => {
    const routeName = route.name as string
    const meta = route.meta

    // 解析路由层级
    const pathSegments = route.path.split('/').filter(Boolean)

    if (pathSegments.length === 1) {
      // 一级菜单
      const menu: App.Global.Menu = {
        key: routeName as App.Global.RouteKey,
        label: meta?.title || routeName,
        i18nKey: meta?.i18nKey,
        icon: createIconRender(meta?.icon || 'mdi:menu'),
        order: meta?.order || 1,
        children: [],
      }

      menuMap.set(routeName, menu)
      menus.push(menu)
    } else if (pathSegments.length === 2) {
      // 二级菜单
      const parentKey = pathSegments[0]
      const parentName = getParentMenuName(parentKey)

      // 确保父级菜单存在
      if (!menuMap.has(parentName)) {
        const parentMenu: App.Global.Menu = {
          key: parentName as App.Global.RouteKey,
          label: formatMenuLabel(parentKey),
          i18nKey: `route.${parentKey}`,
          icon: createIconRender(getParentMenuIcon(parentKey)),
          order: 1,
          children: [],
        }

        menuMap.set(parentName, parentMenu)
        menus.push(parentMenu)
      }

      const parentMenu = menuMap.get(parentName)!
      const childMenu: App.Global.Menu = {
        key: routeName as App.Global.RouteKey,
        label: meta?.title || routeName,
        i18nKey: meta?.i18nKey,
        icon: createIconRender(meta?.icon || 'mdi:menu'),
        order: meta?.order || 1,
      }

      parentMenu.children!.push(childMenu)
    }
  })

  // 排序菜单
  const sortedMenus = sortMenus(menus)
  return sortedMenus
}

/**
 * get cache route names
 *
 * @param routes vue routes (two levels)
 */
export function getCacheRouteNames(_routes: RouteRecordRaw[]) {
  return []
}

/**
 * get cache route names from elegant router routes
 *
 * @param routes elegant router routes
 */
export function getCacheRouteNamesByElegantRoutes(routes: AutoRouterRoute[]): string[] {
  return routes
    .filter((route) => route.meta?.isKeepAlive)
    .map((route) => route.name as string)
    .filter(Boolean)
}

/**
 * is route exist by route name
 *
 * @param routeName route name
 * @param routes routes
 */
export function isRouteExistByRouteNameInRoutes(routeName: string, routes: RouteRecordRaw[]) {
  return routes.some((route) => route.name === routeName)
}

/**
 * is route exist by route name in elegant routes
 *
 * @param routeName route name
 * @param routes elegant router routes
 */
export function isRouteExistByRouteNameInElegantRoutes(routeName: string, routes: AutoRouterRoute[]) {
  return routes.some((route) => route.name === routeName)
}

/**
 * get auth vue routes
 *
 * @param routes vue routes
 * @param permissions user permissions
 */
export function getAuthVueRoutes(routes: RouteRecordRaw[], permissions: string[]) {
  return filterAuthRoutesByRoles(routes, permissions)
}

/**
 * get auth elegant routes
 *
 * @param routes elegant router routes
 * @param permissions user permissions
 */
export function getAuthElegantRoutes(routes: AutoRouterRoute[], permissions: string[]) {
  return filterAuthElegantRoutesByRoles(routes, permissions)
}

export function generateMenus(routes: RouteRecordRaw[]) {
  return routes
}

export function transformMenuToSearchMenus(menus: App.Global.Menu[]) {
  return menus
}

export function updateMenuLocale(menus: App.Global.Menu[]) {
  return menus
}
