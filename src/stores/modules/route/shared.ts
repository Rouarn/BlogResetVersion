import { useSvgIcon } from '@/hooks/common/icon'
import { $t, $te } from '@/locales'
import type { _RouteRecordBase, RouteLocationNormalizedLoaded, RouteRecordRaw } from 'vue-router'

// Constants
const DEFAULT_ICON_FONT_SIZE = 20
const DEFAULT_ORDER = -1
const DEFAULT_GROUP_ENABLED = false

/**
 * Type-safe check for keep-alive routes
 */
function isKeepAliveRoute(route: RouteRecordRaw): route is RouteRecordRaw & { name: App.Global.RouteKey } {
  return !!route.component && !!route.meta?.isKeepAlive && !!route.name
}

/**
 * Get cache route names
 */
export function getCacheRouteNames(routes: RouteRecordRaw[]): App.Global.RouteKey[] {
  return routes.flatMap((route) => {
    const current = isKeepAliveRoute(route) ? [route.name] : []
    const children = route.children?.length ? getCacheRouteNames(route.children) : []
    return [...current, ...children]
  })
}

/**
 * Compare function for menu sorting
 */
function compareMenuOrder(a: App.Global.Menu, b: App.Global.Menu): number {
  const orderA = a.order ?? DEFAULT_ORDER
  const orderB = b.order ?? DEFAULT_ORDER

  // Handle -1 (default) cases
  if (orderA === -1 && orderB !== -1) return 1
  if (orderA !== -1 && orderB === -1) return -1

  return orderA - orderB
}

/**
 * Sort menus by order recursively
 */
function sortMenusByOrder(menus: App.Global.Menu[]): App.Global.Menu[] {
  return [...menus].sort(compareMenuOrder).map((menu) => ({
    ...menu,
    children: menu.children?.length ? sortMenusByOrder(menu.children) : undefined,
  }))
}

/**
 * Check if menu has required fields and valid children
 */
function filterEmptyMenu(menu: App.Global.Menu): boolean {
  const hasRequiredFields = !!menu.label || !!menu.i18nKey
  const hasValidChildren = !menu.children?.length || menu.children.some(filterEmptyMenu)
  return hasRequiredFields && hasValidChildren
}

/**
 * Flatten visible routes (excluding hidden ones)
 */
function flattenVisibleRoutes(routes: RouteRecordRaw[]): RouteRecordRaw[] {
  return routes.reduce<RouteRecordRaw[]>((result, route) => {
    if (!route.meta?.hideInMenu) {
      result.push(route)
    }

    if (route.children?.length) {
      result.push(...flattenVisibleRoutes(route.children))
    }

    return result
  }, [])
}

/**
 * Create menu icon component
 */
function createMenuIcon(meta: RouteRecordRaw['meta']) {
  const { SvgIconVNode } = useSvgIcon()
  const { icon = import.meta.env.VITE_MENU_ICON, localIcon, iconFontSize } = meta ?? {}
  return SvgIconVNode({ icon, localIcon, fontSize: iconFontSize || DEFAULT_ICON_FONT_SIZE })
}

/**
 * Convert route to global menu
 */
function routeToMenu(route: RouteLocationNormalizedLoaded | RouteRecordRaw): App.Global.Menu {
  const { name, path } = route
  const { title, i18nKey, group = { enabled: DEFAULT_GROUP_ENABLED }, order = DEFAULT_ORDER } = route.meta ?? {}

  return {
    key: name as string,
    label: i18nKey ? $t(i18nKey) : title!,
    i18nKey,
    group,
    order: Number(order),
    routeKey: name as App.Global.RouteKey,
    routePath: (Boolean(path) ? path : name) as App.Global.RouteKey,
    icon: createMenuIcon(route.meta),
  }
}
/**
 * Handle nested menu grouping
 */
function handleSubMenuGrouping(menus: App.Global.Menu[]): App.Global.Menu[] {
  const rootMenus: App.Global.Menu[] = []
  const menuMap = new Map<string, App.Global.Menu>()

  // First pass: create map and identify parents
  menus.forEach((menu) => {
    menuMap.set(menu.key, menu)
    if (!('parent' in menu) || !menu.parent) {
      rootMenus.push(menu)
    }
  })

  // Second pass: build hierarchy
  menus.forEach((menu) => {
    if ('parent' in menu && menu.parent) {
      const parentKey = `group-${menu.parent}`
      const parent = menuMap.get(parentKey)
      if (parent) {
        parent.children = parent.children || []
        parent.children.push(menu)
      }
    }
  })

  return rootMenus
}

/**
 * Handle menu grouping logic
 */
function handleMenuGrouping(menus: App.Global.Menu[]): App.Global.Menu[] {
  const { SvgIconVNode } = useSvgIcon()
  const createGroupIcon = (icon?: string) => (icon ? SvgIconVNode({ icon, fontSize: DEFAULT_ICON_FONT_SIZE }) : undefined)

  const [groupedMenus, ungroupedMenus] = menus.reduce<[App.Global.Menu[], App.Global.Menu[]]>(
    ([grouped, ungrouped], menu) => {
      return menu.group?.enabled ? [grouped.concat(menu), ungrouped] : [grouped, ungrouped.concat(menu)]
    },
    [[], []],
  )

  const groupMap = new Map<string, App.Global.Menu>()

  groupedMenus.forEach((menu) => {
    if (!menu.group) return

    const groupKey = menu.group.i18nKey || menu.group.title || String(menu.group.enabled)
    if (!groupKey) {
      ungroupedMenus.push(menu)
      return
    }

    const groupParentKey = menu.group.parent ?? null

    if (!groupMap.has(groupKey)) {
      // const groupLabel = menu.group.i18nKey ? $t(menu.group.i18nKey) : menu.group.title!
      let groupLabel = ''
      if (menu.group.i18nKey) {
        groupLabel = $t(menu.group.i18nKey)
      } else if ($te(String(menu.group?.enabled))) {
        groupLabel = $t(menu.group?.enabled as App.I18n.I18nKey)
      } else if (typeof menu.group?.enabled !== 'boolean') {
        groupLabel = menu.group.enabled
      } else {
        groupLabel = menu.group.title!
      }

      const groupMenu: App.Global.Menu = {
        key: `group-${groupKey}`,
        label: groupLabel ?? '未知菜单',
        i18nKey: menu.group.i18nKey,
        icon: undefined,
        routeKey: menu.routeKey,
        routePath: menu.routePath,
        order: menu.group.order ?? DEFAULT_ORDER,
        children: [],
        parent: groupParentKey,
      }

      // 如果当前menu.group有icon，则设置
      if (menu.group.icon) {
        groupMenu.icon = createGroupIcon(menu.group.icon)
      }

      groupMap.set(groupKey, groupMenu)
    } else {
      // 对于已存在的group，检查是否需要更新icon或parent
      const existingGroup = groupMap.get(groupKey)!
      if (!existingGroup.icon && menu.group.icon) {
        existingGroup.icon = createGroupIcon(menu.group.icon)
      }
      if (!existingGroup.parent && groupParentKey) {
        existingGroup.parent = groupParentKey
      }
    }

    const group = groupMap.get(groupKey)!
    group.children!.push(menu)
  })

  return [...handleSubMenuGrouping(Array.from(groupMap.values())), ...ungroupedMenus]
}

/**
 * Calculate menus from visible routes
 */
function calculateMenus(routes: RouteRecordRaw[]): App.Global.Menu[] {
  return flattenVisibleRoutes(routes)
    .map((route) => {
      const menu = routeToMenu(route)

      if (route.children?.some((child) => !child.meta?.hideInMenu)) {
        menu.children = calculateMenus(route.children).filter(filterEmptyMenu)
      }

      return menu
    })
    .filter(filterEmptyMenu)
}

/**
 * Remove order and group properties from menus
 */
function removeOrderAndGroup(menus: App.Global.Menu[]): App.Global.Menu[] {
  return menus.map(({ order, group, children, ...rest }) => ({
    ...rest,
    children: children?.length ? removeOrderAndGroup(children) : undefined,
  }))
}

/**
 * Get global menus by auth routes
 */
export function getGlobalMenusByRoutes(routes: RouteRecordRaw[]): App.Global.Menu[] {
  const menus = calculateMenus(routes)
  const groupedMenus = handleMenuGrouping(menus)
  const sortedMenus = sortMenusByOrder(groupedMenus)
  return removeOrderAndGroup(sortedMenus)
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

/**
 * Update locale of global menus
 *
 * @param menus
 */
export function updateLocaleOfGlobalMenus(menus: App.Global.Menu[]) {
  const result: App.Global.Menu[] = []

  menus.forEach((menu) => {
    const { i18nKey, label, children } = menu

    const newLabel = i18nKey ? $t(i18nKey) : label

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
