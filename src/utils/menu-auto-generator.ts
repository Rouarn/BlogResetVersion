import { useSvgIcon } from '@/hooks/common/icon'
import { $t, $te } from '@/locales'
import type { RouteRecordRaw } from 'vue-router'

/**
 * 自动菜单生成器
 * 基于文件夹结构自动生成菜单分组，零配置自动识别
 */

/** 默认配置 */
const DEFAULT_CONFIG = {
  defaultIcon: 'material-symbols:folder',
  defaultOrder: 999,
  /** 自定义排除的文件夹（不显示在菜单中），默认排除_开头的文件夹 */
  customExcludeFolders: [] as string[],
}

/**
 * 文件夹显示配置
 * 没有d'y的话，默认使用默认配置
 *  */
const FOLDER_DISPLAY_CONFIG: Record<string, { title: string; icon: string; order: number; i18nKey?: string }> = {
  home: {
    title: '首页',
    icon: 'material-symbols:home-app-logo',
    order: 1,
    i18nKey: 'route.home',
  },
  about: {
    title: '关于',
    icon: 'material-symbols:info',
    order: 999,
    i18nKey: 'route.about',
  },
  directives: {
    title: '自定义指令',
    icon: 'material-icon-theme:folder-vue-directives-open',
    order: 2,
  },
  link: {
    title: '外部链接',
    icon: 'material-symbols:link',
    order: 3,
  },
  docs: {
    title: '文档',
    icon: 'material-symbols:book',
    order: 4,
  },
}

/**
 * 从路由路径提取文件夹信息
 */
function extractFolderFromPath(routePath: string): string {
  const segments = routePath.split('/').filter(Boolean)
  return segments[0] || ''
}

/**
 * 获取文件夹显示配置
 */
function getFolderDisplayConfig(folder: string) {
  return (
    FOLDER_DISPLAY_CONFIG[folder] || {
      title: folder.charAt(0).toUpperCase() + folder.slice(1),
      icon: DEFAULT_CONFIG.defaultIcon,
      order: DEFAULT_CONFIG.defaultOrder,
    }
  )
}

/**
 * 判断文件夹是否应该被排除
 * 自动排除_开头的文件夹，同时支持自定义排除
 */
function shouldExcludeFolder(folder: string): boolean {
  // 排除_开头的文件夹
  if (folder.startsWith('_')) {
    return true
  }
  // 排除自定义配置的文件夹
  return DEFAULT_CONFIG.customExcludeFolders.includes(folder)
}

/**
 * 判断文件夹是否应该显示为单独的一级菜单
 * 自动判断：只有一个路由的文件夹显示为单独菜单
 */
function isSingleMenuFolder(_folder: string, routesInFolder: RouteRecordRaw[]): boolean {
  return routesInFolder.length === 1
}

/**
 * 判断文件夹是否应该分组显示
 */
function shouldGroupFolder(folder: string, routesInFolder: RouteRecordRaw[]): boolean {
  // 排除的文件夹不分组
  if (shouldExcludeFolder(folder)) {
    return false
  }

  // 单独菜单文件夹不分组
  if (isSingleMenuFolder(folder, routesInFolder)) {
    return false
  }

  // 有多个子路由的文件夹需要分组
  return routesInFolder.length > 1
}

/**
 * 递归提取所有有效路由（包括children中的路由）
 * 自动识别hideInMenu属性，无需手动配置hiddenFolders
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
 * 按文件夹分组路由
 */
function groupRoutesByFolder(routes: RouteRecordRaw[]): Record<string, RouteRecordRaw[]> {
  const folderGroups: Record<string, RouteRecordRaw[]> = {}

  routes.forEach((route) => {
    // 使用 route.name 而不是 route.path 来提取文件夹信息
    const folder = extractFolderFromPath((route.name as string) || '')
    if (!folderGroups[folder]) {
      folderGroups[folder] = []
    }
    folderGroups[folder].push(route)
  })

  return folderGroups
}

/**
 * 创建菜单图标
 */
function createMenuIcon(iconName?: string, fontSize = 16, isLocalIcon = false) {
  const { SvgIconVNode } = useSvgIcon()

  if (iconName) {
    return SvgIconVNode({
      icon: isLocalIcon ? undefined : iconName,
      localIcon: isLocalIcon ? iconName : undefined,
      fontSize,
    })
  }

  return undefined
}

/**
 * 路由转换为菜单项
 */
function routeToMenu(route: RouteRecordRaw): App.Global.Menu {
  const { name, path, meta } = route
  const { title, i18nKey, order = DEFAULT_CONFIG.defaultOrder, icon, localIcon, iconFontSize } = meta || {}

  // 生成菜单标签 - 优先使用i18nKey
  let label = '未知菜单'
  if (i18nKey && $te(i18nKey)) {
    label = $t(i18nKey)
  } else if (title) {
    label = title
  } else if (name) {
    label = name as string
  }

  // 处理图标 - 优先使用localIcon
  let menuIcon
  if (localIcon) {
    menuIcon = createMenuIcon(localIcon, iconFontSize, true)
  } else if (icon) {
    menuIcon = createMenuIcon(icon, iconFontSize, false)
  }

  return {
    key: name as string,
    label,
    i18nKey,
    order: Number(order),
    routeKey: name as App.Global.RouteKey,
    routePath: path as App.Global.RoutePath,
    icon: menuIcon,
  }
}

/**
 * 创建分组菜单
 */
function createGroupMenu(folder: string, children: App.Global.Menu[]): App.Global.Menu {
  const config = getFolderDisplayConfig(folder)

  return {
    key: `group-${folder}`,
    label: config.title,
    i18nKey: config.i18nKey as App.I18n.I18nKey | null | undefined,
    order: config.order,
    routeKey: `group-${folder}` as App.Global.RouteKey,
    routePath: `group-${folder}`,
    icon: createMenuIcon(config.icon, 20),
    children,
  }
}

/**
 * 排序菜单项
 * home菜单永远在最前面，其他菜单按order排序
 */
function sortMenuItems(menuItems: App.Global.Menu[]): App.Global.Menu[] {
  return menuItems
    .sort((a, b) => {
      // home菜单永远在最前面
      if (a.key === '/home/' && b.key !== '/home/') return -1
      if (b.key === '/home/' && a.key !== '/home/') return 1

      // 其他菜单按order排序，数字越小越靠前
      return (a.order || DEFAULT_CONFIG.defaultOrder) - (b.order || DEFAULT_CONFIG.defaultOrder)
    })
    .map((item) => ({
      ...item,
      children: item.children ? sortMenuItems(item.children) : undefined,
    }))
}

/**
 * 简化的菜单生成函数
 * 基于文件夹结构自动生成菜单，零配置
 */
export function generateSimpleMenus(routes: RouteRecordRaw[]): App.Global.Menu[] {
  // 1. 提取所有有效路由
  const validRoutes = extractAllValidRoutes(routes)

  // 2. 按文件夹分组
  const folderGroups = groupRoutesByFolder(validRoutes)

  const menus: App.Global.Menu[] = []

  // 3. 处理每个文件夹
  Object.entries(folderGroups).forEach(([folder, routesInFolder]) => {
    // 跳过排除的文件夹
    if (shouldExcludeFolder(folder)) {
      return
    }

    // 转换路由为菜单项
    const menuItems = routesInFolder.map(routeToMenu)

    if (isSingleMenuFolder(folder, routesInFolder)) {
      // 单独菜单：直接添加到根级别
      menus.push(...menuItems)
    } else if (shouldGroupFolder(folder, routesInFolder)) {
      // 分组菜单：创建分组
      const groupMenu = createGroupMenu(folder, sortMenuItems(menuItems))
      menus.push(groupMenu)
    } else {
      // 单个路由：直接添加
      menus.push(...menuItems)
    }
  })

  // 4. 排序并返回
  return sortMenuItems(menus)
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
