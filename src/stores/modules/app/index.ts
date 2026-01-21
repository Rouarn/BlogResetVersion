import router from '@/router'
import { localStg } from '@/utils/storage'
import { useRouteStore } from '../route'
import { SetupStoreId } from '@/enum'
import useBoolean from '@/hooks/state/use-boolean'
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
  const { bool: hideHeader, setBool: setHideHeader } = useBoolean(false)

  /** 是否为移动端布局 */
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

  /** 根据语言更新文档标题 */
  function updateDocumentTitleByLocale() {
    const AppTitle = $t('system.title')
    const { title, i18nKey } = router.currentRoute.value.meta
    const subTitle = i18nKey ? $t(i18nKey) : (title ?? '')
    const documentTitle = subTitle ? `${subTitle} - ${AppTitle}` : AppTitle
    useTitle(documentTitle)
  }

  /**
   * 重新加载页面
   *
   * @param duration 时长
   */
  async function reloadPage(duration = 300) {
    setReloadFlag(false)

    await new Promise((resolve) => {
      setTimeout(resolve, duration)
    })

    setReloadFlag(true)
    routeStore.resetRouteCache()
  }

  function init() {
    setDayjsLocale(locale.value)
  }

  // 监听 Store
  scope.run(() => {
    // 监听语言
    watch(locale, () => {
      // 根据语言更新文档标题
      updateDocumentTitleByLocale()

      // 根据语言更新全局菜单
      routeStore.updateGlobalMenusByLocale()

      // 设置 dayjs 语言
      setDayjsLocale(locale.value)
    })
  })

  /** 作用域销毁时 */
  onScopeDispose(() => {
    scope.stop()
  })

  // 初始化
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
    hideHeader,
    setHideHeader,
  }
})
