import { layouts, views } from '@/router/_generated/imports'
import { transformToVueRoutes } from '@/router/_generated/transformer'
import { getRoutePath } from '../_generated/shared'
import type { AutoRouterRoute } from '@elegant-router/types'

/** 静态路由 */
export const ROOT_ROUTE: AutoRouterRoute = {
  name: 'Root',
  path: '/',
  redirect: getRoutePath('Home'),
  meta: {
    title: 'root',
  },
}

/** builtin routes, it must be constant and setup in vue-router */
const builtinRoutes: AutoRouterRoute[] = [ROOT_ROUTE]

/** create builtin vue routes */
export function createBuiltinVueRoutes() {
  return transformToVueRoutes(builtinRoutes, layouts, views)
}
