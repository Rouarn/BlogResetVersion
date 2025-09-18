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
 * 生成验证码
 */
export function fetchCaptcha() {
  return request.get<Api.Auth.Captcha>(`${servicePort.auth}/captcha`, {}, { loading: false })
}

/**
 * 验证码校验
 * @param captcha 验证码
 */
export function fetchCaptchaCheck(captcha: string) {
  return request.post<Api.Auth.LoginToken>(`${servicePort.auth}/loginCheck`, {
    captcha,
  })
}
