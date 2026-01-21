import { useRouter } from 'vue-router'
import globalRouter from '@/router'
import { RouteNameEnum } from '@/enum'
import type { RouteLocationRaw } from 'vue-router'

export function useRouterPush(inSetup = true) {
  const router = inSetup ? useRouter() : globalRouter
  const route = globalRouter.currentRoute

  const routerPush = router.push

  const routerBack = router.back

  async function routerPushByKey(key: App.Global.RouteKey, options?: App.Global.RouterPushOptions) {
    const { query, params } = options || {}

    const routeLocation = {
      name: key,
    } as RouteLocationRaw & App.Global.RouterPushOptions

    if (query && Object.keys(query).length > 0) {
      routeLocation.query = query
    }

    if (params && Object.keys(params).length > 0) {
      routeLocation.params = params
    }

    const toRoute = router.getRoutes().find((item) => item.name === key)
    const link = toRoute?.meta?.isLink

    if (link) {
      window.open(link)
      return
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
    return routerPushByKey(RouteNameEnum.ROOT)
  }

  async function toLogin(redirectUrl?: string) {
    const options: App.Global.RouterPushOptions = {}

    const redirect = redirectUrl || route.value.fullPath

    options.query = {
      redirect,
    }

    return routerPushByKey(RouteNameEnum.LOGIN, options)
  }

  async function redirectFromLogin(needRedirect = true) {
    const redirect = route.value.query?.redirect as string

    if (needRedirect && redirect) {
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
