import { computed, effectScope, onScopeDispose, ref, toRefs, watch } from 'vue'
import { toggleHtmlClass } from '@/utils/common'
import { localStg } from '@/utils/storage'
import { useAuthStore } from '../auth'
import { addThemeVarsToGlobal, createThemeToken, getNaiveTheme, initThemeSettings, toggleAuxiliaryColorModes } from './shared'
import { SetupStoreId } from '@/enum'
import { getPaletteColorByNumber } from '@sa/color'
import { useDateFormat, useNow, usePreferredColorScheme } from '@vueuse/core'
import { defineStore } from 'pinia'
import type { Ref } from 'vue'

export const useThemeStore = defineStore(SetupStoreId.Theme, () => {
  const scope = effectScope()
  const osTheme = usePreferredColorScheme()
  const authStore = useAuthStore()

  /** 主题设置 */
  const settings: Ref<App.Theme.ThemeSetting> = ref(initThemeSettings())

  const { now: watermarkTime, pause: pauseWatermarkTime, resume: resumeWatermarkTime } = useNow({ controls: true })

  /** 深色模式 */
  const darkMode = computed(() => {
    if (settings.value.themeScheme === 'auto') {
      return osTheme.value === 'dark'
    }
    return settings.value.themeScheme === 'dark'
  })

  /**
   * 设置主题方案
   *
   * @param themeScheme
   */
  function setThemeScheme(themeScheme: UnionKey.ThemeScheme) {
    settings.value.themeScheme = themeScheme
  }

  /**
   * 设置灰度模式
   *
   * @param isGrayscale
   */
  function setGrayscale(isGrayscale: boolean) {
    settings.value.grayscale = isGrayscale
  }

  /**
   * 设置色弱模式
   *
   * @param isColourWeakness
   */
  function setColourWeakness(isColourWeakness: boolean) {
    settings.value.colourWeakness = isColourWeakness
  }

  /** 切换主题方案 */
  function toggleThemeScheme() {
    const themeSchemes: UnionKey.ThemeScheme[] = ['light', 'dark', 'auto']

    const index = themeSchemes.findIndex((item) => item === settings.value.themeScheme)

    const nextIndex = index === themeSchemes.length - 1 ? 0 : index + 1

    const nextThemeScheme = themeSchemes[nextIndex]

    setThemeScheme(nextThemeScheme ?? 'light')
  }

  /**
   * 更新主题色
   *
   * @param key 主题色键
   * @param color 主题色
   */
  function updateThemeColors(key: App.Theme.ThemeColorKey, color: string) {
    let colorValue = color

    if (settings.value.recommendColor) {
      // 基于提供的颜色生成调色板，并使用更适合的颜色
      colorValue = getPaletteColorByNumber(color, 500, true)
    }

    if (key === 'primary') {
      settings.value.themeColor = colorValue
    } else {
      settings.value.otherColor[key] = colorValue
    }
  }

  /** 灰度模式是否启用 */
  const grayscaleMode = computed(() => settings.value.grayscale)

  /** 色弱模式是否启用 */
  const colourWeaknessMode = computed(() => settings.value.colourWeakness)

  /** 主题色集合 */
  const themeColors = computed(() => {
    const { themeColor, otherColor, isInfoFollowPrimary } = settings.value
    const colors: App.Theme.ThemeColor = {
      primary: themeColor,
      ...otherColor,
      info: isInfoFollowPrimary ? themeColor : otherColor.info,
    }
    return colors
  })

  /** Naive UI 主题配置 */
  const naiveTheme = computed(() => getNaiveTheme(themeColors.value, settings.value))

  /**
   * 设置 JSON
   *
   * 用于复制配置
   */
  const settingsJson = computed(() => JSON.stringify(settings.value))

  /** 水印时间格式化 */
  const formattedWatermarkTime = computed(() => {
    const { watermark } = settings.value
    const date = useDateFormat(watermarkTime, watermark.timeFormat)
    return date.value
  })

  /** 水印内容 */
  const watermarkContent = computed(() => {
    const { watermark } = settings.value

    if (watermark.enableUserName && authStore.userInfo.auth.username) {
      return authStore.userInfo.auth.username
    }

    if (watermark.enableTime) {
      return formattedWatermarkTime.value
    }

    return watermark.text
  })

  /** 重置 Store */
  function resetStore() {
    const themeStore = useThemeStore()

    themeStore.$reset()
  }

  /**
   * 切换 CSS 深色模式
   *
   * @param darkMode 是否深色模式
   */
  function toggleCssDarkMode(darkMode = false) {
    const { add, remove } = toggleHtmlClass('dark')

    if (darkMode) {
      add()
    } else {
      remove()
    }
  }

  /** 注入主题变量到全局 */
  function setupThemeVarsToGlobal() {
    const { themeTokens, darkThemeTokens } = createThemeToken(themeColors.value, settings.value.tokens)
    addThemeVarsToGlobal(themeTokens, darkThemeTokens)
  }

  /** 仅在水印可见且启用时间显示时运行计时器 */
  function updateWatermarkTimer() {
    const { watermark } = settings.value
    const shouldRunTimer = watermark.visible && watermark.enableTime

    if (shouldRunTimer) {
      resumeWatermarkTime()
    } else {
      pauseWatermarkTime()
    }
  }

  /**
   * 设置水印显示用户名
   *
   * @param enable 是否启用用户名水印
   */
  function setWatermarkEnableUserName(enable: boolean) {
    settings.value.watermark.enableUserName = enable

    if (enable) {
      settings.value.watermark.enableTime = false
    }
  }

  /**
   * 设置水印显示时间
   *
   * @param enable 是否启用时间水印
   */
  function setWatermarkEnableTime(enable: boolean) {
    settings.value.watermark.enableTime = enable

    if (enable) {
      settings.value.watermark.enableUserName = false
    }
  }

  // 监听 Store
  scope.run(() => {
    // 监听深色模式
    watch(
      darkMode,
      (val) => {
        toggleCssDarkMode(val)
        localStg.set('darkMode', val)
      },
      { immediate: true },
    )

    watch(
      [grayscaleMode, colourWeaknessMode],
      (val) => {
        toggleAuxiliaryColorModes(val[0], val[1])
      },
      { immediate: true },
    )

    // 主题色变化时，更新 CSS 变量并写入存储主色
    watch(
      themeColors,
      (val) => {
        setupThemeVarsToGlobal()
        localStg.set('themeColor', val.primary)
      },
      { immediate: true },
    )

    // 监听水印设置以控制计时器
    watch(
      () => [settings.value.watermark.visible, settings.value.watermark.enableTime],
      () => {
        updateWatermarkTimer()
      },
      { immediate: true },
    )
  })

  /** 作用域销毁时 */
  onScopeDispose(() => {
    scope.stop()
  })

  return {
    ...toRefs(settings.value),
    darkMode,
    themeColors,
    naiveTheme,
    settingsJson,
    watermarkContent,
    setThemeScheme,
    toggleThemeScheme,
    updateThemeColors,
    setGrayscale,
    setColourWeakness,
    resetStore,
    setWatermarkEnableUserName,
    setWatermarkEnableTime,
  }
})
