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
     * - "2": disabled
     */
    type EnableStatus = '1' | '2'

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
      expiresIn: number
      refreshExpiresIn: number
      tokenType: string
    }

    interface Captcha {
      image: string
      token: string
      expiresIn: number
      nonce: string
    }

    interface CaptchaVerify {
      token: string
      code: string
    }

    type UserRole = 'system_admin' | 'org_admin' | 'dept_admin' | 'project_admin' | 'power_user' | 'user' | 'viewer' | 'guest'

    interface UserInfo {
      userId: string
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
      roles?: UserRole
      authId?: string
      lastLoginAt?: string
      lastLoginIp?: string
      loginAttempts?: number
      status?: Common.EnableStatus // 0: 禁用, 1: 启用
    }

    interface RegisterUser extends Omit<UserInfo, 'userId' | 'status'> {
      password: string
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

  /**
   * namespace Article
   *
   * backend api module: "article"
   */
  namespace Article {
    /**
     * 文章类型
     */
    type ArticleType = '1' | '2' | '3' | string

    /**
     * 创建文章请求参数
     */
    interface CreateArticleRequest {
      title: string
      contentMd: string
      cover?: string
      tags?: string[]
      summary?: string
      type?: ArticleType
      visibility?: Common.EnableStatus
    }

    /**
     * 更新文章请求参数
     */
    interface UpdateArticleRequest extends Omit<CreateArticleRequest, 'contentMd'> {
      contentMd?: string
    }

    /**
     * 文章详情
     */
    interface ArticleDetail extends CreateArticleRequest {
      id: string
      authorId: string
      createTime: string
      updateTime: string
    }
  }
}
