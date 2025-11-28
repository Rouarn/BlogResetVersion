import { computed, reactive, ref } from 'vue'
import { useRoute } from 'vue-router'
import { fetchLogin, fetchLogout, fetchUserInfo } from '@/service/api/login'
import { localStg } from '@/utils/storage'
import { useThemeStore } from '../theme'
import { clearAuthStorage, getRefreshToken, getToken, getTokenExpiresAt } from './shared'
import { SetupStoreId } from '@/enum'
import { useRouterPush } from '@/hooks/common/router'
import { defineStore } from 'pinia'

const initialState = {
  token: '',
  tokenType: 'Bearer',
  refreshToken: '',
  tokenExpiresAt: 0,
  refreshTokenExpiresAt: 0,
  userInfo: {
    userId: '',
    username: '',
    nickname: '',
    avatar: '',
    gender: 2 as Api.Common.Gender,
    mobile: '',
    email: '',
    bio: '',
    birthday: '',
    city: '',
    profession: '',
    roles: 'user' as Api.Auth.UserRole,
    lastLoginAt: '',
    lastLoginIp: '',
    loginAttempts: 0,
    status: '1' as Api.Common.EnableStatus,
  },
}

export const useAuthStore = defineStore(SetupStoreId.Auth, () => {
  const themeStore = useThemeStore()

  const route = useRoute()
  const { toLogin, redirectFromLogin } = useRouterPush(false)

  const token = ref(getToken())
  const tokenType = ref(localStg.get('tokenType') || initialState.tokenType)
  const refreshToken = ref(getRefreshToken())
  const tokenExpiresAt = ref(getTokenExpiresAt())
  const refreshTokenExpiresAt = ref(Number(localStg.get('refreshTokenExpiresAt') || initialState.refreshTokenExpiresAt))

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

  const setRefreshTokenExpiresAt = (value: number) => {
    refreshTokenExpiresAt.value = value
    localStg.set('refreshTokenExpiresAt', value)
  }

  const setTokenExpiresAt = (value: number) => {
    tokenExpiresAt.value = value
    localStg.set('tokenExpiresAt', value)
  }

  const setUserInfo = (value: Api.Auth.UserInfo) => {
    Object.assign(userInfo, value)
    localStg.set('userInfo', userInfo)
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
    setTokenExpiresAt(Date.now() + Number(data?.expiresIn ?? initialState.tokenExpiresAt) * 1000)
    if (data?.refreshExpiresIn) {
      setRefreshTokenExpiresAt(Date.now() + Number(data.refreshExpiresIn) * 1000)
    }
    const { data: userInfoData } = await fetchUserInfo()
    setUserInfo(userInfoData ?? initialState.userInfo)

    await redirectFromLogin(redirect)

    window.$notification?.success({
      title: '登录成功',
      content: `欢迎回来：${userInfo.nickname || userInfo.username || userInfo.mobile || userInfo.email}`,
      duration: 4500,
    })
  }

  /** 重置认证状态（退出登录并清理本地数据） */
  function resetStore() {
    fetchLogout().then(async () => {
      setUserInfo(initialState.userInfo)
      setToken(initialState.token)
      setRefreshToken(initialState.refreshToken)
      setTokenExpiresAt(initialState.tokenExpiresAt)
      themeStore.resetStore()
      clearAuthStorage()
      if (route.meta.isAuth) {
        await toLogin()
      }
    })
  }
  return {
    token,
    tokenType,
    refreshToken,
    tokenExpiresAt,
    refreshTokenExpiresAt,
    userInfo,
    isLogin,
    login,
    setToken,
    setTokenType,
    setRefreshToken,
    setTokenExpiresAt,
    setRefreshTokenExpiresAt,
    setUserInfo,
    resetStore,
  }
})
