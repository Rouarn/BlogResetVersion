import type { Directive, DirectiveBinding } from 'vue'

interface PermissionBinding {
  value: string | string[] | PermissionConfig
}

interface PermissionConfig {
  permissions: string | string[]
  mode?: 'some' | 'every' // some: 满足任一权限即可, every: 需要满足所有权限
  fallback?: 'hide' | 'disable' // hide: 隐藏元素, disable: 禁用元素
}

/**
 * 获取用户权限
 * 这里是示例实现，实际项目中应该从 store、localStorage 或 API 获取
 */
function getUserPermissions(): string[] {
  // 示例：从 localStorage 获取权限
  try {
    const permissions = localStorage.getItem('userPermissions')
    return permissions ? JSON.parse(permissions) : ['user'] // 默认用户权限
  } catch {
    return ['user'] // 默认用户权限
  }
}

/**
 * 检查用户是否有指定权限
 */
function checkUserPermission(userPermissions: string[], requiredPermissions: string | string[], mode: 'some' | 'every' = 'some'): boolean {
  const required = Array.isArray(requiredPermissions) ? requiredPermissions : [requiredPermissions]

  if (mode === 'every') {
    // 需要满足所有权限
    return required.every((permission) => userPermissions.includes(permission))
  } else {
    // 满足任一权限即可
    return required.some((permission) => userPermissions.includes(permission))
  }
}

function checkPermission(el: HTMLElement, binding: DirectiveBinding<PermissionBinding['value']>) {
  const { value } = binding

  if (!value) {
    console.warn('v-permission: 权限值不能为空')
    return
  }

  // 解析配置
  let config: PermissionConfig
  if (typeof value === 'string') {
    config = { permissions: value, mode: 'some', fallback: 'hide' }
  } else if (Array.isArray(value)) {
    config = { permissions: value, mode: 'some', fallback: 'hide' }
  } else {
    config = {
      permissions: value.permissions,
      mode: value.mode || 'some',
      fallback: value.fallback || 'hide',
    }
  }

  // 获取用户权限（这里需要根据实际项目的权限管理方式来实现）
  const userPermissions = getUserPermissions()

  // 检查权限
  const hasPermission = checkUserPermission(userPermissions, config.permissions, config.mode)

  // 根据权限结果处理元素
  if (hasPermission) {
    // 有权限，恢复元素状态
    el.style.display = ''
    el.removeAttribute('disabled')
    el.classList.remove('permission-disabled')
  } else {
    // 无权限，根据fallback策略处理
    if (config.fallback === 'hide') {
      el.style.display = 'none'
    } else if (config.fallback === 'disable') {
      el.setAttribute('disabled', 'true')
      el.classList.add('permission-disabled')
      // 如果是按钮，阻止点击事件
      if (el.tagName.toLowerCase() === 'button') {
        el.style.pointerEvents = 'none'
        el.style.opacity = '0.5'
      }
    }
  }
}

/**
 * v-permission 权限控制指令
 * 用法：
 * <button v-permission="'admin'">管理员按钮</button>
 * <button v-permission="['admin', 'user']">多权限按钮</button>
 * <button v-permission="{ permissions: ['admin'], mode: 'every', fallback: 'disable' }">配置权限</button>
 */
const permission: Directive = {
  mounted(el: HTMLElement, binding: DirectiveBinding<PermissionBinding['value']>) {
    checkPermission(el, binding)
  },

  updated(el: HTMLElement, binding: DirectiveBinding<PermissionBinding['value']>) {
    checkPermission(el, binding)
  },
}

// getUserPermissions 和 checkUserPermission 函数已在上方定义

// 添加权限管理的辅助函数
export const PermissionHelper = {
  /**
   * 设置用户权限
   */
  setUserPermissions(permissions: string[]) {
    localStorage.setItem('userPermissions', JSON.stringify(permissions))
    // 触发权限更新事件，让所有使用权限指令的元素重新检查权限
    window.dispatchEvent(new CustomEvent('permissionUpdate'))
  },

  /**
   * 获取用户权限
   */
  getUserPermissions(): string[] {
    return getUserPermissions()
  },

  /**
   * 检查权限
   */
  hasPermission(permissions: string | string[], mode: 'some' | 'every' = 'some'): boolean {
    const userPermissions = getUserPermissions()
    return checkUserPermission(userPermissions, permissions, mode)
  },
}

export default permission
