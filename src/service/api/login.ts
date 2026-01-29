import apiPrefix from '@/service/api/prefix'
import { request } from '@/service/request'

/** 用户登录 */
export function fetchLogin(username: string, password: string) {
  return request.post<Api.Auth.LoginToken>(`${apiPrefix.auth}/login`, {
    username,
    password,
  })
}

/** 获取用户信息 */
export function fetchUserInfo() {
  return request.get<Api.Auth.UserInfo>(`${apiPrefix.auth}/getUserInfo`)
}

/** 注册用户 */
export function fetchRegister(user: Api.Auth.RegisterUser) {
  return request.post<Api.Auth.LoginToken>(`${apiPrefix.auth}/register`, user)
}

/** 生成验证码 */
export function fetchCaptcha() {
  return request.get<Api.Auth.Captcha>(`${apiPrefix.auth}/captcha`, {}, { loading: false })
}

/** 验证码校验 */
export function fetchCaptchaCheck({ token, code }: Api.Auth.CaptchaVerify) {
  return request.post<Api.Auth.LoginToken>(`${apiPrefix.auth}/captcha/verify`, {
    token,
    code,
  })
}

/** 退出登录 */
export function fetchLogout() {
  return request.post(`${apiPrefix.auth}/logout`)
}

/** 刷新令牌 集成在请求拦截器中 */
