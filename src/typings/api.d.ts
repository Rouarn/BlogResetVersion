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
      token: string
    }

    interface UserInfo {
      userId: string
      userName: string
    }
  }

  /**
   * namespace Home
   *
   * backend api module: "Home"
   */
  namespace Home {
    interface WorkItem {
      id: string | number
      type: string
      url: string
    }

    interface BlogItem {
      id: string | number
      cover: string
      title: string
      description: string
      author: string
      date: string
    }
  }
}
