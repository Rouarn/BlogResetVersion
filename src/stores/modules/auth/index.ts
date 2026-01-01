import { computed, reactive, ref } from 'vue'
import { useRoute } from 'vue-router'
import { fetchLogin, fetchLogout, fetchUserInfo } from '@/service/api/login'
import { localStg } from '@/utils/storage'
import { useRouteStore } from '../route'
import { useThemeStore } from '../theme'
import { getRefreshToken, getToken } from './shared'
import { SetupStoreId } from '@/enum'
import { useRouterPush } from '@/hooks/common/router'
import { defineStore } from 'pinia'

const initialState = {
  token: '',
  tokenType: 'Bearer',
  refreshToken: '',
  userInfo: {
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
    roles: undefined,
    lastLoginAt: '',
    lastLoginIp: '',
    loginAttempts: 0,
    status: '1',
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
  } as Api.Auth.UserInfo,
}

export const useAuthStore = defineStore(SetupStoreId.Auth, () => {
  const themeStore = useThemeStore()
  const routeStore = useRouteStore()

  const route = useRoute()
  const { toLogin, redirectFromLogin } = useRouterPush(false)

  const token = ref(getToken())
  const tokenType = ref(localStg.get('tokenType') || initialState.tokenType)
  const refreshToken = ref(getRefreshToken())

  // 用户信息
  const userInfo: Api.Auth.UserInfo = reactive(localStg.get('userInfo') ?? initialState.userInfo)

  // 是否已登录
  const isLogin = computed(() => Boolean(token.value))

  const setToken = (value: string) => {
    token.value = value
    localStg.set('token', value)
  }

  const setTokenType = (value: string) => {
    tokenType.value = value || 'Bearer'
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
    themeStore.resetStore()
    routeStore.$reset()
  }

  /** 重置认证状态（退出登录并清理本地数据） */
  async function resetStore() {
    try {
      const { error } = await fetchLogout()
      if (error) return
    } catch {
      return
    }

    resetAuthStore()

    if (route.meta.isAuth) {
      await toLogin()
    }
  }

  /**
   * 获取用户信息
   */
  // 获取用户信息
  async function getUserInfo() {
    const { data, error } = await fetchUserInfo()
    if (error) {
      routeStore.resetStore()
      resetAuthStore()
      return false
    }
    setUserInfo(data)
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
    await getUserInfo()
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
