import { menuLogger as logger } from '@/utils/logger'
import { useSvgIcon } from '@/hooks/common/icon'
import { $t, $te } from '@/locales'
import type { RouteRecordRaw } from 'vue-router'

/**
 * 自动菜单生成器
 * 基于文件夹结构自动生成菜单分组，简化配置
 */

/** 默认配置 */
const DEFAULT_CONFIG = {
  defaultIcon: 'material-symbols:folder',
  /** 默认排序 */
  defaultOrder: 999,
  /** 排除的文件夹 */
  excludeFolders: ['_builtin', 'components', 'modules'],
  /** 自动分组的最小子项数量 */
  minGroupSize: 2,
}

/** 文件夹配置映射 */
const FOLDER_CONFIG_MAP: Record<
  string,
  {
    title: string
    icon: string
    order: number
    i18nKey?: string
  }
> = {
  directives: {
    title: '自定义指令',
    icon: 'material-icon-theme:folder-vue-directives-open',
    order: 2,
    i18nKey: 'route.directives',
  },
  components: {
    title: '组件示例',
    icon: 'material-symbols:widgets',
    order: 3,
  },
  pages: {
    title: '页面管理',
    icon: 'material-symbols:pages',
    order: 4,
  },
  system: {
    title: '系统管理',
    icon: 'material-symbols:settings',
    order: 5,
  },
  user: {
    title: '用户中心',
    icon: 'material-symbols:person',
    order: 6,
  },
  link: {
    title: '外部链接',
    icon: 'material-symbols:link',
    order: 7,
    i18nKey: 'route.link',
  },
}

/**
 * 从路由路径提取文件夹信息
 */
function extractFolderInfo(routePath: string): {
  folder: string
  depth: number
  segments: string[]
} {
  const segments = routePath.split('/').filter(Boolean)
  const folder = segments[0] || ''
  logger.error(`[extractFolderInfo] 路径: ${routePath} -> 文件夹: ${folder}, 段: [${segments.join(', ')}]`)
  return {
    folder,
    depth: segments.length,
    segments,
  }
}

/**
 * 获取文件夹配置
 */
function getFolderConfig(folder: string) {
  return (
    FOLDER_CONFIG_MAP[folder] || {
      title: folder.charAt(0).toUpperCase() + folder.slice(1),
      icon: DEFAULT_CONFIG.defaultIcon,
      order: DEFAULT_CONFIG.defaultOrder,
    }
  )
}

/**
 * 检查是否应该自动分组
 */
function _shouldAutoGroup(routes: RouteRecordRaw[], folder: string): boolean {
  logger.error(`[shouldAutoGroup] 检查文件夹: ${folder}`)

  // 排除特殊文件夹
  if (DEFAULT_CONFIG.excludeFolders.includes(folder)) {
    logger.error(`[shouldAutoGroup] 文件夹 ${folder} 在排除列表中，跳过分组`)
    return false
  }

  // 如果是根目录（空文件夹名），不自动分组
  // 这样home、about等一级页面就不会被错误地归到同一组
  if (!folder || folder === '') {
    logger.error(`[shouldAutoGroup] 文件夹 ${folder} 是根目录，跳过分组`)
    return false
  }

  // 如果文件夹配置存在，强制分组
  if (FOLDER_CONFIG_MAP[folder]) {
    logger.error(`[shouldAutoGroup] 文件夹 ${folder} 在配置映射中，强制分组`)
    return true
  }

  // 统计该文件夹下的路由数量
  const folderRoutes = routes.filter((route) => {
    const { folder: routeFolder } = extractFolderInfo(route.path)
    return routeFolder === folder
  })

  logger.error(
    `[shouldAutoGroup] 文件夹 ${folder} 下的路由:`,
    folderRoutes.map((r) => r.path),
  )
  logger.error(`[shouldAutoGroup] 路由数量: ${folderRoutes.length}, 最小分组数量: ${DEFAULT_CONFIG.minGroupSize}`)

  const shouldGroup = folderRoutes.length >= DEFAULT_CONFIG.minGroupSize
  logger.error(`[shouldAutoGroup] 文件夹 ${folder} 是否应该分组: ${shouldGroup}`)

  return shouldGroup
}

/**
 * 自动生成路由的分组配置
 */
export function autoGenerateRouteGroup(route: RouteRecordRaw, _allRoutes: RouteRecordRaw[]) {
  const { folder } = extractFolderInfo(route.path)

  // 强制所有文件夹都进行分组，不再检查shouldAutoGroup
  if (!folder || folder === '') {
    logger.error(`[autoGenerateRouteGroup] 路由 ${route.path} 是根路由，不生成分组配置`)
    return null
  }

  const config = getFolderConfig(folder)

  // 打印自动生成的分组配置
  logger.error(`[autoGenerateRouteGroup] 为路由 ${route.path} 生成分组配置:`, {
    folder,
    title: config.title,
    icon: config.icon,
    order: config.order,
    i18nKey: config.i18nKey,
  })

  // 使用文件夹名作为分组的唯一标识符
  return {
    enabled: folder, // 使用文件夹名作为enabled值，确保同一文件夹的路由被分到同一组
    title: config.title,
    icon: config.icon,
    order: config.order,
    i18nKey: config.i18nKey as App.I18n.I18nKey | null,
  }
}

/**
 * 为路由自动添加分组配置
 */
export function enhanceRouteWithAutoGroup(route: RouteRecordRaw, allRoutes: RouteRecordRaw[]): RouteRecordRaw {
  // 如果路由已经有分组配置，不覆盖
  if (route.meta?.group) {
    logger.error(`[enhanceRouteWithAutoGroup] 路由 ${route.path} 已有分组配置:`, route.meta.group)
    return route
  }

  const autoGroup = autoGenerateRouteGroup(route, allRoutes)

  if (!autoGroup) {
    return route
  }

  // 创建增强后的路由
  const enhancedRoute = {
    ...route,
    meta: {
      ...route.meta,
      group: autoGroup,
    } as RouteRecordRaw['meta'],
  }

  logger.error(`[enhanceRouteWithAutoGroup] 路由 ${route.path} 增强后的分组配置:`, enhancedRoute.meta?.group)

  return enhancedRoute
}

/**
 * 批量处理路由，自动添加分组配置
 */
export function batchEnhanceRoutesWithAutoGroup(routes: RouteRecordRaw[]): RouteRecordRaw[] {
  logger.error(`[batchEnhanceRoutesWithAutoGroup] 开始批量增强 ${routes.length} 个路由`)

  // 统计需要增强的路由数量
  const needEnhanceCount = routes.filter((route) => !route.meta?.group).length
  logger.error(`[batchEnhanceRoutesWithAutoGroup] 需要增强的路由数量: ${needEnhanceCount}/${routes.length}`)

  // 批量增强路由
  const enhancedRoutes = routes.map((route) => enhanceRouteWithAutoGroup(route, routes))

  // 统计增强后的路由数量
  const enhancedCount = enhancedRoutes.filter((route) => route.meta?.group).length
  logger.error(`[batchEnhanceRoutesWithAutoGroup] 增强后的路由数量: ${enhancedCount}/${enhancedRoutes.length}`)

  return enhancedRoutes
}

/**
 * 创建菜单图标
 */
function createMenuIcon(meta?: RouteRecordRaw['meta']) {
  const { SvgIconVNode } = useSvgIcon()
  const { icon, localIcon, iconFontSize } = meta || {}

  if (icon || localIcon) {
    return SvgIconVNode({
      icon,
      localIcon,
      fontSize: iconFontSize || 16,
    })
  }

  return undefined
}

/**
 * 扁平化可见路由
 */
function flattenVisibleRoutes(routes: RouteRecordRaw[]): RouteRecordRaw[] {
  return routes.filter((route) => {
    const { name, meta } = route
    const isValid = Boolean(name) && !meta?.hideInMenu
    return isValid
  })
}

/**
 * 路由转换为菜单项
 */
function routeToMenu(route: RouteRecordRaw): App.Global.Menu {
  const { name, path } = route
  const { title, i18nKey, group, order = DEFAULT_CONFIG.defaultOrder } = route.meta || {}

  // 修复label生成逻辑，确保不为空
  let label = '未知菜单'
  if (i18nKey) {
    label = $t(i18nKey)
  } else if (title) {
    label = title
  } else if (name) {
    label = name as string
  }

  return {
    key: name as string,
    label,
    i18nKey,
    group,
    order: Number(order),
    routeKey: name as App.Global.RouteKey,
    routePath: (Boolean(path) ? path : name) as App.Global.RoutePath,
    icon: createMenuIcon(route.meta),
  }
}

/**
 * 过滤空菜单
 */
function filterEmptyMenu(menu: App.Global.Menu): boolean {
  return Boolean(menu.label)
}

/**
 * 计算菜单（递归处理子路由）
 */
function _calculateMenus(routes: RouteRecordRaw[]): App.Global.Menu[] {
  return flattenVisibleRoutes(routes)
    .map((route) => {
      // 自动增强路由分组
      const enhancedRoute = enhanceRouteWithAutoGroup(route, routes)
      const menu = routeToMenu(enhancedRoute)

      if (route.children?.some((child) => !child.meta?.hideInMenu)) {
        menu.children = _calculateMenus(route.children).filter(filterEmptyMenu)
      }

      return menu
    })
    .filter(filterEmptyMenu)
}

/**
 * 递归提取所有有效路由（包括children中的路由）
 */
function extractAllValidRoutes(routes: RouteRecordRaw[]): RouteRecordRaw[] {
  const validRoutes: RouteRecordRaw[] = []

  function traverse(routeList: RouteRecordRaw[]) {
    routeList.forEach((route) => {
      // 检查当前路由是否有效（有name、有meta.title且不隐藏）
      if (route.name && route.meta?.title && !route.meta?.hideInMenu) {
        validRoutes.push(route)
      }

      // 递归处理children
      if (route.children && route.children.length > 0) {
        traverse(route.children)
      }
    })
  }

  traverse(routes)
  return validRoutes
}

/**
 * 排序菜单项
 */
function sortMenuItems(menuItems: App.Global.Menu[]): App.Global.Menu[] {
  return menuItems
    .sort((a, b) => (a.order || DEFAULT_CONFIG.defaultOrder) - (b.order || DEFAULT_CONFIG.defaultOrder))
    .map((item) => ({
      ...item,
      children: item.children ? sortMenuItems(item.children) : undefined,
    }))
}

/**
 * 处理嵌套菜单分组
 */
function handleSubMenuGrouping(menus: App.Global.Menu[]): App.Global.Menu[] {
  const rootMenus: App.Global.Menu[] = []
  const menuMap = new Map<string, App.Global.Menu>()
  const childMenus = new Set<string>() // 用于跟踪已经被添加为子菜单的项
  const orphanMenus: App.Global.Menu[] = [] // 用于收集找不到父菜单的项

  // First pass: create map for all menus
  menus.forEach((menu) => {
    menuMap.set(menu.key, menu)
  })

  // Second pass: build hierarchy
  menus.forEach((menu) => {
    if ('parent' in menu && menu.parent) {
      // 父菜单的key可能已经包含group-前缀，也可能不包含
      let parentKey = menu.parent
      if (!parentKey.startsWith('group-')) {
        parentKey = `group-${menu.parent}`
      }
      const parent = menuMap.get(parentKey)
      if (parent) {
        parent.children = parent.children || []
        parent.children.push(menu)
        childMenus.add(menu.key) // 标记为子菜单
      } else {
        // 如果找不到父菜单，先收集到孤儿菜单列表中
        logger.error(`[handleSubMenuGrouping] 找不到父菜单: ${menu.parent}，将 ${menu.key} 暂存`)
        orphanMenus.push(menu)
      }
    } else if (!('parent' in menu) || !menu.parent) {
      rootMenus.push(menu)
    }
  })

  // 处理孤儿菜单，将它们添加到一个特殊的"未分类"分组中
  if (orphanMenus.length > 0) {
    logger.error(`[handleSubMenuGrouping] 发现 ${orphanMenus.length} 个找不到父菜单的项，创建未分类分组`)

    // 创建一个未分类分组
    const uncategorizedGroup: App.Global.Menu = {
      key: 'group-uncategorized',
      label: '未分类菜单',
      icon: undefined,
      routeKey: undefined,
      routePath: undefined,
      order: DEFAULT_CONFIG.defaultOrder,
      children: [...orphanMenus],
    }

    // 将未分类分组添加到根菜单
    rootMenus.push(uncategorizedGroup)

    // 标记这些菜单为子菜单
    orphanMenus.forEach((menu) => {
      childMenus.add(menu.key)
    })
  }

  // 过滤掉已经作为子菜单的项，避免重复
  const filteredRootMenus = rootMenus.filter((menu) => !childMenus.has(menu.key))

  // 打印处理后的根菜单数量
  logger.error(`[handleSubMenuGrouping] 根菜单数量: ${filteredRootMenus.length}`)
  logger.error(`[handleSubMenuGrouping] 过滤掉的重复菜单数量: ${rootMenus.length - filteredRootMenus.length}`)

  return filteredRootMenus
}
/**
 * 处理菜单分组逻辑
 */
function groupMenuItems(menus: App.Global.Menu[]): App.Global.Menu[] {
  const { SvgIconVNode } = useSvgIcon()

  const createGroupIcon = (icon?: string) => (icon ? SvgIconVNode({ icon, fontSize: 20 }) : undefined)

  // 强制所有菜单项都进行分组，不再使用menu.group?.enabled判断
  // 将所有菜单项都放入groupedMenus中
  const groupedMenus = menus
  const ungroupedMenus: App.Global.Menu[] = []

  // 打印所有菜单的分组信息，帮助调试
  groupedMenus.forEach((menu) => {
    if (menu.group) {
      logger.error(`[groupMenuItems] 菜单 ${menu.key} 的分组信息:`, {
        enabled: menu.group.enabled,
        title: menu.group.title,
        i18nKey: menu.group.i18nKey,
        type: typeof menu.group.enabled,
      })
    } else {
      logger.error(`[groupMenuItems] 菜单 ${menu.key} 没有分组信息`)
    }
  })

  logger.error(`[groupMenuItems] 分组前: 启用分组的菜单数量: ${groupedMenus.length}, 未分组菜单数量: ${ungroupedMenus.length}`)

  const groupMap = new Map<string, App.Global.Menu>()

  groupedMenus.forEach((menu) => {
    // 改进分组键生成逻辑，确保唯一性
    let groupKey = ''

    // 强制使用文件夹作为分组键，确保同一文件夹的菜单被分到一组
    const folderMatch = menu.routePath ? menu.routePath.match(/^\/([^\/]+)/) : null
    const folder = folderMatch ? folderMatch[1] : ''

    if (folder) {
      // 使用文件夹名作为主要分组键
      groupKey = `folder-${folder}`
      logger.error(`[groupMenuItems] 菜单 ${menu.key} 使用文件夹 ${folder} 作为分组键`)
    } else if (menu.group?.i18nKey) {
      groupKey = menu.group.i18nKey
    } else if (menu.group?.title) {
      groupKey = menu.group.title
    } else if (menu.group && typeof menu.group.enabled === 'string') {
      groupKey = menu.group.enabled
    } else {
      // 如果没有任何可用的分组键，使用默认值
      groupKey = 'default-group'
    }

    if (!groupKey) {
      logger.error(`[groupMenuItems] 菜单 ${menu.key} 没有有效的分组键，添加到未分组菜单`)
      ungroupedMenus.push(menu)
      return
    }

    const groupParentKey = menu.group?.parent ?? null

    if (!groupMap.has(groupKey)) {
      // 简化分组标签生成逻辑
      let groupLabel = '未知菜单'

      // 优先使用FOLDER_CONFIG_MAP中的配置
      if (folder && FOLDER_CONFIG_MAP[folder]) {
        groupLabel = FOLDER_CONFIG_MAP[folder].title
        if (FOLDER_CONFIG_MAP[folder].i18nKey && $te(FOLDER_CONFIG_MAP[folder].i18nKey)) {
          groupLabel = $t(FOLDER_CONFIG_MAP[folder].i18nKey as App.I18n.I18nKey)
        }
      } else if (menu.group?.i18nKey && $te(menu.group.i18nKey)) {
        // 其次使用菜单组的国际化键
        groupLabel = $t(menu.group.i18nKey)
      } else if (menu.group?.title) {
        // 再次使用菜单组的标题
        groupLabel = menu.group.title
      } else if (menu.group && typeof menu.group.enabled === 'string') {
        // 如果enabled是字符串，可能是一个标题
        if ($te(menu.group.enabled)) {
          groupLabel = $t(menu.group.enabled as App.I18n.I18nKey)
        } else {
          groupLabel = menu.group.enabled
        }
      } else if (folder) {
        // 最后使用文件夹名作为标签
        groupLabel = folder.charAt(0).toUpperCase() + folder.slice(1) + '菜单'
      }

      logger.error(`[groupMenuItems] 创建分组 ${groupKey} 标签: ${groupLabel}`)

      const groupMenu: App.Global.Menu = {
        key: `group-${groupKey}`,
        label: groupLabel,
        i18nKey: menu.group?.i18nKey || (folder && (FOLDER_CONFIG_MAP[folder]?.i18nKey as App.I18n.I18nKey)),
        icon: undefined,
        // 分组菜单不应该有路由信息，避免点击分组菜单时跳转
        routeKey: undefined,
        routePath: undefined,
        order: menu.group?.order ?? (folder && FOLDER_CONFIG_MAP[folder]?.order) ?? DEFAULT_CONFIG.defaultOrder,
        children: [],
        parent: groupParentKey,
      }

      // 设置图标，优先使用菜单组的图标，其次使用文件夹配置的图标
      if (menu.group?.icon) {
        groupMenu.icon = createGroupIcon(menu.group.icon)
      } else if (folder && FOLDER_CONFIG_MAP[folder]?.icon) {
        groupMenu.icon = createGroupIcon(FOLDER_CONFIG_MAP[folder].icon)
      }

      groupMap.set(groupKey, groupMenu)
    } else {
      // 对于已存在的group，检查是否需要更新icon或parent
      const existingGroup = groupMap.get(groupKey)!
      if (!existingGroup.icon && menu.group?.icon) {
        existingGroup.icon = createGroupIcon(menu.group.icon)
      } else if (!existingGroup.icon && folder && FOLDER_CONFIG_MAP[folder]?.icon) {
        existingGroup.icon = createGroupIcon(FOLDER_CONFIG_MAP[folder].icon)
      }
      if (!existingGroup.parent && groupParentKey) {
        existingGroup.parent = groupParentKey
      }
    }

    // 获取分组菜单
    const group = groupMap.get(groupKey)!

    // 创建菜单项的深拷贝，避免引用问题
    const menuCopy = {
      ...menu,
      // 如果有children，也需要深拷贝
      children: menu.children ? JSON.parse(JSON.stringify(menu.children)) : undefined,
      // 移除group属性，避免重复分组
      group: undefined,
    }

    // 将菜单项添加到分组的子项中
    group.children!.push(menuCopy)
    logger.error(`[groupMenuItems] 将菜单 ${menu.key} 添加到分组 ${groupKey}`)
  })

  // 获取分组菜单和未分组菜单
  const groupMenus = handleSubMenuGrouping(Array.from(groupMap.values()))

  // 打印分组菜单和未分组菜单的数量，帮助调试
  logger.error(`[groupMenuItems] 分组菜单数量: ${groupMenus.length}, 未分组菜单数量: ${ungroupedMenus.length}`)

  // 打印每个分组菜单的详细信息
  groupMenus.forEach((menu) => {
    logger.error(`[groupMenuItems] 分组菜单: ${menu.key}, 标签: ${menu.label}, 子项数量: ${menu.children?.length || 0}`)
    if (menu.children && menu.children.length > 0) {
      logger.error(
        `[groupMenuItems] 分组 ${menu.key} 的子项:`,
        menu.children.map((child) => child.key),
      )
    }
  })

  // 合并分组菜单和未分组菜单
  return [...groupMenus, ...ungroupedMenus]
}
/**
 * 简化的菜单生成函数
 * 替代复杂的 shared.ts 中的逻辑
 */
export function generateSimpleMenus(routes: RouteRecordRaw[]): App.Global.Menu[] {
  logger.error('[generateSimpleMenus] 开始生成菜单')

  // 递归提取所有有效路由
  const validRoutes = extractAllValidRoutes(routes)
  logger.error(
    `[generateSimpleMenus] 提取到 ${validRoutes.length} 个有效路由:`,
    validRoutes.map((r) => r.path),
  )

  // 先批量增强所有路由的分组配置
  const enhancedRoutes = batchEnhanceRoutesWithAutoGroup(validRoutes)
  logger.error(`[generateSimpleMenus] 增强后的路由数量: ${enhancedRoutes.length}`)

  // 打印每个增强后的路由的分组配置
  enhancedRoutes.forEach((route) => {
    logger.error(`[generateSimpleMenus] 路由 ${route.path} 的分组配置:`, route.meta?.group)
  })

  // 将增强后的路由转换为菜单
  const menus = enhancedRoutes.map((route) => routeToMenu(route)).filter(filterEmptyMenu)
  logger.error(`[generateSimpleMenus] 转换为菜单项数量: ${menus.length}`)

  // 打印转换后的菜单项详细信息
  logger.error('[generateSimpleMenus] 转换后的菜单项详细信息:')
  menus.forEach((menu) => {
    logger.error(`  - 菜单: ${menu.key}, 标签: ${menu.label}, 分组: ${menu.group?.enabled || '无'}, 路径: ${menu.routePath}`)
  })

  // 打印原始菜单项的分组信息
  const groupedMenuCount = menus.filter((menu) => menu.group?.enabled).length
  logger.error(`[generateSimpleMenus] 原始菜单中启用分组的项数量: ${groupedMenuCount}/${menus.length}`)

  // 处理菜单分组
  const groupedMenus = groupMenuItems(menus)
  logger.error(`[generateSimpleMenus] 分组后菜单数量: ${groupedMenus.length}`)

  // 打印分组后的菜单结构
  logger.error('[generateSimpleMenus] 分组后的菜单结构:')
  groupedMenus.forEach((menu) => {
    if (menu.children && menu.children.length > 0) {
      logger.error(`  - 分组: ${menu.key}, 标签: ${menu.label}, 子项数量: ${menu.children.length}`)
      // 打印每个分组的子菜单项
      menu.children.forEach((child, index) => {
        logger.error(`    ${index + 1}. 子项: ${child.key}, 标签: ${child.label}, 路径: ${child.routePath || '无'}`)
      })
    } else {
      logger.error(`  - 菜单: ${menu.key}, 标签: ${menu.label}, 路径: ${menu.routePath || '无'}`)
    }
  })

  // 排序菜单
  const sortedMenus = sortMenuItems(groupedMenus)
  logger.error(`[generateSimpleMenus] 最终菜单结构:`, JSON.stringify(sortedMenus, null, 2))

  return sortedMenus
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
