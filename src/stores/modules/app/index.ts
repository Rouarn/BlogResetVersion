import { localStg } from '@/utils/storage'
import { useRouteStore } from '../route'
import { SetupStoreId } from '@/enum'
import useBoolean from '@/hooks/common/use-boolean'
import { setLocale } from '@/locales'
import { breakpointsTailwind, useBreakpoints } from '@vueuse/core'
import { defineStore } from 'pinia'
import { routes } from 'vue-router/auto-routes'

export const useAppStore = defineStore(SetupStoreId.App, () => {
  const routeStore = useRouteStore()
  const breakpoints = useBreakpoints(breakpointsTailwind)
  const { bool: reloadFlag, setBool: setReloadFlag } = useBoolean(true)
  const { bool: themeDrawerVisible, setTrue: openThemeDrawer, setFalse: closeThemeDrawer } = useBoolean()

  const { bool: contentXScrollable, setBool: setContentXScrollable } = useBoolean()

  /** Is mobile layout */
  const isMobile = breakpoints.smaller('sm')

  const locale = ref<App.I18n.LangType>((localStg.get('lang') || 'zh-CN') as App.I18n.LangType)

  const localeOptions: App.I18n.LangOption[] = [
    {
      label: '中文',
      key: 'zh-CN',
    },
    {
      label: 'English',
      key: 'en-US',
    },
  ]

  function changeLocale(lang: App.I18n.LangType) {
    locale.value = lang
    setLocale(lang)
    localStg.set('lang', lang)
    routeStore.getGlobalMenus(routes)
  }

  /**
   * Reload page
   *
   * @param duration Duration time
   */
  async function reloadPage(duration = 300) {
    setReloadFlag(false)

    await new Promise((resolve) => {
      setTimeout(resolve, duration)
    })

    setReloadFlag(true)
  }

  return {
    isMobile,
    reloadFlag,
    reloadPage,
    locale,
    localeOptions,
    changeLocale,
    themeDrawerVisible,
    openThemeDrawer,
    closeThemeDrawer,
    contentXScrollable,
    setContentXScrollable,
  }
})
