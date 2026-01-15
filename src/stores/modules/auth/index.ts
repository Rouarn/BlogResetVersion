import { computed, reactive, ref } from 'vue'
import router from '@/router'
import { fetchLogin, fetchLogout, fetchUserInfo } from '@/service/api/login'
import { localStg } from '@/utils/storage'
import { useRouteStore } from '../route'
import { useThemeStore } from '../theme'
import { getRefreshToken, getToken } from './shared'
import { SetupStoreId } from '@/enum'
import { useRouterPush } from '@/hooks/router'
import useBoolean from '@/hooks/state/use-boolean'
import { defineStore } from 'pinia'
import type { ComputedRef, Ref } from 'vue'

interface AuthInitialState {
  token: string
  tokenType: string
  refreshToken: string
  userInfo: Api.Auth.UserInfo
}

interface AuthStoreState {
  token: Ref<string>
  tokenType: Ref<string>
  refreshToken: Ref<string>
  userInfo: Api.Auth.UserInfo
  isLogin: ComputedRef<boolean>
  isUserInfoFetched: Ref<boolean>
}

interface AuthStoreActions {
  setToken(value: string): void
  setTokenType(value: string): void
  setRefreshToken(value: string): void
  setUserInfo(value?: Api.Auth.UserInfo): void
  resetAuthStore(): void
  resetStore(): Promise<void>
  login(username: string, password: string, redirect?: boolean): Promise<void>
  getUserInfo(): Promise<boolean>
}

export type AuthStore = AuthStoreState & AuthStoreActions

const initialState: AuthInitialState = {
  token: '',
  tokenType: 'Bearer',
  refreshToken: '',
  userInfo: {
    username: '',
    id: '',
    nickname: '',
    avatar: '',
    gender: 2,
    mobile: '',
    email: '',
    bio: '',
    birthday: '',
    city: '',
    profession: '',
    roles: [],
    lastLoginAt: '',
    lastLoginIp: '',
    loginAttempts: 0,
    auth: {
      createTime: new Date(),
      updateTime: new Date(),
      id: '',
      username: '',
      status: 1,
      lastLoginAt: new Date(),
      lastLoginIp: '',
      loginAttempts: 0,
      lockedAt: null,
      passwordChangedAt: new Date(),
    },
  },
}

export const useAuthStore = defineStore(SetupStoreId.Auth, (): AuthStore => {
  const themeStore = useThemeStore()
  const routeStore = useRouteStore()
  const { toLogin, redirectFromLogin } = useRouterPush(false)
  const { bool: isUserInfoFetched, setBool: setIsUserInfoFetched } = useBoolean(false)

  const token = ref<string>(getToken())
  const refreshToken = ref<string>(getRefreshToken())
  const tokenType = ref<string>(localStg.get('tokenType') || initialState.tokenType)

  const userInfo: Api.Auth.UserInfo = reactive(localStg.get('userInfo') ?? initialState.userInfo)

  const isLogin = computed<boolean>(() => Boolean(token.value))

  const setToken = (value: string) => {
    token.value = value
    localStg.set('token', value)
  }

  const setTokenType = (value: string) => {
    tokenType.value = value || initialState.tokenType
    localStg.set('tokenType', tokenType.value)
  }

  const setRefreshToken = (value: string) => {
    refreshToken.value = value
    localStg.set('refreshToken', value)
  }

  const setUserInfo = (value: Api.Auth.UserInfo = initialState.userInfo) => {
    Object.assign(userInfo, value)
    localStg.set('userInfo', userInfo)
  }

  /** 重置认证状态（清理本地数据） */
  function resetAuthStore() {
    setUserInfo(initialState.userInfo)
    setToken(initialState.token || '')
    setRefreshToken(initialState.refreshToken || '')
    setIsUserInfoFetched(false)
    themeStore.resetStore()
    routeStore.$reset()
  }

  /** 重置认证状态（退出登录并清理本地数据） */
  async function resetStore() {
    try {
      const { error } = await fetchLogout()
      if (error) return
    } catch (error) {
      console.error('[auth.resetStore] logout failed:', error)
      return
    }

    resetAuthStore()

    const currentRoute = router.currentRoute.value

    if (currentRoute?.meta?.isAuth) {
      await toLogin()
    }
  }

  /**
   * 获取用户信息
   */
  async function getUserInfo() {
    const { data, error } = await fetchUserInfo()
    if (error) {
      routeStore.resetStore()
      resetAuthStore()
      return false
    }
    setUserInfo(data)
    setIsUserInfoFetched(true)
    return true
  }

  /**
   * 登录
   * @param username 用户名
   * @param password 密码
   * @param [redirect=true] 登录后是否重定向，默认 true
   */
  async function login(username: string, password: string, redirect = true) {
    const { data, error } = await fetchLogin(username.trim(), password.trim())
    if (error) return
    setToken(data?.accessToken ?? initialState.token)
    setTokenType(data?.tokenType ?? initialState.tokenType)
    setRefreshToken(data?.refreshToken ?? initialState.refreshToken)

    await redirectFromLogin(redirect)

    window.$notification?.success({
      title: '登录成功',
      content: `欢迎回来：${userInfo.nickname || userInfo.username || userInfo.mobile || userInfo.email}`,
      duration: 4500,
    })
  }

  return {
    token,
    tokenType,
    refreshToken,
    userInfo,
    isLogin,
    isUserInfoFetched,
    login,
    setToken,
    setTokenType,
    setRefreshToken,
    getUserInfo,
    setUserInfo,
    resetStore,
    resetAuthStore,
  }
})
