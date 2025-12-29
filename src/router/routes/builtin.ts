import type { RouteRecordRaw } from 'vue-router'

/** Blog路由 */
export const BLOG_ROUTE: RouteRecordRaw = {
  name: 'BlogRoot',
  path: '/',
  component: () => import('@/layouts/blank-layout/index.vue'),
  redirect: '/home',
  meta: {
    title: 'BlogRoot',
  },
  children: [
    {
      name: 'home',
      path: 'home',
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
      name: 'article',
      path: 'article/:id',
      component: () => import('@/views/article/index.vue'),
      meta: {
        title: 'Article',
        icon: '',
        order: 0,
        hideInMenu: true,
        isKeepAlive: false,
        isAuth: false,
      },
    },
    {
      name: 'archive',
      path: 'archive',
      component: () => import('@/views/archive/index.vue'),
      meta: {
        title: 'Archive',
        icon: '',
        order: 0,
        hideInMenu: false,
        isKeepAlive: true,
        isAuth: false,
      },
    },
    {
      name: 'tags',
      path: 'tags',
      component: () => import('@/views/tags/index.vue'),
      meta: {
        title: 'Tags',
        icon: '',
        order: 0,
        hideInMenu: false,
        isKeepAlive: true,
        isAuth: false,
      },
    },
    {
      name: 'about',
      path: 'about',
      component: () => import('@/views/about/index.vue'),
      meta: {
        title: 'About',
        icon: '',
        order: 0,
        hideInMenu: false,
        isKeepAlive: true,
        isAuth: false,
      },
    },
  ],
}

/** System路由 */
export const SYSTEM_ROUTE: RouteRecordRaw = {
  name: 'SystemRoot',
  path: '/system',
  redirect: '/user-center',
  component: () => import('@/layouts/base-layout/index.vue'),
  meta: {
    title: 'SystemRoot',
  },
  children: [
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
