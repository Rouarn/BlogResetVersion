<script setup lang="ts" name="permissionDirect">
import { computed } from 'vue'
import { useAuthStore } from '@/stores/modules/auth'
import { useRole } from '@/hooks/auth/use-role'

const authStore = useAuthStore()
const { roleNames, hasRole } = useRole()

const userRole = computed(() => {
  const list = roleNames.value
  if (list.includes('R_SUPER_ADMIN')) return 'admin'
  if (list.includes('R_EDITOR')) return 'editor'
  if (list.includes('R_USER')) return 'user'
  return 'guest'
})

const currentPermissions = computed(() => {
  const names = roleNames.value
  const permissions = new Set<string>()

  if (names.includes('R_SUPER_ADMIN')) {
    permissions.add('admin')
    permissions.add('editor')
    permissions.add('user')
  }

  if (names.includes('R_EDITOR')) {
    permissions.add('editor')
    permissions.add('user')
  }

  if (names.includes('R_USER')) {
    permissions.add('user')
  }

  return Array.from(permissions)
})

const switchRole = (role: string) => {
  let nextRoles: Api.Auth.Role[] = []

  if (role === 'admin') {
    nextRoles = [
      {
        id: '',
        name: 'R_SUPER_ADMIN',
        alias: '超级管理员',
        isSystem: true,
      },
    ]
  } else if (role === 'editor') {
    nextRoles = [
      {
        id: '',
        name: 'R_EDITOR',
        alias: '编辑者',
        isSystem: true,
      },
    ]
  } else if (role === 'user') {
    nextRoles = [
      {
        id: '',
        name: 'R_USER',
        alias: '普通用户',
        isSystem: true,
      },
    ]
  } else {
    nextRoles = []
  }

  authStore.setUserInfo({
    ...authStore.userInfo,
    roles: nextRoles,
  })
}

const getPermissionScore = () => {
  const allPermissions = ['admin', 'editor', 'user']
  return Math.round((currentPermissions.value.length / allPermissions.length) * 100)
}
</script>

<template>
  <div class="directive-container">
    <NCard class="directive-card" :bordered="false">
      <template #header>
        <div class="card-header">
          <div class="header-icon">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
          </div>
          <div class="header-content">
            <h3 class="header-title">权限指令</h3>
            <p class="header-desc">基于用户权限控制元素的显示和行为</p>
          </div>
        </div>
      </template>

      <div class="demo-section">
        <div class="demo-title">👤 当前用户状态</div>
        <div class="demo-content">
          <div class="user-status">
            <div class="status-item">
              <span class="label">当前角色:</span>
              <NBadge :value="userRole" type="info" />
            </div>
            <div class="status-item">
              <span class="label">拥有权限:</span>
              <div class="permissions">
                <NBadge
                  v-for="permission in currentPermissions"
                  :key="permission"
                  :value="permission"
                  type="success"
                  class="permission-badge"
                />
              </div>
            </div>
          </div>
          <div class="role-switcher">
            <span class="label">切换角色:</span>
            <NButtonGroup>
              <NButton @click="switchRole('user')" :type="userRole === 'user' ? 'primary' : 'default'" size="small"> 普通用户 </NButton>
              <NButton @click="switchRole('editor')" :type="userRole === 'editor' ? 'primary' : 'default'" size="small"> 编辑者 </NButton>
              <NButton @click="switchRole('admin')" :type="userRole === 'admin' ? 'primary' : 'default'" size="small"> 管理员 </NButton>
              <NButton @click="switchRole('guest')" :type="userRole === 'guest' ? 'primary' : 'default'" size="small"> 访客 </NButton>
            </NButtonGroup>
          </div>
        </div>
      </div>

      <div class="demo-section">
        <div class="demo-title">🔐 单一角色控制（v-role）</div>
        <div class="demo-content">
          <p class="demo-desc">只有拥有指定角色的用户才能看到这些元素</p>
          <div class="permission-demo">
            <NButton v-role="'R_SUPER_ADMIN'" type="error" size="large"> 🗑️ 删除数据 (仅超级管理员可见) </NButton>
            <NButton v-role="'R_EDITOR'" type="warning" size="large"> ✏️ 编辑内容 (编辑者可见) </NButton>
            <NButton v-role="'R_USER'" type="info" size="large"> 👀 查看内容 (普通用户可见) </NButton>
          </div>
        </div>
      </div>

      <div class="demo-section">
        <div class="demo-title">🔒 多角色控制（v-role 多值）</div>
        <div class="demo-content">
          <p class="demo-desc">需要拥有多个角色中的任意一个才能显示</p>
          <div class="permission-demo">
            <NCard v-role="['R_SUPER_ADMIN', 'R_EDITOR']" class="permission-card" title="内容管理面板" :bordered="true">
              <p>这个面板只有超级管理员和编辑者可以看到</p>
              <NSpace>
                <NButton type="primary" size="small">创建内容</NButton>
                <NButton type="warning" size="small">编辑内容</NButton>
                <NButton type="error" size="small">删除内容</NButton>
              </NSpace>
            </NCard>
          </div>
        </div>
      </div>

      <div class="demo-section">
        <div class="demo-title">⚙️ 高级角色配置（v-role 配置对象）</div>
        <div class="demo-content">
          <p class="demo-desc">使用配置对象进行更精细的角色控制</p>
          <div class="permission-demo">
            <!-- 需要所有角色 -->
            <NAlert
              v-role="{
                roles: ['R_SUPER_ADMIN', 'R_EDITOR'],
                mode: 'every',
              }"
              type="info"
              title="超级管理功能"
              class="permission-alert"
            >
              这个功能需要同时拥有超级管理员和编辑者角色才能看到
            </NAlert>

            <!-- 角色不足时禁用而不是隐藏 -->
            <NButton
              v-role="{
                roles: ['R_SUPER_ADMIN'],
                fallback: 'disable',
              }"
              type="primary"
              size="large"
            >
              系统设置 (无权限时禁用)
            </NButton>

            <!-- 这里可以通过 hasRole 展示仅对特定角色显示的内容 -->
            <NCard v-if="hasRole('R_SUPER_ADMIN')" title="敏感数据" :bordered="true">
              <p>这里是一些敏感数据内容，只有超级管理员才能查看</p>
              <NSpace>
                <NButton type="warning" size="small">查看用户数据</NButton>
                <NButton type="error" size="small">导出报表</NButton>
              </NSpace>
            </NCard>
          </div>
        </div>
      </div>

      <div class="demo-section">
        <div class="demo-title">🎭 角色控制示例（基于后端 RBAC）</div>
        <div class="demo-content">
          <p class="demo-desc">使用 v-role 指令基于后端角色标识进行控制</p>
          <div class="permission-demo">
            <NButton v-role="'R_SUPER_ADMIN'" type="error" size="large"> 超级管理员专用按钮 (R_SUPER_ADMIN) </NButton>
            <NButton v-role="['R_SUPER_ADMIN', 'R_EDITOR']" type="primary" size="large"> 管理后台入口 (R_SUPER_ADMIN 或 R_EDITOR) </NButton>
          </div>
        </div>
      </div>
      <div class="demo-section">
        <div class="demo-title">📊 权限统计</div>
        <div class="demo-content">
          <div class="stats-grid">
            <div class="stat-card">
              <div class="stat-icon">👥</div>
              <div class="stat-content">
                <div class="stat-value">{{ currentPermissions.length }}</div>
                <div class="stat-label">当前权限数（由角色推导）</div>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-icon">🔐</div>
              <div class="stat-content">
                <div class="stat-value">{{ userRole }}</div>
                <div class="stat-label">当前角色</div>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-icon">✅</div>
              <div class="stat-content">
                <div class="stat-value">{{ currentPermissions.includes('admin') ? '是' : '否' }}</div>
                <div class="stat-label">管理员权限</div>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-icon">📊</div>
              <div class="stat-content">
                <div class="stat-value">{{ getPermissionScore() }}%</div>
                <div class="stat-label">权限覆盖率</div>
              </div>
            </div>
          </div>

          <!-- 权限级别说明 -->
          <div class="permission-levels">
            <h4>📋 权限级别说明</h4>
            <div class="level-list">
              <div class="level-item" :class="{ active: userRole === 'guest' }">
                <div class="level-badge guest">访客</div>
                <div class="level-desc">无任何权限，只能查看公开内容</div>
              </div>
              <div class="level-item" :class="{ active: userRole === 'user' }">
                <div class="level-badge user">用户</div>
                <div class="level-desc">基础权限，可以查看一般内容</div>
              </div>
              <div class="level-item" :class="{ active: userRole === 'editor' }">
                <div class="level-badge editor">编辑者</div>
                <div class="level-desc">编辑权限，可以创建和编辑内容</div>
              </div>
              <div class="level-item" :class="{ active: userRole === 'admin' }">
                <div class="level-badge admin">管理员</div>
                <div class="level-desc">最高权限，可以访问所有功能</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="code-section">
        <div class="code-title">💻 使用示例</div>
        <div class="code-content">
          <pre><code>&lt;!-- 基于 v-role 的单一角色控制 --&gt;
&lt;button v-role=&quot;'R_SUPER_ADMIN'&quot;&gt;超级管理员按钮&lt;/button&gt;

&lt;!-- 多角色（任意一个） --&gt;
&lt;div v-role=&quot;['R_SUPER_ADMIN', 'R_EDITOR']&quot;&gt;
  超级管理员或编辑者可见
&lt;/div&gt;

&lt;!-- 需要所有角色 --&gt;
&lt;button
  v-role=&quot;{
    roles: ['R_SUPER_ADMIN', 'R_EDITOR'],
    mode: 'every'
  }&quot;
&gt;
  需要同时拥有超级管理员和编辑者角色
&lt;/button&gt;

&lt;!-- 角色不足时禁用而不是隐藏 --&gt;
&lt;button
  v-role=&quot;{
    roles: ['R_SUPER_ADMIN'],
    fallback: 'disable'
  }&quot;
&gt;
  无权限时禁用
&lt;/button&gt;

&lt;!-- 结合 useRole 的逻辑判断 --&gt;
&lt;script setup lang=&quot;ts&quot;&gt;
317→import { useRole } from '@/hooks/auth/use-role'

const { hasRole } = useRole()
&lt;/script&gt;

&lt;div v-if=&quot;hasRole('R_SUPER_ADMIN')&quot;&gt;
  只有超级管理员可以看到的内容
&lt;/div&gt;</code></pre>
        </div>
      </div>

      <div class="feature-section">
        <div class="feature-title">✨ 功能特点</div>
        <div class="feature-list">
          <div class="feature-item">
            <div class="feature-icon">🛡️</div>
            <div class="feature-content">
              <h4>灵活权限控制</h4>
              <p>支持单一权限、多权限、权限组合等多种模式</p>
            </div>
          </div>
          <div class="feature-item">
            <div class="feature-icon">🎯</div>
            <div class="feature-content">
              <h4>多种处理方式</h4>
              <p>支持隐藏、禁用、显示提示等多种权限不足处理方式</p>
            </div>
          </div>
          <div class="feature-item">
            <div class="feature-icon">🔄</div>
            <div class="feature-content">
              <h4>响应式更新</h4>
              <p>权限变化时自动更新元素状态</p>
            </div>
          </div>
        </div>
      </div>
    </NCard>
  </div>
</template>

<style scoped lang="scss">
.directive-container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.directive-card {
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  overflow: hidden;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 16px;
}

.header-icon {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #333;
}

.header-content {
  flex: 1;
}

.header-title {
  font-size: 24px;
  font-weight: 600;
  margin: 0 0 4px 0;
  color: #1a1a1a;
}

.header-desc {
  font-size: 14px;
  color: #666;
  margin: 0;
}

.demo-section {
  margin-bottom: 32px;
}

.demo-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 16px;
  color: #333;
}

.demo-content {
  background: #f8fafc;
  padding: 20px;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

.demo-desc {
  margin: 0 0 16px 0;
  color: #64748b;
  font-size: 14px;
}

.user-status {
  background: white;
  padding: 16px;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  margin-bottom: 16px;
}

.status-item {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.status-item:last-child {
  margin-bottom: 0;
}

.label {
  font-weight: 500;
  color: #374151;
  min-width: 80px;
}

.permissions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.permission-badge {
  margin-right: 4px;
}

.role-switcher {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.permission-demo {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.permission-card {
  max-width: 400px;
}

.permission-alert {
  max-width: 500px;
}

.permission-content {
  max-width: 400px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.stat-card {
  background: white;
  padding: 20px;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  display: flex;
  align-items: center;
  gap: 16px;
}

.stat-icon {
  font-size: 32px;
  flex-shrink: 0;
}

.stat-content {
  flex: 1;
}

.stat-value {
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 14px;
  color: #666;
}

.code-section {
  margin-bottom: 32px;
}

.code-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 16px;
  color: #333;
}

.code-content {
  background: #1e293b;
  color: #e2e8f0;
  padding: 20px;
  border-radius: 8px;
  overflow-x: auto;
}

.code-content pre {
  margin: 0;
  font-family: 'Fira Code', 'Monaco', 'Consolas', monospace;
  font-size: 14px;
  line-height: 1.5;
}

.feature-section {
  margin-bottom: 32px;
}

.feature-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 16px;
  color: #333;
}

.feature-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 16px;
}

.feature-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 16px;
  background: #f8fafc;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

.feature-icon {
  font-size: 24px;
  flex-shrink: 0;
}

.feature-content h4 {
  margin: 0 0 4px 0;
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.feature-content p {
  margin: 0;
  font-size: 14px;
  color: #666;
}

.permission-levels {
  margin-top: 24px;
  padding: 20px;
  background: white;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

.permission-levels h4 {
  margin: 0 0 16px 0;
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.level-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.level-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 12px 16px;
  border-radius: 8px;
  border: 2px solid transparent;
  background: #f8fafc;
  transition: all 0.2s ease;
}

.level-item.active {
  border-color: #3b82f6;
  background: #eff6ff;
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.1);
}

.level-badge {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  min-width: 60px;
  text-align: center;
  color: white;
}

.level-badge.guest {
  background: #9ca3af;
}

.level-badge.user {
  background: #06b6d4;
}

.level-badge.editor {
  background: #f59e0b;
}

.level-badge.admin {
  background: #dc2626;
}

.level-desc {
  flex: 1;
  font-size: 14px;
  color: #6b7280;
  line-height: 1.4;
}
</style>
