/**
 * 后端微服务模块前缀配置
 * 统一管理所有微服务的 API 前缀
 */

/** 认证服务 API 前缀 */
export const AUTH_API_PREFIX = '/api/v1/auth'

/** 用户服务 API 前缀 */
export const USER_API_PREFIX = '/api/v1/user'

/** 文件服务 API 前缀 */
export const FILE_API_PREFIX = '/api/v1/file'

/** 通用 API 前缀 */
export const COMMON_API_PREFIX = '/api/v1'

/** @deprecated 使用 COMMON_API_PREFIX 替代 */
export const PORT1 = COMMON_API_PREFIX

/** API 前缀映射 */
export const API_PREFIX_MAP = {
  auth: AUTH_API_PREFIX,
  user: USER_API_PREFIX,
  file: FILE_API_PREFIX,
  common: COMMON_API_PREFIX,
} as const

/** API 前缀类型 */
export type ApiPrefixKey = keyof typeof API_PREFIX_MAP
