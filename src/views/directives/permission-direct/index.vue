<script setup lang="ts" name="permissionDirect">
import { nextTick, ref, watch } from 'vue'
import { PermissionHelper } from '@/directives/permission'

const currentPermissions = ref<string[]>(['user'])
const userRole = ref('user')

const setPermissions = (permissions: string[]) => {
  currentPermissions.value = permissions
  // 同步到权限系统
  PermissionHelper.setUserPermissions(permissions)
  // 触发权限更新事件，让所有使用权限指令的元素重新检查权限
  nextTick(() => {
    window.dispatchEvent(new CustomEvent('permissionUpdate'))
  })
}

const switchRole = (role: string) => {
  userRole.value = role
  switch (role) {
    case 'admin':
      setPermissions(['admin', 'user', 'editor'])
      break
    case 'editor':
      setPermissions(['user', 'editor'])
      break
    case 'user':
      setPermissions(['user'])
      break
    default:
      setPermissions([])
  }
}

// 监听权限更新事件，在页面加载时重新检查所有权限指令
watch(
  currentPermissions,
  () => {
    // 延迟一帧执行，确保 DOM 更新完成
    nextTick(() => {
      const elements = document.querySelectorAll('[data-permission]')
      elements.forEach((el) => {
        // 触发指令重新检查
        const event = new CustomEvent('permissionCheck')
        el.dispatchEvent(event)
      })
    })
  },
  { deep: true },
)

// 初始化权限
setPermissions(['user'])

// 计算权限覆盖率
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
        <div class="demo-title">🔐 单一权限控制</div>
        <div class="demo-content">
          <p class="demo-desc">只有拥有指定权限的用户才能看到这些元素</p>
          <div class="permission-demo">
            <NButton v-permission="'admin'" type="error" size="large"> 🗑️ 删除数据 (仅管理员可见) </NButton>
            <NButton v-permission="'editor'" type="warning" size="large"> ✏️ 编辑内容 (编辑者及以上可见) </NButton>
            <NButton v-permission="'user'" type="info" size="large"> 👀 查看内容 (所有用户可见) </NButton>
          </div>
        </div>
      </div>

      <div class="demo-section">
        <div class="demo-title">🔒 多权限控制</div>
        <div class="demo-content">
          <p class="demo-desc">需要拥有多个权限中的任意一个才能显示</p>
          <div class="permission-demo">
            <NCard v-permission="['admin', 'editor']" class="permission-card" title="内容管理面板" :bordered="true">
              <p>这个面板只有管理员和编辑者可以看到</p>
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
        <div class="demo-title">⚙️ 高级权限配置</div>
        <div class="demo-content">
          <p class="demo-desc">使用配置对象进行更精细的权限控制</p>
          <div class="permission-demo">
            <!-- 需要所有权限 -->
            <NAlert
              v-permission="{
                permissions: ['admin', 'editor'],
                mode: 'every',
              }"
              type="info"
              title="超级管理功能"
              class="permission-alert"
            >
              这个功能需要同时拥有管理员和编辑者权限才能看到
            </NAlert>

            <!-- 权限不足时禁用而不是隐藏 -->
            <NButton
              v-permission="{
                permissions: ['admin'],
                fallback: 'disable',
              }"
              type="primary"
              size="large"
            >
              系统设置 (无权限时禁用)
            </NButton>

            <!-- 权限不足时显示提示 -->
            <div
              v-permission="{
                permissions: ['admin'],
                fallback: 'show',
                fallbackContent: '权限不足，请联系管理员获取访问权限',
              }"
              class="permission-content"
            >
              <NCard title="敏感数据" :bordered="true">
                <p>这里是一些敏感数据内容，只有管理员才能查看</p>
                <NSpace>
                  <NButton type="warning" size="small">查看用户数据</NButton>
                  <NButton type="error" size="small">导出报表</NButton>
                </NSpace>
              </NCard>
            </div>
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
                <div class="stat-label">当前权限数</div>
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
          <pre><code>&lt;!-- 单一权限 --&gt;
&lt;button v-permission="'admin'"&gt;管理员按钮&lt;/button&gt;

&lt;!-- 多权限（任意一个） --&gt;
&lt;div v-permission="['admin', 'editor']"&gt;
  管理员或编辑者可见
&lt;/div&gt;

&lt;!-- 需要所有权限 --&gt;
&lt;button v-permission="{
  permissions: ['admin', 'editor'],
  mode: 'every'
}"&gt;
  需要所有权限
&lt;/button&gt;

&lt;!-- 禁用而不是隐藏 --&gt;
&lt;button v-permission="{
  permissions: ['admin'],
  fallback: 'disable'
}"&gt;
  无权限时禁用
&lt;/button&gt;

&lt;!-- 权限不足时显示提示 --&gt;
&lt;div v-permission="{
  permissions: ['admin'],
  fallback: 'show',
  fallbackContent: '权限不足提示'
}"&gt;
  受保护的内容
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
