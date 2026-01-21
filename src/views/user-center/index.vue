<script setup lang="ts">
import { computed, nextTick, ref } from 'vue'
import { NAvatar, NCard, NTabPane, NTabs, NTag, NUpload } from 'naive-ui'
import CategoryManagement from './components/CategoryManagement.vue'
import MyArticles from './components/MyArticles.vue'
import UserProfile from './components/UserProfile.vue'
import UserSecurity from './components/UserSecurity.vue'
import CroppingImage from '@/components/custom/cropping-image.vue'
import { uploadAvatar } from '@/service/api'
import { useAuthStore } from '@/stores/modules/auth'
import type { UploadFileInfo } from 'naive-ui'

defineOptions({
  name: 'UserCenter',
})

const authStore = useAuthStore()
const activeTab = ref('profile')

// 角色映射
const roleMap = {
  system_admin: '系统管理员',
  org_admin: '组织管理员',
  dept_admin: '部门管理员',
  project_admin: '项目管理员',
  power_user: '高级用户',
  user: '普通用户',
  viewer: '查看者',
  guest: '访客',
} as const

// 计算属性
const userRoleName = computed(() => {
  const roles = authStore.userInfo.roles
  if (Array.isArray(roles) && roles.length > 0) {
    return roles.map((role) => roleMap[role.alias as keyof typeof roleMap] || role.name).join(' / ')
  }
  return '普通用户'
})

const statusText = computed(() => {
  return authStore.userInfo.auth.status === 1 ? '正常' : '禁用'
})

const statusType = computed(() => {
  return authStore.userInfo.auth.status === 1 ? 'success' : 'error'
})

// 格式化日期
function formatDate(dateStr?: string | Date) {
  if (!dateStr) return '-'
  const d = new Date(dateStr)
  if (Number.isNaN(d.getTime())) return '-'
  return d.toLocaleString('zh-CN')
}

// 头像上传
const cutterRef = ref<InstanceType<typeof CroppingImage> | null>(null)
function onAvatarFileChange({ fileList }: { fileList: Array<UploadFileInfo> }) {
  const f = fileList?.[fileList.length - 1]?.file
  if (!f) return
  cutterRef.value?.openCropper()
  nextTick(() => cutterRef.value?.setImage(f))
}

async function onCropDone(payload: { blob?: Blob; fileName?: string }) {
  if (!payload.blob) return
  const type = payload.blob.type || 'image/jpeg'
  const name = `avatar_${authStore.userInfo.id}_${authStore.userInfo.nickname || 'user'}_${Date.now()}.${type.split('/')[1] || 'jpeg'}`
  const file = new File([payload.blob], name, { type })

  // 预览
  // 临时更新 store 显示，失败则回滚? 或者直接更新
  const oldAvatar = authStore.userInfo.avatar

  try {
    const res = await uploadAvatar(file)
    if (res.data && res.data.downloadUrl) {
      authStore.setUserInfo({
        ...authStore.userInfo,
        avatar: res.data.downloadUrl,
      })
      window.$message?.success('头像上传成功')
    }
  } catch (_) {
    window.$message?.error('头像上传失败，请重试')
    // 恢复
    if (oldAvatar) {
      // authStore.userInfo.avatar = oldAvatar // authStore state is protected? need setUserInfo
    }
  } finally {
    cutterRef.value?.closeCropper()
    cutterRef.value?.clearImage()
  }
}

function onCropError(msg: string) {
  window.$message?.error(msg)
}
</script>

<template>
  <div class="user-center-container p-6 max-w-6xl mx-auto">
    <!-- 页面标题 -->
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-800 mb-2">个人中心</h1>
      <p class="text-gray-600">管理您的个人信息和账户设置</p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <!-- 左侧信息卡片 -->
      <div class="lg:col-span-1">
        <NCard class="text-center">
          <div class="flex flex-col items-center space-y-4">
            <!-- 头像 -->
            <NUpload
              :default-upload="false"
              :show-file-list="false"
              accept="image/*"
              class="cursor-pointer hover-avatar"
              @change="onAvatarFileChange"
            >
              <!-- 有头像时显示头像 -->
              <NAvatar
                v-if="authStore.userInfo.avatar"
                :size="100"
                :src="authStore.userInfo.avatar"
                round
                class="border-4 border-white shadow-lg"
              />
              <!-- 无头像时显示默认头像 -->
              <div v-else class="default-avatar">
                <SvgIcon icon="ph:user-circle" class="text-4xl text-gray-400" />
                <span class="text-xs text-gray-500 mt-1">未设置</span>
              </div>
            </NUpload>

            <!-- 基本信息 -->
            <div class="space-y-2">
              <h3 class="text-xl font-semibold text-gray-800">{{ authStore.userInfo.nickname }}</h3>
              <p class="text-gray-600">@{{ authStore.userInfo.auth.username }}</p>
              <NTag :type="statusType" size="small">
                {{ statusText }}
              </NTag>
              <!-- 头像提示 -->
              <p class="text-xs text-gray-400 mt-2">点击头像可更换</p>
            </div>

            <!-- 角色信息 -->
            <div class="w-full pt-4 border-t border-gray-200">
              <div class="flex justify-between items-center mb-2">
                <span class="text-sm text-gray-600">角色</span>
                <NTag type="info" size="small">{{ userRoleName }}</NTag>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-sm text-gray-600 whitespace-nowrap mr-3">用户ID</span>
                <!-- 悬浮提示 -->
                <span class="text-xs text-gray-500 font-mono ellipsis-text" :title="authStore.userInfo.id">
                  {{ authStore.userInfo.id }}
                </span>
              </div>
            </div>
          </div>
        </NCard>

        <!-- 登录信息 -->
        <NCard class="mt-4" title="登录信息">
          <div class="space-y-3">
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-600">最后登录</span>
              <span class="text-xs text-gray-500">{{ formatDate(authStore.userInfo.auth.lastLoginAt) }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-600">登录IP</span>
              <span class="text-xs text-gray-500 font-mono">{{ authStore.userInfo.auth.lastLoginIp || '-' }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-600">失败次数</span>
              <span class="text-xs text-gray-500">{{ authStore.userInfo.auth.loginAttempts || 0 }}</span>
            </div>
          </div>
        </NCard>
      </div>

      <!-- 右侧主内容区域 -->
      <div class="lg:col-span-3">
        <NCard>
          <NTabs v-model:value="activeTab" type="line" animated>
            <!-- 个人信息标签页 -->
            <NTabPane name="profile" tab="个人信息">
              <UserProfile />
            </NTabPane>

            <!-- 我的文章标签页 -->
            <NTabPane name="my-articles" tab="我的文章">
              <MyArticles />
            </NTabPane>

            <!-- 分类管理标签页 -->
            <NTabPane name="category-management" tab="分类管理">
              <CategoryManagement />
            </NTabPane>

            <!-- 安全设置标签页 -->
            <NTabPane name="security" tab="安全设置">
              <UserSecurity />
            </NTabPane>
          </NTabs>
        </NCard>
      </div>
    </div>
    <CroppingImage
      ref="cutterRef"
      :show-file-input="true"
      cropper-title="裁剪头像"
      :mask-closable="false"
      @done="onCropDone"
      @error="onCropError"
    />
  </div>
</template>

<style lang="scss" scoped>
.user-center-container {
  min-height: calc(100vh - 160px);
}

// 卡片阴影效果
:deep(.n-card) {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  border-radius: 12px;
  transition: box-shadow 0.3s ease;

  &:hover {
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  }
}

// 头像相关的样式
:deep(.n-avatar) {
  width: 100px;
  height: 100px;
}

// 默认头像样式
.default-avatar {
  width: 100px;
  height: 100px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  border: 4px solid white;
  border-radius: 50%;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

// 表单样式优化
:deep(.n-form-item-label) {
  font-weight: 500;
  color: #374151;
}

// 按钮样式优化
:deep(.n-button) {
  border-radius: 8px;
}

// 标签页样式
:deep(.n-tabs-nav) {
  padding: 0 16px;
}

:deep(.n-tabs-tab) {
  font-weight: 500;
}

// 头像上传按钮
:deep(.n-upload) {
  width: auto;
}

// 响应式设计
@media (max-width: 768px) {
  .user-center-container {
    padding: 1rem;
  }

  :deep(.n-form-item) {
    margin-bottom: 16px;
  }
}

.hover-avatar {
  position: relative;
  display: inline-block;

  &:hover::after {
    content: '点击上传';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: rgba(0, 0, 0, 0.4);
    background-image:
      linear-gradient(to right, rgba(255, 255, 255, 0.2) 1px, transparent 1px),
      linear-gradient(to bottom, rgba(255, 255, 255, 0.2) 1px, transparent 1px);
    background-size: 12px 12px;
    color: white;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    font-size: 12px;
    pointer-events: none;
  }
}

:deep(.n-upload-trigger) {
  display: flex;
  align-items: center;
  justify-content: center;
}

:deep(.n-upload-trigger.n-upload-trigger--disabled) {
  opacity: 1;
}
</style>
