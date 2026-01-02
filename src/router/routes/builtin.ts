import type { RouteRecordRaw } from 'vue-router'

/** Blog路由 */
export const BLOG_ROUTE: RouteRecordRaw[] = [
  {
    name: 'Root',
    path: '/',
    component: () => import('@/layouts/blog-layout/index.vue'),
    redirect: '/home',
    meta: {
      title: '博客',
    },
    children: [
      {
        name: 'home',
        path: 'home',
        component: () => import('@/views/home/index.vue'),
        meta: {
          title: '首页',
          i18nKey: 'route.home',
          icon: 'heroicons:home',
          order: 0,
          hideInMenu: false,
          isKeepAlive: true,
          isAuth: false,
        },
      },
      {
        name: 'article-edit',
        path: 'article/edit',
        component: () => import('@/views/article/edit/index.vue'),
        meta: {
          title: '创建文章',
          icon: 'heroicons:document-text',
          order: 0,
          hideInMenu: true,
          isKeepAlive: false,
          isAuth: true,
        },
      },
      {
        name: 'article',
        path: 'article/:id',
        component: () => import('@/views/article/index.vue'),
        meta: {
          title: '文章详情',
          icon: 'heroicons:document-text',
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
          title: '归档',
          icon: 'heroicons:archive-box',
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
          title: '标签',
          icon: 'heroicons:tag',
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
          title: '关于',
          icon: 'heroicons:user-group',
          order: 0,
          hideInMenu: false,
          isKeepAlive: true,
          isAuth: false,
        },
      },
      {
        name: 'user-center',
        path: '/user-center',
        component: () => import('@/views/user-center/index.vue'),
        meta: {
          title: '用户中心',
          i18nKey: 'route.user-center',
          icon: 'heroicons:user-group',
          order: 2,
          hideInMenu: true,
          isKeepAlive: true,
          isAuth: true,
        },
      },
    ],
  },
]

/** 静态路由 */
export const STATIC_ROUTER: RouteRecordRaw[] = [
  {
    name: 'iframe-url',
    path: '/iframe/:url',
    component: () => import('@/views/(builtin)/iframe/[url].vue'),
    meta: {
      title: 'Iframe Url',
      i18nKey: 'route.iframe',
      icon: 'heroicons:document-text',
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
      icon: 'heroicons:user-group',
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
