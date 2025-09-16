/**
 * @description： 全局状态管理
 */
export enum SetupStoreId {
  App = 'app-store',
  Theme = 'theme-store',
  Auth = 'auth-store',
  Route = 'route-store',
  Tab = 'tab-store',
}

/**
 * @description： 全局默认配置项
 */
export enum GlobalConfig {
  HOME_URL = '/home',
  LOGIN_URL = '/login',
}

/**
 * @description：请求配置
 */
export enum ResultEnum {
  SUCCESS = 200,
  ERROR = 500,
  OVERDUE = 401,
  TIMEOUT = 30000,
  TYPE = 'success',
}
