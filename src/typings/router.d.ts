import 'vue-router'

declare module 'vue-router' {
  interface RouteMeta {
    /**
     * 路由的标题
     *
     * 可用于文档标题
     */
    title: string
    /**
     * 路由的国际化键
     *
     * 用于国际化，如果设置了该字段，则标题字段将被忽略
     */
    i18nKey?: App.I18n.I18nKey | null
    /** 是否缓存该路由 */
    isKeepAlive?: boolean | null
    /**
     * 是否需要登录
     *
     * 设置为 true 时，访问该路由将进行登录验证和权限验证
     */
    isAuth?: boolean | null
    /** 路由的外部链接 */
    isLink?: string | null
    /** 菜单是否全屏 */
    isFull?: boolean | null
    /**
     * Iconify 图标
     *
     * 可用于菜单或面包屑中
     */
    icon?: string
    /**
     * 本地图标
     *
     * 位于 "src/assets/svg-icon" 目录下，如果设置了该字段，则 icon 字段将被忽略
     */
    localIcon?: string
    /** 图标大小，宽度和高度相同 */
    iconFontSize?: number
    /** 路由排序权重 */
    order?: number | null
    /** 是否在菜单中隐藏该路由 */
    hideInMenu?: boolean | null
    /**
     * 进入该路由时将激活指定的菜单键
     *
     * 当路由不在菜单中时可用
     *
     * @example
     * 路由为 "user_detail"，如果设置为 "user_list"，菜单 "user_list" 将被激活
     */
    activeMenu?: App.Global.RouteKey | null
    /** 如果设置了查询参数，则在输入路由时自动携带 */
    query?: { key: string; value: string }[] | null
    /** 菜单类型 (1: 目录; 2: 菜单) */
    menuType?: App.Global.MenuType | null
  }
}
