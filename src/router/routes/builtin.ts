import type { AutoRouterRoute } from '@elegant-router/types'

/** 静态路由 */
export const builtinRoutes: AutoRouterRoute[] = [
  {
    name: 'Home',
    path: '/home',
    layout: 'base',
    component: 'Home',
    meta: {
      title: 'Home',
      i18nKey: 'route.home',
      icon: '',
      order: 2,
      hideInMenu: false,
      isKeepAlive: true,
      isAuth: false,
    },
  },
]
