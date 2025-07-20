import { computed, reactive, ref } from 'vue'
import { useRoute } from 'vue-router'
import { fetchLogin } from '@/service/api/login'
import { localStg } from '@/utils/storage'
import { clearAuthStorage, getToken } from './shared'
import { SetupStoreId } from '@/enum'
import { useRouterPush } from '@/hooks/common/router'
import { defineStore } from 'pinia'

const initialState = { token: '', userInfo: { userId: '', userName: '夏季' } }

export const useAuthStore = defineStore(SetupStoreId.Auth, () => {
  const route = useRoute()
  const { toLogin, redirectFromLogin } = useRouterPush(false)

  // token
  const token = ref(getToken())

  // 用户信息
  const userInfo: Api.Auth.UserInfo = reactive(initialState.userInfo)

  // 是否已登录
  const isLogin = computed(() => Boolean(token.value))

  const setToken = (value: string) => {
    token.value = value
    localStg.set('token', value)
  }

  const setUserInfo = (value: Api.Auth.UserInfo) => {
    Object.assign(userInfo, value)
  }

  /**
   * Login
   *
   * @param userName User name
   * @param password Password
   * @param [redirect=true]登录后是否重定向。默认为“true”
   */
  async function login(userName: string, password: string, redirect = true) {
    const { data } = await fetchLogin(userName, password)
    setToken(data.token)

    await redirectFromLogin(redirect)

    window.$notification?.success({
      title: '登录成功',
      content: `欢迎回来：${userInfo.userName}`,
      duration: 4500,
    })
  }

  function $reset() {
    setToken(initialState.token)
    setUserInfo(initialState.userInfo)
  }

  /** Reset auth store */
  async function resetStore() {
    $reset()

    clearAuthStorage()

    if (route.meta.isAuth) {
      await toLogin()
    }
  }
  return {
    token,
    userInfo,
    isLogin,
    login,
    setToken,
    resetStore,
  }
})
