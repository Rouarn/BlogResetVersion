export {}

declare global {
  export interface Window {
    /** NProgress instance */
    NProgress?: import('nprogress').NProgress
    /** Loading bar instance */
    $loadingBar?: import('naive-ui').LoadingBarProviderInst
    /** Dialog instance */
    $dialog?: import('naive-ui').DialogProviderInst
    /** Message instance */
    $message?: import('naive-ui').MessageProviderInst
    /** Notification instance */
    $notification?: import('naive-ui').NotificationProviderInst
    /** Theme instance */
    $loading?: import('@/plugins/loading').LoadingProviderInst
    /** 原始console */
    $originalConsole?: Console
  }

  /** Build time of the project */
  export const BUILD_TIME: string
}
