import { useSvgIcon } from '@/hooks/common/icon'
import { $t } from '@/locales'
import type { AutoRouterRoute } from '@elegant-router/types'
import { PARENT_MENU_META_MAP } from '~/er.menu.config'
import type { _RouteRecordBase } from 'vue-router'

/**
 * 工具函数：kebab-case 转 PascalCase
 */
function toPascalCase(str: string): string {
  return str
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join('')
}

/**
 * 工具函数：格式化菜单 label
 */
function toMenuLabel(str: string): string {
  return str
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}

/**
 * 创建菜单图标
 */
function createMenuIcon(iconName?: string, fontSize = 16, localIcon?: string) {
  if (!iconName) return undefined
  const { SvgIconVNode } = useSvgIcon()
  return SvgIconVNode({
    icon: iconName,
    localIcon,
    fontSize: fontSize ?? 20,
  })
}

/**
 * 创建实际路由菜单项
 */
function createRouteMenu(route: AutoRouterRoute, pathSegments: string[], level: number): App.Global.Menu {
  const { title, i18nKey, icon = import.meta.env.VITE_MENU_ICON, localIcon, iconFontSize, order } = route.meta ?? {}
  const { name, path } = route

  const label = i18nKey ? $t(i18nKey) : title!

  const isLeaf = level === pathSegments.length - 1

  return {
    key: name as App.Global.RouteKey,
    label,
    i18nKey: i18nKey as App.I18n.I18nKey,
    routeKey: name as App.Global.RouteKey,
    routePath: path as App.Global.RoutePath,
    icon: createMenuIcon(icon, iconFontSize, localIcon),
    order: order ?? 1,
    children: isLeaf ? undefined : [], // 非叶子节点要初始化 children
  }
}

/**
 * 创建父级菜单
 */
function createParentMenu(segment: string, fullPath: string): App.Global.Menu {
  const key = toPascalCase(segment) as App.Global.RouteKey
  const segmentKey = segment as keyof App.I18n.Schema['route']
  const i18nKey = `route.${segment}` as App.I18n.I18nKey

  // 使用国际化键获取标签，如果没有对应的翻译则使用格式化的segment作为fallback
  const label = $t(i18nKey) || toMenuLabel(segment)

  return {
    key,
    label,
    i18nKey,
    routeKey: key,
    routePath: fullPath as App.Global.RoutePath,
    icon: createMenuIcon(PARENT_MENU_META_MAP[segmentKey]?.icon || '', PARENT_MENU_META_MAP[segmentKey]?.iconFontSize),
    order: PARENT_MENU_META_MAP[segmentKey]?.order ?? 1,
    children: [],
  }
}

/**
 * 递归排序菜单
 */
function sortMenus(menus: App.Global.Menu[]): App.Global.Menu[] {
  return menus
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    .map((menu) => ({
      ...menu,
      children: menu.children ? sortMenus(menu.children) : undefined,
    }))
}

/**
 * 查找或创建父级菜单
 */
function findOrCreateParent(
  menus: App.Global.Menu[],
  menuMap: Map<string, App.Global.Menu>,
  pathSegments: string[],
  level: number,
): App.Global.Menu {
  const segment = pathSegments[level]
  const key = pathSegments.slice(0, level + 1).join('/')
  let parent = menuMap.get(key)

  if (!parent) {
    const fullPath = `/${key}`
    parent = createParentMenu(segment || '', fullPath)
    menuMap.set(key, parent)

    if (level === 0) {
      menus.push(parent)
    } else {
      const grandKey = pathSegments.slice(0, level).join('/')
      const grandParent = menuMap.get(grandKey)
      grandParent?.children?.push(parent)
    }
  }
  return parent
}

/**
 * 获取菜单
 */
export function getAuthElegantRoutes(routes: AutoRouterRoute[]): App.Global.Menu[] {
  const menus: App.Global.Menu[] = []
  const menuMap = new Map<string, App.Global.Menu>()

  const validRoutes = routes.filter((route) => {
    const meta = route.meta
    if (!route.name || route.name.startsWith('_')) return false
    if (['NotFound', 'Root'].includes(route.name as string)) return false
    if (meta?.hideInMenu) return false
    return true
  })

  validRoutes.forEach((route) => {
    const pathSegments = route.path.split('/').filter(Boolean)
    if (pathSegments.length === 0) return

    // 过滤掉路由参数（以:开头的段），只保留实际的路径段
    const realPathSegments = pathSegments.filter((segment) => !segment.startsWith(':'))

    if (realPathSegments.length === 0) return
    if (realPathSegments.length === 1) {
      // 一级菜单
      const menu = createRouteMenu(route, realPathSegments, 0)
      menuMap.set(route.name as string, menu)
      menus.push(menu)
    } else {
      // 多级菜单
      let parent: App.Global.Menu | null = null
      for (let i = 0; i < realPathSegments.length - 1; i++) {
        parent = findOrCreateParent(menus, menuMap, realPathSegments, i)
      }

      const finalMenu = createRouteMenu(route, realPathSegments, realPathSegments.length - 1)
      parent?.children?.push(finalMenu)
      menuMap.set(route.name as string, finalMenu)
    }
  })

  return sortMenus(menus)
}

/**
 * 更新菜单的国际化标签
 */
export function updateMenuLocale(menus: App.Global.Menu[]): App.Global.Menu[] {
  return menus.map((menu) => ({
    ...menu,
    label: menu.i18nKey ? $t(menu.i18nKey) : menu.label,
    children: menu.children ? updateMenuLocale(menu.children) : undefined,
  }))
}

/**
 * Transform menu to searchMenus
 * 递归扁平化菜单结构，提取所有叶子节点用于搜索
 *
 * @param menus - menus
 * @param treeMap
 */
export function transformMenuToSearchMenus(menus: App.Global.Menu[], treeMap: App.Global.Menu[] = []): App.Global.Menu[] {
  if (!menus?.length) return []

  return menus.reduce((acc, cur) => {
    if (!cur.children || cur.children.length === 0) {
      // 叶子节点，添加到搜索菜单
      acc.push(cur)
    } else {
      // 有子菜单，递归处理子菜单
      transformMenuToSearchMenus(cur.children, acc)
    }
    return acc
  }, treeMap)
}

/**
 * Type-safe check for keep-alive routes
 */
function isKeepAliveRoute(route: AutoRouterRoute): route is AutoRouterRoute & { name: App.Global.RouteKey } {
  return !!route.component && !!route.meta?.isKeepAlive && !!route.name
}

/**
 * Get cache route names
 */
export function getCacheRouteNames(routes: AutoRouterRoute[]): App.Global.RouteKey[] {
  return routes.flatMap((route) => {
    const current = isKeepAliveRoute(route) ? [route.name] : []
    const children = (route as _RouteRecordBase).children
      ? getCacheRouteNames((route as _RouteRecordBase).children as AutoRouterRoute[])
      : []
    return [...current, ...children]
  })
}
