/** 默认主题设置 */
export const themeSettings: App.Theme.ThemeSetting = {
  themeScheme: 'light',
  grayscale: false,
  colourWeakness: false,
  themeColor: '#0f172a',
  recommendColor: false,
  otherColor: {
    info: '#4f46e5',
    success: '#059669',
    warning: '#ea580c',
    error: '#f5222d',
  },
  isInfoFollowPrimary: false,
  watermark: {
    visible: false,
    text: 'Frontend Template',
    enableUserName: false,
    enableTime: false,
    timeFormat: 'YYYY-MM-DD HH:mm',
  },
  tokens: {
    light: {
      colors: {
        container: 'rgb(255, 255, 255)',
        layout: 'rgb(247, 250, 252)',
        inverted: 'rgb(0, 20, 40)',
        'base-text': 'rgb(31, 31, 31)',
      },
      boxShadow: {
        header: '0 1px 2px rgb(0, 21, 41, 0.08)',
        sider: '2px 0 8px 0 rgb(29, 35, 41, 0.05)',
        tab: '0 1px 2px rgb(0, 21, 41, 0.08)',
      },
    },
    dark: {
      colors: {
        container: 'rgb(28, 28, 28)',
        layout: 'rgb(18, 18, 18)',
        'base-text': 'rgb(224, 224, 224)',
      },
    },
  },
}

/**
 * 覆盖主题设置
 *
 * 发布新版本时，可使用 `overrideThemeSettings` 覆盖部分主题设置
 */
export const overrideThemeSettings: Partial<App.Theme.ThemeSetting> = {}
