import { GlobalConfig } from '@/enum'
import type { RouteRecordRaw } from 'vue-router'

/**
 * staticRouter (静态路由)
 */
export const staticRouter: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Root',
    redirect: GlobalConfig.HOME_URL,
  },
  {
    path: GlobalConfig.LOGIN_URL,
    name: GlobalConfig.LOGIN_URL,
    component: () => import('@/views/_builtin/login/index.vue'),
    meta: {
      title: '登录',
    },
  },
  {
    path: '/iframe',
    name: 'iframe',
    component: () => import('@/views/_builtin/iframe-page/[url].vue'),
    meta: {
      title: 'iframe',
    },
  },
]

/**
 * errorRouter (错误页面路由)
 */
export const errorRouter = [
  {
    path: '/403',
    name: '403',
    component: () => import('@/views/_builtin/403/index.vue'),
    meta: {
      title: '403页面',
      isConstant: true,
    },
  },
  {
    path: '/404',
    name: '404',
    component: () => import('@/views/_builtin/404/index.vue'),
    meta: {
      title: '404页面',
      isConstant: true,
    },
  },
  {
    path: '/500',
    name: '500',
    component: () => import('@/views/_builtin/500/index.vue'),
    meta: {
      title: '500页面',
      isConstant: true,
    },
  },
  // Resolve refresh page, route warnings
  {
    path: '/:pathMatch(.*)*',
    component: () => import('@/views/_builtin/404/index.vue'),
    meta: {
      title: '未知页面',
    },
  },
]
