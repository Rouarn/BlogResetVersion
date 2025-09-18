/**
 * Namespace Api
 *
 * All backend api type
 */
declare namespace Api {
  /**
   * namespace Auth
   *
   * backend api module: "auth"
   */
  namespace Auth {
    interface LoginToken {
      accessToken: string
      refreshToken: string
      tokenType: string
      expiresIn: number
    }

    interface Captcha {
      captcha: string
      captchaId: string
    }

    interface UserInfo {
      userId: string
      username: string
      nickname?: string
      avatar?: string
      gender?: 0 | 1 | 2 // 0: 男性, 1: 女性, 2: 未知
      mobile?: string
      email?: string
      bio?: string
      birthday?: string
      city?: string
      profession?: string
      roles?: 'system_admin' | 'org_admin' | 'dept_admin' | 'project_admin' | 'power_user' | 'user' | 'viewer' | 'guest'
      authId?: string
      lastLoginAt?: string
      lastLoginIp?: string
      loginAttempts?: number
      status?: '0' | '1' // 0: 禁用, 1: 启用
    }
  }

  /**
   * namespace Route
   *
   * backend api module: "route"
   */
  namespace Route {
    type RouteRecordRaw = import('vue-router').RouteRecordRaw

    type MenuRoute = {
      id: string
    } & import('@elegant-router/types').AutoRouterRoute

    interface UserRoute {
      routes: MenuRoute[]
    }
  }
}
