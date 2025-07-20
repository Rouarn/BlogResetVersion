import router from '@/router'
import { localStg } from '@/utils/storage'
import { useRouteStore } from '../route'
import { SetupStoreId } from '@/enum'
import useBoolean from '@/hooks/common/use-boolean'
import { $t, setLocale } from '@/locales'
import { setDayjsLocale } from '@/locales/dayjs'
import { breakpointsTailwind, useBreakpoints, useTitle } from '@vueuse/core'
import { defineStore } from 'pinia'

export const useAppStore = defineStore(SetupStoreId.App, () => {
  const routeStore = useRouteStore()
  const scope = effectScope()
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
  }

  /** Update document title by locale */
  function updateDocumentTitleByLocale() {
    const AppTitle = $t('system.title')
    const { title, i18nKey } = router.currentRoute.value.meta
    const subTitle = i18nKey ? $t(i18nKey) : (title ?? '')
    const documentTitle = subTitle ? `${subTitle} - ${AppTitle}` : AppTitle
    useTitle(documentTitle)
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

  function init() {
    setDayjsLocale(locale.value)
  }

  // watch store
  scope.run(() => {
    // watch locale
    watch(locale, () => {
      // update document title by locale
      updateDocumentTitleByLocale()

      // update global menus by locale
      routeStore.updateGlobalMenusByLocale()

      // set dayjs locale
      setDayjsLocale(locale.value)
    })
  })

  /** On scope dispose */
  onScopeDispose(() => {
    scope.stop()
  })

  // init
  init()

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
