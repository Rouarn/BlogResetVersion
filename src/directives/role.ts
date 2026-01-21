import { useRole } from '@/hooks/auth/use-role'
import type { Directive, DirectiveBinding } from 'vue'

/**
 * 角色名称类型，对应后端返回的 Api.Auth.UserRole
 * 示例：'R_SUPER_ADMIN' | 'R_EDITOR' | 'R_USER' ...
 */
type RoleName = Api.Auth.UserRole

/**
 * v-role 指令配置
 *
 * roles：需要匹配的角色（单个或多个）
 * mode：匹配模式（some：包含其一即可；every：必须全部包含）
 * fallback：
 *  - hide：无权限时直接隐藏元素
 *  - disable：无权限时禁用元素（展示但不可操作）
 */
interface RoleConfig {
  roles: RoleName | RoleName[]
  mode?: 'some' | 'every'
  fallback?: 'hide' | 'disable'
}

/**
 * 指令支持的三种绑定形式：
 * - v-role="'R_SUPER_ADMIN'"
 * - v-role="['R_SUPER_ADMIN', 'R_EDITOR']"
 * - v-role="{ roles: 'R_SUPER_ADMIN', mode: 'every', fallback: 'disable' }"
 */
type RoleBindingValue = RoleName | RoleName[] | RoleConfig

/**
 * 记录每个元素对应的“权限重算函数”
 *
 * key：DOM 元素
 * value：触发角色重新校验的函数（用于 permissionCheck 事件）
 *
 * 使用 WeakMap 的原因：
 * - key 是弱引用，元素被销毁后映射不会阻止 GC
 * - 避免在 DOM 上挂自定义属性污染类型
 */
const recheckMap = new WeakMap<HTMLElement, () => void>()

/**
 * 恢复元素到“有权限可见”的状态
 *
 * - 还原标题 display
 * - 移除 disabled 属性和样式
 */
function restoreElement(el: HTMLElement) {
  el.style.display = ''
  el.removeAttribute('disabled')
  el.classList.remove('permission-disabled')
  el.style.pointerEvents = ''
  el.style.opacity = ''
}

/**
 * 无权限时根据 fallback 配置处理元素
 *
 * - hide：直接隐藏元素
 * - disable：禁用元素，禁止点击并降低透明度
 */
function handleNoPermission(el: HTMLElement, config: RoleConfig) {
  if (config.fallback === 'disable') {
    el.setAttribute('disabled', 'true')
    el.classList.add('permission-disabled')
    if (el.tagName.toLowerCase() === 'button') {
      el.style.pointerEvents = 'none'
      el.style.opacity = '0.5'
    }
    return
  }
  el.style.display = 'none'
}

/**
 * 核心检查逻辑：根据指令绑定值解析配置，并调用 useRole.hasRole 进行判断
 */
function checkRole(el: HTMLElement, binding: DirectiveBinding<RoleBindingValue>) {
  const { value } = binding

  if (!value) {
    console.warn('v-role: 角色值不能为空')
    return
  }

  let config: RoleConfig

  // 简写形式：v-role="'R_SUPER_ADMIN'" 或 v-role="['R_SUPER_ADMIN', 'R_EDITOR']"
  if (typeof value === 'string' || Array.isArray(value)) {
    config = { roles: value, mode: 'some', fallback: 'hide' }
  } else {
    // 完整配置形式：v-role="{ roles, mode, fallback }"
    config = {
      roles: value.roles,
      mode: value.mode || 'some',
      fallback: value.fallback || 'hide',
    }
  }

  const { hasRole } = useRole()
  const ok = hasRole(config.roles, config.mode)

  if (ok) {
    restoreElement(el)
  } else {
    handleNoPermission(el, config)
  }
}

/**
 * v-role 自定义指令
 *
 * - mounted：首次挂载时根据角色处理元素，并绑定 permissionCheck 事件
 * - updated：绑定值变化时重新检查角色，并替换事件 handler
 * - unmounted：指令卸载时移除事件监听，避免内存泄漏
 *
 * permissionCheck 事件用途：
 * - 外部在角色或权限变化时，可以主动 dispatch 该事件
 * - v-role 会重新执行 checkRole，保证视图与角色状态同步
 */
const role: Directive = {
  mounted(el: HTMLElement, binding: DirectiveBinding<RoleBindingValue>) {
    // 初始挂载时先做一次角色检查
    checkRole(el, binding)

    // 标记该元素受角色控制（方便全局查询）
    el.setAttribute('data-permission', '')

    // 保存并绑定重算函数
    const recheck = () => checkRole(el, binding)
    recheckMap.set(el, recheck)
    el.addEventListener('permissionCheck', recheck)
  },
  updated(el: HTMLElement, binding: DirectiveBinding<RoleBindingValue>) {
    // 指令绑定值变化时重新检查
    checkRole(el, binding)

    // 替换旧的重算函数，防止闭包中引用旧的 binding
    const oldRecheck = recheckMap.get(el)
    if (oldRecheck) {
      el.removeEventListener('permissionCheck', oldRecheck)
    }

    const recheck = () => checkRole(el, binding)
    recheckMap.set(el, recheck)
    el.addEventListener('permissionCheck', recheck)
  },
  unmounted(el: HTMLElement) {
    // 指令卸载时移除事件监听，释放 WeakMap 中的引用
    const recheck = recheckMap.get(el)
    if (recheck) {
      el.removeEventListener('permissionCheck', recheck)
      recheckMap.delete(el)
    }
  },
}

export default role
