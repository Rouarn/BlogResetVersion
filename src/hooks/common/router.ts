import { useRouter } from 'vue-router'
import globalRouter from '@/router'
import { GlobalConfig } from '@/enum'
import type { RouteLocationRaw } from 'vue-router'

/**
 * 路由跳转
 *
 * 跳转到指定的路由，可以代替router.push功能
 *
 * @param inSetup 是否在vue脚本设置中
 */
export function useRouterPush(inSetup = true) {
  const router = inSetup ? useRouter() : globalRouter
  const route = globalRouter.currentRoute

  const routerPush = router.push

  const routerBack = router.back

  async function routerPushByKey(key: App.Global.RouteKey, options?: App.Global.RouterPushOptions) {
    const { query, params } = options || {}

    const routeLocation: RouteLocationRaw & App.Global.RouterPushOptions = {
      name: key,
    }

    if (Object.keys(query || {}).length) {
      routeLocation.query = query
    }

    if (Object.keys(params || {}).length) {
      routeLocation.params = params
    }

    return routerPush(routeLocation)
  }

  function routerPushByKeyWithMetaQuery(key: App.Global.RouteKey) {
    const allRoutes = router.getRoutes()
    const meta = allRoutes.find((item) => item.name === key)?.meta || null

    const query: Record<string, string> = {}

    meta?.query?.forEach((item) => {
      query[item.key] = item.value
    })

    return routerPushByKey(key, { query })
  }

  async function toHome() {
    return routerPushByKey(GlobalConfig.HOME_URL as unknown as App.Global.RouteKey)
  }

  /**
   * Navigate to login page
   *
   * @param loginModule The login module
   * @param redirectUrl The redirect url, if not specified, it will be the current route fullPath
   */
  async function toLogin(redirectUrl?: string) {
    const options: App.Global.RouterPushOptions = {}

    const redirect = redirectUrl || route.value.fullPath

    options.query = {
      redirect,
    }

    return routerPushByKey(GlobalConfig.LOGIN_URL as unknown as App.Global.RouteKey, options)
  }

  /**
   * Redirect from login
   *
   * @param [needRedirect=true]登录后是否重定向。默认为“true”
   */
  async function redirectFromLogin(needRedirect = true) {
    const redirect = route.value.query?.redirect as string

    if (needRedirect && redirect) {
      // 替换登录页为重定向页
      await routerPush(redirect)
    } else {
      await toHome()
    }
  }

  return {
    routerPush,
    routerBack,
    routerPushByKey,
    routerPushByKeyWithMetaQuery,
    toLogin,
    redirectFromLogin,
  }
}
