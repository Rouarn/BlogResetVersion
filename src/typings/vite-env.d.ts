/**
 * Env 命名空间
 *
 * 用于声明 import.meta 对象的类型
 */
declare namespace Env {
  /** 路由历史模式 */
  type RouterHistoryMode = 'hash' | 'history' | 'memory'

  /** import.meta 接口 */
  interface ImportMeta extends ImportMetaEnv {
    /** 应用基础路径 */
    /** 应用的公共路径 */
    readonly VITE_BASE_URL: string
    /** 应用标题 */
    readonly VITE_APP_TITLE: string
    /** 应用端口 */
    readonly VITE_PORT: number
    /** 是否在浏览器中自动打开应用 */
    readonly VITE_OPEN: CommonType.YesOrNo
    /** 是否使用 https */
    readonly VITE_PROXY: string
    /** 是否启用 HTTP 代理 */
    readonly VITE_HTTP_PROXY: CommonType.YesOrNo
    /** 是否启用代理日志 */
    readonly VITE_PROXY_LOG: CommonType.YesOrNo
    /** 是否移除 console */
    readonly VITE_DROP_CONSOLE: CommonType.YesOrNo
    /** 应用的路由模式 */
    readonly VITE_ROUTER_MODE: RouterHistoryMode
    /** 存储键前缀 */
    readonly VITE_STORAGE_PREFIX: string
    /** Node 运行环境 */
    readonly VITE_USER_NODE_ENV: 'development' | 'production'
    /** 是否启用 Vue DevTools */
    readonly VITE_DEVTOOLS_LAUNCH_EDITOR: import('vite-plugin-vue-devtools').VitePluginVueDevToolsOptions['launchEditor']
    /** 是否自动检测更新 */
    readonly VITE_AUTOMATICALLY_DETECT_UPDATE: CommonType.YesOrNo
    /** Iconify 图标前缀 */
    readonly VITE_ICON_PREFIX: 'icon'
    /**
     * 本地图标前缀
     *
     * 该前缀以图标前缀开头
     */
    readonly VITE_ICON_LOCAL_PREFIX: 'icon-local'
    /**
     * Iconify API 提供者地址
     *
     * 如果项目部署在内网，可以将 API 提供者地址设置为本地 Iconify 服务器
     *
     * @link https://docs.iconify.design/api/providers.html
     */
    readonly VITE_ICONIFY_URL?: string
  }
}

interface ImportMeta {
  readonly env: Env.ImportMeta
  glob: import('vite').ImportGlobFunction
}
