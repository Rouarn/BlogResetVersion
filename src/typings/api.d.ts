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
      username: string
      password: string
      captchaCode: string
      captchaToken: string
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
      color?: string
      sortOrder: number
      count: number
    }

    interface CreateCategoryDto {
      name: string
      code: string
      color?: string
      sortOrder: number
    }

    type UpdateCategoryDto = Partial<CreateCategoryDto>
  }

  /**
   * namespace Article
   *
   * backend api module: "article"
   */
  namespace Article {
    type ArticleStatus = 'draft' | 'published'

    type Status = 0 | 1

    interface Article {
      id: number
      title: string
      summary: string
      content: string
      cover: string
      status: ArticleStatus
      views: number
      likes: number
      isFeatured: Status
      categoryId: number
      category: Category.Category
      authorId: string
      author: Auth.UserInfo
      createdAt: string
      updatedAt: string
      prev?: { id: number; title: string }
      next?: { id: number; title: string }
    }

    interface CreateArticleDto {
      title: string
      content: string
      summary?: string
      cover?: string
      categoryId: number | null
      status?: ArticleStatus
      isFeatured?: Status
    }

    type UpdateArticleDto = Partial<CreateArticleDto>

    interface ArticleSearchParams {
      current?: number
      size?: number
      keyword?: string
      categoryId?: number
      status?: number
      authorId?: string
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

  namespace File {
    interface UploadFileResultDto {
      fileId: string
      filename: string
      originalName: string
      size: number
      mimeType: string
      path: string
      hash: string
      downloadUrl: string
    }
  }
}
