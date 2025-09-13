/**
 * 判断是否为开发模式
 */
export function isDevMode(): boolean {
  return import.meta.env.VITE_USER_NODE_ENV === 'development'
}
