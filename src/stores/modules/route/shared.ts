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
 * 按顺序字段对路由排序
 *
 * @param route 路由
 */
function sortRouteByOrder(route: RouteRecordRaw) {
  if (route.children?.length) {
    route.children.sort((next, prev) => (Number(next.meta?.order) || 0) - (Number(prev.meta?.order) || 0))
    route.children.forEach(sortRouteByOrder)
  }

  return route
}

/**
 * 按顺序字段对路由列表排序
 *
 * @param routes 路由列表
 */
export function sortRoutesByOrder(routes: RouteRecordRaw[]) {
  routes.sort((next, prev) => (Number(next.meta?.order) || 0) - (Number(prev.meta?.order) || 0))
  routes.forEach(sortRouteByOrder)

  return routes
}

/**
 * 根据语言更新全局菜单
 *
 * @param menus 菜单列表
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
 * 通过基础路由生成全局菜单
 *
 * @param routes 路由列表
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
      i18nKey,
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
 * 按顺序字段对菜单排序
 *
 * @param menus 菜单列表
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
 * 获取需要缓存的路由名称
 *
 * @param routes Vue 路由（两级）
 */
export function getCacheRouteNames(routes: RouteRecordRaw[]) {
  const cacheNames: App.Global.RouteKey[] = []

  routes.forEach((route) => {
    // 仅获取最后两级且带组件的路由
    route.children?.forEach((child) => {
      if (child.component && child.meta?.isKeepAlive) {
        cacheNames.push(child.name as App.Global.RouteKey)
      }
    })
  })

  return cacheNames
}

/**
 * 根据路由名称判断路由是否存在
 *
 * @param routeName 路由名称
 * @param routes 路由列表
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
 * 获取选中菜单的键路径
 *
 * @param selectedKey 选中键
 * @param menus 菜单列表
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
 * 查找菜单路径
 *
 * @param targetKey 目标菜单键
 * @param menu 菜单
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
 * 将菜单转换为可搜索菜单列表
 *
 * @param menus 菜单列表
 * @param treeMap 聚合列表
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
