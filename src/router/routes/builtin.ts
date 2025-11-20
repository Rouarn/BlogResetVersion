import type { RouteMeta, RouteRecordRaw } from 'vue-router'

/** 静态路由 */
export const ROOT_ROUTE: RouteRecordRaw = {
  name: 'Root',
  path: '/',
  redirect: '/home',
  component: () => import('@/layouts/base-layout/index.vue'),
  meta: {
    title: 'root',
  } satisfies RouteMeta,
  children: [],
}

/** builtin routes, it must be constant and setup in vue-router */
export const builtinRoutes: RouteRecordRaw[] = [ROOT_ROUTE]
