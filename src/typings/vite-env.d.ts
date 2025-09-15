/**
 * Namespace Env
 *
 * It is used to declare the type of the import.meta object
 */
declare namespace Env {
  /** The router history mode */
  type RouterHistoryMode = 'hash' | 'history' | 'memory'

  /** Interface for import.meta */
  interface ImportMeta extends ImportMetaEnv {
    /** The base url of the application */
    /** The public path of the application */
    readonly VITE_BASE_URL: string
    /** The title of the application */
    readonly VITE_APP_TITLE: string
    /** The port of the application */
    readonly VITE_PORT: number
    /** Whether to open the application in the browser */
    readonly VITE_OPEN: CommonType.YesOrNo
    /** Whether to use https */
    readonly VITE_PROXY: string
    /** Whether to enable the http proxy */
    readonly VITE_HTTP_PROXY: CommonType.YesOrNo
    /** Whether to enable the proxy log */
    readonly VITE_PROXY_LOG: CommonType.YesOrNo
    /** Whether to drop the console */
    readonly VITE_DROP_CONSOLE: CommonType.YesOrNo
    /** The mode of the application */
    readonly VITE_ROUTER_MODE: RouterHistoryMode
    /** The prefix of the storage key */
    readonly VITE_STORAGE_PREFIX: string
    /** The socket url */
    readonly VITE_SOCKET_URL: string
    /** The socket namespace */
    readonly VITE_SOCKET_NAMESPACE: string
    /** The node environment */
    readonly VITE_USER_NODE_ENV: 'development' | 'production'
    /** Whether to enable the Vue DevTools */
    readonly VITE_DEVTOOLS_LAUNCH_EDITOR: import('vite-plugin-vue-devtools').VitePluginVueDevToolsOptions['launchEditor']
    /** Whether to automatically detect updates */
    readonly VITE_AUTOMATICALLY_DETECT_UPDATE: CommonType.YesOrNo
    /** The prefix of the iconify icon */
    readonly VITE_ICON_PREFIX: 'icon'
    /**
     * The prefix of the local icon
     *
     * This prefix is start with the icon prefix
     */
    readonly VITE_ICON_LOCAL_PREFIX: 'icon-local'
    /**
     * Iconify api provider url
     *
     * If the project is deployed in intranet, you can set the api provider url to the local iconify server
     *
     * @link https://docs.iconify.design/api/providers.html
     */
    readonly VITE_ICONIFY_URL?: string
    /**
     * The auth route mode
     *
     * - Static: the auth routes is generated in front-end
     * - Dynamic: the auth routes is generated in back-end
     */
    readonly VITE_AUTH_ROUTE_MODE: 'static' | 'dynamic'
  }
}

interface ImportMeta {
  readonly env: Env.ImportMeta
  glob: import('vite').ImportGlobFunction
}
