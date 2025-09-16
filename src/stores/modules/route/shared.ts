import type { _RouteRecordBase, RouteRecordRaw } from 'vue-router'

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
