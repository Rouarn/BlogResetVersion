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

    type UserRole = 'system_admin' | 'org_admin' | 'dept_admin' | 'project_admin' | 'power_user' | 'user' | 'viewer' | 'guest'

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
      roles?: UserRole
      authId?: string
      lastLoginAt?: string
      lastLoginIp?: string
      loginAttempts?: number
      status?: Common.EnableStatus
      auth: AuthType
    }

    interface RegisterUser extends Omit<UserInfo, 'id' | 'status' | 'roles' | 'auth'> {
      password: string
    }
  }

  /**
   * namespace Category
   *
   * backend api module: "category"
   */
  namespace Category {
    interface Category {
      id: number
      name: string
      code: string
      description?: string
      sort: number
      status: number
      articleCount?: number
      createTime: string
      updateTime: string
    }

    interface CreateCategoryDto {
      name: string
      code: string
      description?: string
      sort?: number
      status?: number
    }

    type UpdateCategoryDto = Partial<CreateCategoryDto>
  }

  /**
   * namespace Article
   *
   * backend api module: "article"
   */
  namespace Article {
    interface Article {
      id: number
      title: string
      summary: string
      content: string
      cover: string
      status: number
      views: number
      likes: number
      isRecommend: number
      isTop: number
      password?: string
      categoryId: number
      category: Category.Category
      tags: string[]
      authorId: string
      author: Auth.UserInfo
      createTime: string
      updateTime: string
      prev?: { id: number; title: string }
      next?: { id: number; title: string }
    }

    interface CreateArticleDto {
      title: string
      content: string
      summary?: string
      cover?: string
      categoryId: number
      tags?: string[]
      status?: number
      isRecommend?: number
      isTop?: number
      password?: string
    }

    type UpdateArticleDto = Partial<CreateArticleDto>

    interface ArticleSearchParams {
      current?: number
      size?: number
      keyword?: string
      categoryId?: number
      status?: number
    }

    interface ArticleList {
      records: Article[]
      total: number
    }

    interface ArchiveItem {
      id: number
      title: string
      createTime: string
    }

    interface Archive {
      year: string
      articles: ArchiveItem[]
    }
  }

  /**
   * namespace Blog
   *
   * backend api module: "blog"
   */
  namespace Blog {
    // Deprecated: use Api.Article.Article instead
    interface Article {
      id: number
      category: string
      categoryClass: string
      date: string
      title: string
      summary: string
      content: string
      cover: string
      author: string
      avatar: string
      views: number
      prevId?: number | null
      nextId?: number | null
    }

    interface SocialLink {
      key: string
      label: string
      icon: string
      link: string
      class?: string
    }

    interface Profile {
      nickname: string
      title: string
      avatar: string
      cover: string
      bio: string
      currentStatus: string
      socialLinks: SocialLink[]
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
