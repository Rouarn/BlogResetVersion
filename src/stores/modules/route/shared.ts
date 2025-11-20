import { useSvgIcon } from '@/hooks/common/icon'
import { $t, $te } from '@/locales'
import type { _RouteRecordBase, RouteComponent, RouteRecordRaw } from 'vue-router'

/**
 * @description 使用递归扁平化菜单，方便添加动态路由
 * @param {Array} menuList 菜单列表
 * @returns {Array}
 */
export function getFlatMenuList(menuList: RouteRecordRaw[]): RouteRecordRaw[] {
  const newMenuList: RouteRecordRaw[] = JSON.parse(JSON.stringify(menuList))
  return newMenuList.flatMap((item) => [item, ...(item.children ? getFlatMenuList(item.children) : [])])
}

/**
 * sort route by order
 *
 * @param route route
 */
function sortRouteByOrder(route: RouteRecordRaw) {
  if (route.children?.length) {
    route.children.sort((next, prev) => (Number(next.meta?.order) || 0) - (Number(prev.meta?.order) || 0))
    route.children.forEach(sortRouteByOrder)
  }

  return route
}

/**
 * sort routes by order
 *
 * @param routes routes
 */
export function sortRoutesByOrder(routes: RouteRecordRaw[]) {
  routes.sort((next, prev) => (Number(next.meta?.order) || 0) - (Number(prev.meta?.order) || 0))
  routes.forEach(sortRouteByOrder)

  return routes
}

/**
 * Update locale of global menus
 *
 * @param menus
 */
export function updateLocaleOfGlobalMenus(menus: App.Global.Menu[]) {
  const result: App.Global.Menu[] = []

  menus.forEach((menu) => {
    const { i18nKey, label, children } = menu

    const newLabel = i18nKey && $te(i18nKey) ? $t(i18nKey) : label

    const newMenu: App.Global.Menu = {
      ...menu,
      label: newLabel,
    }

    if (children?.length) {
      newMenu.children = updateLocaleOfGlobalMenus(children)
    }

    result.push(newMenu)
  })

  return result
}

/**
 * Get global menu by route
 *
 * @param route
 */
export function getGlobalMenuByBaseRoute(routes: RouteRecordRaw[]) {
  const { SvgIconVNode } = useSvgIcon()

  function mapRouteToMenu(route: RouteRecordRaw): App.Global.Menu {
    const { name, path, children } = route
    const { title, i18nKey, icon = import.meta.env.VITE_MENU_ICON, localIcon, iconFontSize } = route.meta ?? {}

    const label = i18nKey && $te(i18nKey) ? $t(i18nKey) : title!

    const menu: App.Global.Menu = {
      key: name as App.Global.RouteKey,
      label,
      routeKey: name as App.Global.RouteKey,
      routePath: path as App.Global.RoutePath,
      icon: SvgIconVNode({ icon, localIcon, fontSize: iconFontSize || 20 }),
    }

    if (children?.length) {
      menu.children = children.map(mapRouteToMenu)
    }

    return menu
  }

  return sortRoutesByOrder(routes).map(mapRouteToMenu)
}

/**
 * Sort menus by order
 *
 * @param menus menus
 */
export function sortMenusByOrder(menus: App.Global.Menu[]) {
  menus.sort((next, prev) => (Number(next.order) || 0) - (Number(prev.order) || 0))
  menus.forEach((menu) => {
    if (menu.children?.length) {
      sortMenusByOrder(menu.children)
    }
  })

  return menus
}

/**
 * Get cache route names
 *
 * @param routes Vue routes (two levels)
 */
export function getCacheRouteNames(routes: RouteRecordRaw[]) {
  const cacheNames: App.Global.RouteKey[] = []

  routes.forEach((route) => {
    // only get last two level route, which has component
    route.children?.forEach((child) => {
      if (child.component && child.meta?.keepAlive) {
        cacheNames.push(child.name as App.Global.RouteKey)
      }
    })
  })

  return cacheNames
}

/**
 * Is route exist by route name
 *
 * @param routeName
 * @param routes
 */
function recursiveGetIsRouteExistByRouteName(route: RouteRecordRaw, routeName: App.Global.RouteKey) {
  let isExist = route.name === routeName

  if (isExist) {
    return true
  }

  if (route.children && route.children.length) {
    isExist = route.children.some((item) => recursiveGetIsRouteExistByRouteName(item, routeName))
  }

  return isExist
}

export function isRouteExistByRouteName(routeName: App.Global.RouteKey, routes: RouteRecordRaw[]) {
  return routes.some((route) => recursiveGetIsRouteExistByRouteName(route, routeName))
}

/**
 * Get selected menu key path
 *
 * @param selectedKey
 * @param menus
 */
function findMenuPath(targetKey: string, menu: App.Global.Menu): string[] | null {
  const path: string[] = []

  function dfs(item: App.Global.Menu): boolean {
    path.push(item.key)

    if (item.key === targetKey) {
      return true
    }

    if (item.children) {
      for (const child of item.children) {
        if (dfs(child)) {
          return true
        }
      }
    }

    path.pop()

    return false
  }

  if (dfs(menu)) {
    return path
  }

  return null
}

/**
 * Find menu path
 *
 * @param targetKey Target menu key
 * @param menu Menu
 */
export function getSelectedMenuKeyPathByKey(selectedKey: string, menus: App.Global.Menu[]) {
  const keyPath: string[] = []

  menus.some((menu) => {
    const path = findMenuPath(selectedKey, menu)

    const find = Boolean(path?.length)

    if (find) {
      keyPath.push(...path!)
    }

    return find
  })

  return keyPath
}

/**
 * Transform menu to searchMenus
 *
 * @param menus - menus
 * @param treeMap
 */
export function transformMenuToSearchMenus(menus: App.Global.Menu[], treeMap: App.Global.Menu[] = []) {
  if (menus && menus.length === 0) return []
  return menus.reduce((acc, cur) => {
    if (!cur.children) {
      acc.push(cur)
    }
    if (cur.children && cur.children.length > 0) {
      transformMenuToSearchMenus(cur.children, treeMap)
    }
    return acc
  }, treeMap)
}

export function resolveRouteComponent(route: RouteRecordRaw, modules: Record<string, () => Promise<RouteComponent>>): RouteRecordRaw {
  const comp = route.component as unknown as string | RouteComponent | undefined
  if (typeof comp === 'string') {
    const key = `/src/views${comp}.vue`
    const loader = modules[key]
    if (loader) route.component = loader
  }
  return route
}
