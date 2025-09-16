import { createMemoryHistory, createRouter, createWebHashHistory, createWebHistory } from 'vue-router'
import { errorRouter, staticRouter } from '@/router/modules/static-router'
import { useAppStore } from '@/stores/modules/app'
import { useAuthStore } from '@/stores/modules/auth'
import { GlobalConfig } from '@/enum'
import { $t } from '@/locales'
import { useFullscreen, useTitle } from '@vueuse/core'

const mode = import.meta.env.VITE_ROUTER_MODE as 'hash' | 'history' | 'memory'

const routerMode = {
  hash: () => createWebHashHistory(),
  history: () => createWebHistory(),
  memory: () => createMemoryHistory(),
}

/**
 * @description 📚 路由参数配置简介
 * @param path ==> 路由菜单访问路径
 * @param name ==> 路由 name (对应页面组件 name, 可用作 KeepAlive 缓存标识 && 按钮权限筛选)
 * @param redirect ==> 路由重定向地址
 * @param component ==> 视图文件路径
 * @param meta ==> 路由菜单元信息
 * @param meta.icon ==> 菜单和面包屑对应的图标
 * @param meta.localIcon ==> 本地图标 (设置后 icon 字段将被忽略)
 * @param meta.iconFontSize ==> 图标大小 (宽度和高度相同)
 * @param meta.title ==> 路由标题 (用作 document.title || 菜单的名称)
 * @param meta.i18nKey ==> 路由国际化键 (设置后 title 字段将被忽略)
 * todo 由于当前是静态静态路由方案,暂时不用填写设置,使用时在页面内引入iframe-page组件
 * @param meta.isLink ==> 路由外链时填写的访问地址
 * @param meta.isFull ==> 菜单是否全屏 (示例：数据大屏页面)
 * @param meta.isKeepAlive ==> 当前路由是否缓存
 * @param meta.isAuth ==> 当前路由是否需要登录
 * @param meta.hideInMenu ==> 是否在菜单中隐藏该路由
 * @param meta.multiTab ==> 相同路径不同参数是否使用不同标签页
 * @param meta.query ==> 路由的查询参数
 * @param meta.layout => 路由布局 可选值有 base-layout 和 blank-layout
 * @default 'base-layout'
 * 分组中的多个路由最少需要 '一个' 路由声明 (i18nKey | title)
 * */
const router = createRouter({
  history: routerMode[mode](),
  routes: [...staticRouter, ...errorRouter],
  strict: false,
  scrollBehavior: () => ({ left: 0, top: 0 }),
})

/**
 * @description 路由拦截 beforeEach
 * */
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()

  console.log('to: ', router.getRoutes())

  // 1.NProgress 开始
  window.NProgress?.start?.()

  // 2.动态设置标题
  const AppTitle = $t('system.title')
  const { title, i18nKey } = to.meta
  const subTitle = i18nKey ? $t(i18nKey) : (title ?? '')
  const documentTitle = subTitle ? `${subTitle} - ${AppTitle}` : AppTitle
  useTitle(documentTitle)

  // 3.初始化路由菜单 (提供给header菜单使用,路由使用的是基于文件自动生成的)

  // 4.检查是否需要授权
  if (to.meta.isAuth) {
    // 检查是否登录
    if (!authStore.isLogin) {
      // 跳转到登陆页
      return next({ path: GlobalConfig.LOGIN_URL, replace: false, query: { redirect: to.fullPath } })
    }
  }

  // 5.判断是否访问登陆页，有 Token 就在当前页面，没有 Token 重置路由到登陆页
  if (to.path.toLocaleLowerCase() === GlobalConfig.LOGIN_URL) {
    if (authStore.isLogin) return next(from.fullPath)
    return next()
  }

  // 7.正常访问页面
  next()
})

/**
 * @description 路由跳转错误
 * */
router.onError((error) => {
  window.NProgress?.done?.()
  console.log('error: ', error.message)
})

/**
 * @description 路由跳转结束
 * */
router.afterEach((to) => {
  window.NProgress?.done?.()

  // 6.检查是否需要全屏
  const { isFullscreen, enter, exit } = useFullscreen()

  nextTick(() => {
    const appStore = useAppStore()

    if (to.meta.isFull) {
      enter()
      appStore.setHideHeader(true)
    } else if (isFullscreen.value) {
      exit()
      appStore.setHideHeader(false)
    } else {
      appStore.setHideHeader(false)
    }
  })
})

export default router
