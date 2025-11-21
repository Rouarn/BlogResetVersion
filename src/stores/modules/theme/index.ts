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

  /** Theme settings */
  const settings: Ref<App.Theme.ThemeSetting> = ref(initThemeSettings())

  const { now: watermarkTime, pause: pauseWatermarkTime, resume: resumeWatermarkTime } = useNow({ controls: true })

  /** Dark mode */
  const darkMode = computed(() => {
    if (settings.value.themeScheme === 'auto') {
      return osTheme.value === 'dark'
    }
    return settings.value.themeScheme === 'dark'
  })

  /**
   * Set theme scheme
   *
   * @param themeScheme
   */
  function setThemeScheme(themeScheme: UnionKey.ThemeScheme) {
    settings.value.themeScheme = themeScheme
  }

  /**
   * Set grayscale value
   *
   * @param isGrayscale
   */
  function setGrayscale(isGrayscale: boolean) {
    settings.value.grayscale = isGrayscale
  }

  /**
   * Set colourWeakness value
   *
   * @param isColourWeakness
   */
  function setColourWeakness(isColourWeakness: boolean) {
    settings.value.colourWeakness = isColourWeakness
  }

  /** Toggle theme scheme */
  function toggleThemeScheme() {
    const themeSchemes: UnionKey.ThemeScheme[] = ['light', 'dark', 'auto']

    const index = themeSchemes.findIndex((item) => item === settings.value.themeScheme)

    const nextIndex = index === themeSchemes.length - 1 ? 0 : index + 1

    const nextThemeScheme = themeSchemes[nextIndex]

    setThemeScheme(nextThemeScheme ?? 'light')
  }

  /**
   * Update theme colors
   *
   * @param key Theme color key
   * @param color Theme color
   */
  function updateThemeColors(key: App.Theme.ThemeColorKey, color: string) {
    let colorValue = color

    if (settings.value.recommendColor) {
      // get a color palette by provided color and color name, and use the suitable color

      colorValue = getPaletteColorByNumber(color, 500, true)
    }

    if (key === 'primary') {
      settings.value.themeColor = colorValue
    } else {
      settings.value.otherColor[key] = colorValue
    }
  }

  /** grayscale mode */
  const grayscaleMode = computed(() => settings.value.grayscale)

  /** colourWeakness mode */
  const colourWeaknessMode = computed(() => settings.value.colourWeakness)

  /** Theme colors */
  const themeColors = computed(() => {
    const { themeColor, otherColor, isInfoFollowPrimary } = settings.value
    const colors: App.Theme.ThemeColor = {
      primary: themeColor,
      ...otherColor,
      info: isInfoFollowPrimary ? themeColor : otherColor.info,
    }
    return colors
  })

  /** Naive theme */
  const naiveTheme = computed(() => getNaiveTheme(themeColors.value))

  /**
   * Settings json
   *
   * It is for copy settings
   */
  const settingsJson = computed(() => JSON.stringify(settings.value))

  /** Watermark time date formatter */
  const formattedWatermarkTime = computed(() => {
    const { watermark } = settings.value
    const date = useDateFormat(watermarkTime, watermark.timeFormat)
    return date.value
  })

  /** Watermark content */
  const watermarkContent = computed(() => {
    const { watermark } = settings.value

    if (watermark.enableUserName && authStore.userInfo.username) {
      return authStore.userInfo.username
    }

    if (watermark.enableTime) {
      return formattedWatermarkTime.value
    }

    return watermark.text
  })

  /** Reset store */
  function resetStore() {
    const themeStore = useThemeStore()

    themeStore.$reset()
  }

  /**
   * Toggle css dark mode
   *
   * @param darkMode Is dark mode
   */
  function toggleCssDarkMode(darkMode = false) {
    const { add, remove } = toggleHtmlClass('dark')

    if (darkMode) {
      add()
    } else {
      remove()
    }
  }

  /** Setup theme vars to global */
  function setupThemeVarsToGlobal() {
    const { themeTokens, darkThemeTokens } = createThemeToken(themeColors.value, settings.value.tokens)
    addThemeVarsToGlobal(themeTokens, darkThemeTokens)
  }

  /** Only run timer when watermark is visible and time display is enabled */
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
   * Set watermark enable user name
   *
   * @param enable Whether to enable user name watermark
   */
  function setWatermarkEnableUserName(enable: boolean) {
    settings.value.watermark.enableUserName = enable

    if (enable) {
      settings.value.watermark.enableTime = false
    }
  }

  /**
   * Set watermark enable time
   *
   * @param enable Whether to enable time watermark
   */
  function setWatermarkEnableTime(enable: boolean) {
    settings.value.watermark.enableTime = enable

    if (enable) {
      settings.value.watermark.enableUserName = false
    }
  }

  // watch store
  scope.run(() => {
    // watch dark mode
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

    // themeColors change, update css vars and storage theme color
    watch(
      themeColors,
      (val) => {
        setupThemeVarsToGlobal()
        localStg.set('themeColor', val.primary)
      },
      { immediate: true },
    )

    // watch watermark settings to control timer
    watch(
      () => [settings.value.watermark.visible, settings.value.watermark.enableTime],
      () => {
        updateWatermarkTimer()
      },
      { immediate: true },
    )
  })

  /** On scope dispose */
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
