/** 应用的全局命名空间 */
declare namespace App {
  /** 主题命名空间 */
  namespace Theme {
    type ColorPaletteNumber = 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 950

    interface OtherColor {
      info: string
      success: string
      warning: string
      error: string
    }

    /** 主题设置 */
    interface ThemeSetting {
      /** 主题方案 */
      themeScheme: UnionKey.ThemeScheme
      /** 灰度模式 */
      grayscale: boolean
      /** 色弱模式 */
      colourWeakness: boolean
      /** 主题颜色 */
      themeColor: string
      /** 其他颜色 */
      otherColor: OtherColor
      /** 信息色是否跟随主色 */
      isInfoFollowPrimary: boolean
      /** 是否推荐颜色 */
      recommendColor: boolean

      /** 水印设置 */
      watermark: {
        /** 是否显示水印 */
        visible: boolean
        /** 水印文本 */
        text: string
        /** 是否显示用户名 */
        enableUserName: boolean
        /** 是否显示时间 */
        enableTime: boolean
        /** 时间格式 */
        timeFormat: string
      }

      /** 定义部分主题设置的 tokens，将转换为 CSS 变量 */
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
      /** 进度条颜色，未设置则使用主色 */
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

    /** 主题 Token 的 CSS 变量 */
    type ThemeTokenCSSVars = {
      colors: ThemeTokenColor & { [key: string]: string }
      boxShadow: ThemeSettingTokenBoxShadow & { [key: string]: string }
    }
  }

  /**
   * I18n 命名空间
   *
   * 语言类型
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
        } & Record<Theme.ThemeColorKey, string>
        themeDrawerTitle: string

        watermark: {
          title: string
          visible: string
          text: string
          enableUserName: string
          enableTime: string
          timeFormat: string
        }
        configOperation: {
          copyConfig: string
          copySuccessMsg: string
          resetConfig: string
          resetSuccessMsg: string
        }
      }
      route: {
        root: string
        home: string
        notFound: string
        '403': string
        '404': string
        '500': string
        iframe: string
        login: string
        about: string
        demos: {
          title: string
          'loading-demo': string
        }
        directives: {
          title: string
          'animate-direct': string
          'clickoutside-direct': string
          'copy-direct': string
          'debounce-direct': string
          'drag-direct': string
          'focus-direct': string
          'highlight-direct': string
          'lazy-direct': string
          'loading-direct': string
          'longpress-direct': string
          'mask-direct': string
          'permission-direct': string
          'scroll-direct': string
          'throttle-direct': string
          'tooltip-direct': string
          'watermark-direct': string
          'ripple-direct': string
        }
        'user-center': string
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

  /** 全局命名空间 */
  namespace Global {
    /** 路由键 */
    type RouteKey = string
    /** 路由路径 */
    type RoutePath = string

    /** 路由跳转参数 */
    type RouterPushOptions = {
      query?: Record<string, string>
      params?: Record<string, string>
    }

    /** 路由相关属性 */
    type RouteProperties = {
      /** 路由键 */
      routeKey: RouteKey
      /** 路由路径 */
      routePath: RoutePath
    }

    /** 菜单类型 */
    type MenuType = 1 | 2

    /** 全局菜单 */
    type Menu = {
      /**
       * 菜单键
       *
       * 等同于路由键
       */
      key: RouteKey
      /** 菜单标签 */
      label: string
      /** 菜单的 i18n 键 */
      i18nKey?: I18n.I18nKey | null
      /** 路由键 */
      routeKey: RouteKey
      /** 路由路径 */
      routePath: RoutePath
      /** 菜单图标 */
      icon?: () => VNode
      /** 菜单排序 */
      order?: number | null
      /** 子菜单 */
      children?: Menu[]
      /** 菜单类型 */
      menuType?: MenuType
    }
  }

  /** 服务命名空间 */
  namespace Service {
    interface ServiceConfigItem {
      /** 后端服务基础地址 */
      baseURL: string
      /** 后端服务基础地址的代理匹配模式 */
      proxyPattern: string
    }

    /** 后端服务响应数据 */
    type Response<T = unknown> = {
      /** 响应码 */
      code: number
      /** 响应消息 */
      message: string
      /** 响应数据 */
      data: T
    }
  }
}
