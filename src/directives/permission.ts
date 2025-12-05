import type { Directive, DirectiveBinding } from 'vue'

interface PermissionBinding {
  value: string | string[] | PermissionConfig
}

interface PermissionConfig {
  permissions: string | string[]
  mode?: 'some' | 'every' // some: 满足任一权限即可, every: 需要满足所有权限
  fallback?: 'hide' | 'disable' | 'show' // hide: 隐藏元素, disable: 禁用元素, show: 显示提示信息
  fallbackContent?: string // 权限不足时显示的提示内容
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

/**
 * 恢复元素原始状态
 */
function restoreElement(el: HTMLElement) {
  // 移除权限相关的样式和属性
  el.style.display = ''
  el.removeAttribute('disabled')
  el.classList.remove('permission-disabled')
  el.style.pointerEvents = ''
  el.style.opacity = ''

  // 恢复原始内容
  const originalContent = el.getAttribute('data-original-content')
  if (originalContent) {
    el.innerHTML = originalContent
    el.removeAttribute('data-original-content')
  }
}

/**
 * 处理无权限情况
 */
function handleNoPermission(el: HTMLElement, config: PermissionConfig) {
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
  } else if (config.fallback === 'show' && config.fallbackContent) {
    // 保存原始内容
    if (!el.getAttribute('data-original-content')) {
      el.setAttribute('data-original-content', el.innerHTML)
    }
    // 显示权限不足提示
    el.innerHTML = `
      <div style="
        padding: 12px 16px;
        background: #fef2f2;
        border: 1px solid #fecaca;
        border-radius: 6px;
        color: #dc2626;
        font-size: 14px;
        text-align: center;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
      ">
        <svg style="width: 16px; height: 16px; flex-shrink: 0;" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
        </svg>
        <span>${config.fallbackContent}</span>
      </div>
    `
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
      fallbackContent: value.fallbackContent,
    }
  }

  // 获取用户权限
  const userPermissions = getUserPermissions()

  // 检查权限
  const hasPermission = checkUserPermission(userPermissions, config.permissions, config.mode)

  // 根据权限结果处理元素
  if (hasPermission) {
    // 有权限，恢复元素状态
    restoreElement(el)
  } else {
    // 无权限，根据fallback策略处理
    handleNoPermission(el, config)
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

    // 监听权限更新事件
    const handlePermissionUpdate = () => {
      checkPermission(el, binding)
    }

    // 保存事件处理函数引用，用于卸载时移除
    ;(el as HTMLElement & { __permissionUpdateHandler__?: () => void }).__permissionUpdateHandler__ = handlePermissionUpdate
    window.addEventListener('permissionUpdate', handlePermissionUpdate)
  },

  updated(el: HTMLElement, binding: DirectiveBinding<PermissionBinding['value']>) {
    checkPermission(el, binding)
  },

  beforeUnmount(el: HTMLElement) {
    // 移除事件监听器
    const elementWithHandler = el as HTMLElement & { __permissionUpdateHandler__?: () => void }
    const handler = elementWithHandler.__permissionUpdateHandler__
    if (handler) {
      window.removeEventListener('permissionUpdate', handler)
      delete elementWithHandler.__permissionUpdateHandler__
    }
  },
}

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
