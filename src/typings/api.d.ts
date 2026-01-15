/**
 * Namespace Api
 *
 * All backend api type
 */
declare namespace Api {
  namespace Common {
    /**
     * enable status
     *
     * - "1": enabled
     * - "0": disabled
     */
    type EnableStatus = 0 | 1

    /**
     * gender
     *
     * - "0": male
     * - "1": female
     * - "2": unknown
     */
    type Gender = 0 | 1 | 2
  }
  /**
   * namespace Auth
   *
   * backend api module: "auth"
   */
  namespace Auth {
    interface LoginToken {
      accessToken: string
      refreshToken: string
      accessTokenTtl: number
      refreshTokenTtl: number
      tokenType: string
    }

    interface Captcha {
      image: string
      token: string
      accessTokenTtl: number
      nonce: string
    }

    interface CaptchaVerify {
      token: string
      code: string
    }

    type UserRole = 'R_SUPER_ADMIN' | 'R_EDITOR' | 'R_USER'

    interface Role {
      id: string
      name: string
      alias: string
      description?: string
      isSystem: boolean
      tenantId?: string
    }

    interface AuthType {
      createTime: Date
      updateTime: Date
      id: string
      username: string
      status: number
      lastLoginAt: Date
      lastLoginIp: string
      loginAttempts: number
      lockedAt: null
      passwordChangedAt: Date
    }

    interface UserInfo {
      id: string
      username: string
      nickname?: string
      avatar?: string
      gender?: Common.Gender
      mobile?: string
      email?: string
      bio?: string
      birthday?: string
      city?: string
      profession?: string
      roles?: Role[]
      authId?: string
      lastLoginAt?: string
      lastLoginIp?: string
      loginAttempts?: number
      status?: Common.EnableStatus
      auth: AuthType
    }

    interface RegisterUser extends Omit<UserInfo, 'id' | 'status' | 'roles' | 'auth'> {
      password: string
      captchaCode: string
      captchaToken: string
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
    } & import('vue-router').RouteMeta

    interface UserRoute {
      routes: MenuRoute[]
    }
  }
}
