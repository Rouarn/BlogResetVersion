/** 存储命名空间 */
declare namespace StorageType {
  interface Session {
    /** 主题颜色 */
    themeColor: string
  }

  interface Local {
    /** 国际化语言 */
    lang: App.I18n.LangType
    /** 令牌 */
    token: string
    /** 刷新令牌 */
    refreshToken: string
    /** 认证类型 */
    tokenType: string
    /** 用户信息 */
    userInfo: Api.Auth.UserInfo
    /** 主题颜色 */
    themeColor: string
    /** 深色模式 */
    darkMode: boolean
    /** 主题设置 */
    themeSettings: App.Theme.ThemeSetting
    /**
     * 覆盖主题的标识
     *
     * 值为项目的构建时间
     */
    overrideThemeFlag: string
    /** 文章草稿缓存（动态键，使用 Record<string, any> 覆盖） */
    [key: `article_draft_${string}`]: Api.Article.CreateArticleDto
  }
}
