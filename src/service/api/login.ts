import { request } from '@/service/request'
import servicePort from '@/service/request/servicePort'

/**
 * 用户登录
 * @param userName 用户名
 * @param password 密码
 */
export function fetchLogin(username: string, password: string) {
  return request.post<Api.Auth.LoginToken>(`${servicePort.auth}/login`, {
    username,
    password,
  })
}

/**
 * 获取用户信息
 */
export function fetchUserInfo() {
  return request.get<Api.Auth.UserInfo>(`${servicePort.auth}/getUserInfo`)
}

/**
 * 注册用户
 * @param username 用户名
 * @param password 密码
 */
export function fetchRegister(user: Api.Auth.RegisterUser) {
  return request.post<Api.Auth.LoginToken>(`${servicePort.auth}/register`, user)
}

/**
 * 生成验证码
 */
export function fetchCaptcha() {
  return request.get<Api.Auth.Captcha>(`${servicePort.auth}/captcha`, {}, { loading: false })
}

/**
 * 验证码校验
 * @param token 验证码token
 * @param code 验证码
 */
export function fetchCaptchaCheck({ token, code }: Api.Auth.CaptchaVerify) {
  return request.post<Api.Auth.LoginToken>(`${servicePort.auth}/captcha/verify`, {
    token,
    code,
  })
}

/** 退出登录 */
export function fetchLogout() {
  return request.post(`${servicePort.auth}/logout`)
}
