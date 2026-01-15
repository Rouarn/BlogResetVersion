import { computed } from 'vue'
import { useAuthStore } from '@/stores/modules/auth'

/**
 * 角色名称类型，对应后端定义的用户角色枚举
 * 示例：'R_SUPER_ADMIN' | 'R_EDITOR' | 'R_USER' ...
 */
type RoleName = Api.Auth.UserRole

/**
 * useRole 配置项
 * mode：默认的角色匹配模式（some：包含其一即可；every：必须全部包含）
 */
interface UseRoleOptions {
  mode?: 'some' | 'every'
}

/**
 * 角色工具 Hook
 *
 * 基于 authStore 中的 userInfo.roles 提供：
 * - roles：完整角色对象列表
 * - roleNames：仅角色名数组（方便匹配）
 * - hasRole：校验当前用户是否具备指定角色
 */
export function useRole(options?: UseRoleOptions) {
  const authStore = useAuthStore()

  /**
   * 当前用户拥有的角色列表（完整 Role 对象）
   */
  const roles = computed(() => authStore.userInfo.roles ?? [])

  /**
   * 当前用户拥有的角色名列表
   * 只保留 Role.name 字段，简化比较逻辑
   */
  const roleNames = computed<RoleName[]>(() => roles.value.map((r) => r.name as RoleName))

  /**
   * 判断当前用户是否拥有指定角色
   *
   * @param required 需要匹配的角色（单个或多个）
   * @param mode 匹配模式：
   *  - some：只要包含其中任意一个即可（默认）
   *  - every：必须全部包含
   */
  function hasRole(required: RoleName | RoleName[], mode: 'some' | 'every' = options?.mode ?? 'some') {
    const list = Array.isArray(required) ? required : [required]
    if (!list.length) return false
    const current = roleNames.value
    if (mode === 'every') {
      return list.every((r) => current.includes(r))
    }
    return list.some((r) => current.includes(r))
  }

  return {
    roles,
    roleNames,
    hasRole,
  }
}
