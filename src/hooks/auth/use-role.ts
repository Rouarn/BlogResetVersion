import { computed } from 'vue'
import { useAuthStore } from '@/stores/modules/auth'

type RoleName = Api.Auth.UserRole

interface UseRoleOptions {
  mode?: 'some' | 'every'
}

export function useRole(options?: UseRoleOptions) {
  const authStore = useAuthStore()

  const roles = computed(() => authStore.userInfo.roles ?? [])

  const roleNames = computed<RoleName[]>(() => roles.value.map((r) => r.name as RoleName))

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
