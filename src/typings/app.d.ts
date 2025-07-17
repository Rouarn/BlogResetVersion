/** The global namespace for the app */
declare namespace App {
  /** Theme namespace */
  namespace Theme {
    type ColorPaletteNumber = 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 950

    interface OtherColor {
      info: string
      success: string
      warning: string
      error: string
    }

    /** Theme setting */
    interface ThemeSetting {
      /** Theme scheme */
      themeScheme: UnionKey.ThemeScheme
      /** grayscale mode */
      grayscale: boolean
      /** colour weakness mode */
      colourWeakness: boolean
      /** Theme color */
      themeColor: string
      /** Other color */
      otherColor: OtherColor
      /** Whether the info color is followed by the primary color */
      isInfoFollowPrimary: boolean
      /** Whether to recommend color */
      recommendColor: boolean

      /** define some theme settings tokens, will transform to css variables */
      tokens: {
        light: ThemeSettingToken
        dark?: {
          [K in keyof ThemeSettingToken]?: Partial<ThemeSettingToken[K]>
        }
      }
    }

    interface ThemeColor extends OtherColor {
      primary: string
    }

    type ThemeColorKey = keyof ThemeColor

    type ThemePaletteColor = {
      [key in ThemeColorKey | `${ThemeColorKey}-${ColorPaletteNumber}`]: string
    }

    type BaseToken = Record<string, Record<string, string>>

    interface ThemeSettingTokenColor {
      /** the progress bar color, if not set, will use the primary color */
      nprogress?: string
      container: string
      layout: string
      inverted: string
      'base-text': string
    }

    type ThemeTokenColor = ThemePaletteColor & ThemeSettingTokenColor

    interface ThemeSettingTokenBoxShadow {
      header: string
      sider: string
      tab: string
    }

    interface ThemeSettingToken {
      colors: ThemeSettingTokenColor
      boxShadow: ThemeSettingTokenBoxShadow
    }

    /** Theme token CSS variables */
    type ThemeTokenCSSVars = {
      colors: ThemeTokenColor & { [key: string]: string }
      boxShadow: ThemeSettingTokenBoxShadow & { [key: string]: string }
    }
  }

  /** Global namespace */
  namespace Global {
    /** Route path */
    type RouteKey = keyof import('vue-router/auto-routes').RouteNamedMap
    /** Route path */
    type RoutePath = string

    /** The router push options */
    type RouterPushOptions = {
      query?: Record<string, string>
      params?: Record<string, string>
    }

    /** Base menu item properties */
    type BaseMenuItem = {
      /** The menu key */
      key: string
      /** The menu label */
      label: string
      /** The menu i18n key */
      i18nKey?: I18n.I18nKey | null
      /** The menu order */
      order?: number
      /** The menu icon */
      icon?: () => VNode
      /** The menu parent */
      parent?: string | null
    }

    /** Menu group properties */
    type MenuGroup = {
      /** The menu group */
      group?: {
        enabled: boolean | string
        title?: string
        icon?: string
        i18nKey?: I18n.I18nKey | null
        order?: number
        parent?: string
      } | null
    }

    /** Route-related properties */
    type RouteProperties = {
      /** The route key */
      routeKey: RouteKey
      /** The route path */
      routePath: RoutePath
    }

    /** The global menu */
    type Menu = BaseMenuItem & RouteProperties & MenuGroup & { children?: Menu[] }
  }

  /**
   * I18n namespace
   *
   * Locales type
   */
  namespace I18n {
    type LangType = 'en-US' | 'zh-CN'

    type LangOption = {
      label: string
      key: LangType
    }

    type Schema = {
      system: {
        title: string
        updateTitle: string
        updateContent: string
        updateConfirm: string
        updateCancel: string
      }
      common: {
        backToHome: string
        cancel: string
        config: string
        confirm: string
        tip: string
        logout: string
        logoutConfirm: string
        userCenter: string
        yesOrNo: { yes: string; no: string }
        search: string

        keywordSearch: string
        noData: string
        switch: string
        close: string
      }
      theme: {
        themeSchema: { title: string } & Record<UnionKey.ThemeScheme, string>
        grayscale: string
        colourWeakness: string
        recommendColor: string
        recommendColorDesc: string
        themeColor: {
          title: string
          followPrimary: string
        } & Theme.ThemeColor
        themeDrawerTitle: string
      }
      route: {
        link: string
        about: string
        directives: string
        home: string
      }
      page: {
        about: {
          title: string
          introduction: string
          projectInfo: {
            title: string
            version: string
            latestBuildTime: string
            githubLink: string
            previewLink: string
          }
          prdDep: string
          devDep: string
        }
        login: {
          common: {
            loginOrRegister: string
          }
        }
      }
      icon: {
        themeConfig: string
        themeSchema: string
        lang: string
        fullscreen: string
        fullscreenExit: string
        reload: string
        collapse: string
        expand: string
        pin: string
        unpin: string
      }
    }

    type GetI18nKey<T extends Record<string, unknown>, K extends keyof T = keyof T> = K extends string
      ? T[K] extends Record<string, unknown>
        ? `${K}.${GetI18nKey<T[K]>}`
        : K
      : never

    type I18nKey = GetI18nKey<Schema>

    type TranslateOptions<Locales extends string> = import('vue-i18n').TranslateOptions<Locales>

    interface $T {
      (key: I18nKey): string
      (key: I18nKey, plural: number, options?: TranslateOptions<LangType>): string
      (key: I18nKey, defaultMsg: string, options?: TranslateOptions<I18nKey>): string
      (key: I18nKey, list: unknown[], options?: TranslateOptions<I18nKey>): string
      (key: I18nKey, list: unknown[], plural: number): string
      (key: I18nKey, list: unknown[], defaultMsg: string): string
      (key: I18nKey, named: Record<string, unknown>, options?: TranslateOptions<LangType>): string
      (key: I18nKey, named: Record<string, unknown>, plural: number): string
      (key: I18nKey, named: Record<string, unknown>, defaultMsg: string): string
    }
  }

  /** Service namespace */
  namespace Service {
    interface ServiceConfigItem {
      /** The backend service base url */
      baseURL: string
      /** The proxy pattern of the backend service base url */
      proxyPattern: string
    }

    /** The backend service response data */
    type Response<T = unknown> = {
      /** The backend service response code */
      code: number
      /** The backend service response message */
      msg: string
      /** The backend service response data */
      data: T
    }
  }
}
