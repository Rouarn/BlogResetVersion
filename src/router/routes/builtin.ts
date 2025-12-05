import type { RouteRecordRaw } from 'vue-router'

/** Root路由 */
export const ROOT_ROUTE: RouteRecordRaw = {
  name: 'Root',
  path: '/',
  redirect: '/home',
  component: () => import('@/layouts/base-layout/index.vue'),
  meta: {
    title: 'root',
  },
  children: [
    {
      name: 'home',
      path: '/home',
      component: () => import('@/views/home/index.vue'),
      meta: {
        title: 'Home',
        i18nKey: 'route.home',
        icon: '',
        order: 0,
        hideInMenu: false,
        isKeepAlive: true,
        isAuth: false,
      },
    },
    {
      name: 'about',
      path: '/about',
      component: () => import('@/views/about/index.vue'),
      meta: {
        title: 'About',
        i18nKey: 'route.about',
        icon: '',
        order: 999,
        hideInMenu: false,
        isKeepAlive: true,
        isAuth: false,
        menuType: 2,
      },
    },
    {
      name: 'user-center',
      path: '/user-center',
      component: () => import('@/views/user-center/index.vue'),
      meta: {
        title: 'User Center',
        i18nKey: 'route.user-center',
        icon: '',
        order: 2,
        hideInMenu: true,
        isKeepAlive: true,
        isAuth: true,
      },
    },
  ],
}

/** 静态路由 */
export const STATIC_ROUTER: RouteRecordRaw[] = [
  {
    name: 'iframe-url',
    path: '/iframe/:url',
    component: () => import('@/views/(builtin)/iframe/[url].vue'),
    meta: {
      title: 'Iframe Url',
      i18nKey: 'route.iframe',
      icon: '',
      order: 2,
      hideInMenu: true,
      isKeepAlive: true,
      isAuth: false,
    },
  },
  {
    name: 'login',
    path: '/login',
    component: () => import('@/views/(builtin)/login/index.vue'),
    meta: {
      title: 'Login',
      i18nKey: 'route.login',
      icon: '',
      order: 2,
      hideInMenu: true,
      isKeepAlive: true,
      isAuth: false,
    },
  },
]

/** 错误路由 */
export const ERROR_ROUTER: RouteRecordRaw[] = [
  {
    name: '403',
    path: '/403',
    component: () => import('@/views/(builtin)/403/index.vue'),
    meta: {
      title: '403',
      i18nKey: 'route.403',
      hideInMenu: true,
    },
  },
  {
    name: '500',
    path: '/500',
    component: () => import('@/views/(builtin)/500/index.vue'),
    meta: {
      title: '500',
      i18nKey: 'route.500',
      hideInMenu: true,
    },
  },
  {
    name: 'not-found',
    path: '/:pathMatch(.*)*',
    component: () => import('@/views/(builtin)/404/index.vue'),
    meta: {
      title: 'not-found',
      i18nKey: 'route.404',
      hideInMenu: true,
    },
    children: [],
  },
]
