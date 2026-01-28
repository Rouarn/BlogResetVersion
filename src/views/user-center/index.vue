<script setup lang="ts">
import { computed, nextTick, reactive, ref } from 'vue'
import CroppingImage from '@/components/custom/cropping-image.vue'
import { changePassword, updateUserInfo, uploadAvatar } from '@/service/api'
import { useAuthStore } from '@/stores/modules/auth'
import type { FormInst, FormRules, UploadFileInfo } from 'naive-ui'

defineOptions({
  name: 'UserCenter',
})

const authStore = useAuthStore()
const formRef = ref<FormInst | null>(null)
const passwordFormRef = ref<FormInst | null>(null)
const isEditing = ref(false)
const activeTab = ref('profile')
const saving = ref(false)
const changingPassword = ref(false)

function normalizeGender(input: unknown): 0 | 1 | 2 {
  const n = Number(input)
  return n === 0 || n === 1 || n === 2 ? (n as 0 | 1 | 2) : 2
}

function getInitialUserForm() {
  return {
    nickname: authStore.userInfo.nickname || '用户',
    avatar: authStore.userInfo.avatar || '',
    gender: normalizeGender(authStore.userInfo.gender),
    mobile: authStore.userInfo.mobile || '',
    email: authStore.userInfo.email || '',
    bio: authStore.userInfo.bio || '',
    birthday: authStore.userInfo.birthday ? new Date(authStore.userInfo.birthday).getTime() : null,
    city: authStore.userInfo.city || '',
    profession: authStore.userInfo.profession || '',
  }
}

const userForm = reactive(getInitialUserForm())

// 密码修改表单
const passwordForm = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: '',
})

// 性别选项
const genderOptions = [
  { label: '男性', value: 0 },
  { label: '女性', value: 1 },
  { label: '保密', value: 2 },
] as const

// 表单验证规则
const rules: FormRules = {
  nickname: [
    { required: true, message: '请输入昵称', trigger: 'blur' },
    { min: 2, max: 20, message: '昵称长度为 2-20 个字符', trigger: 'blur' },
  ],
  mobile: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' },
  ],
  email: [{ type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }],
  bio: [{ max: 200, message: '个人简介最多 200 个字符', trigger: 'blur' }],
}

// 密码验证规则
const passwordRules: FormRules = {
  oldPassword: [{ required: true, message: '请输入当前密码', trigger: 'blur' }],
  newPassword: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 6, message: '密码最少 6 个字符', trigger: 'blur' },
  ],
  confirmPassword: [
    { required: true, message: '请确认新密码', trigger: 'blur' },
    {
      validator: (_rule, value) => {
        return value === passwordForm.newPassword
      },
      message: '两次密码输入不一致',
      trigger: 'blur',
    },
  ],
}

// 计算属性
const userRoleName = computed(() => {
  const roles = authStore.userInfo.roles
  if (Array.isArray(roles) && roles.length > 0) {
    return roles.map((r) => r.alias).join(' / ')
  }
  return '普通用户'
})

const statusText = computed(() => {
  return authStore.userInfo.auth.status === 1 ? '正常' : '禁用'
})

const statusType = computed(() => {
  return authStore.userInfo.auth.status === 1 ? 'success' : 'error'
})

// 方法
function handleEdit() {
  isEditing.value = true
}

function handleCancel() {
  isEditing.value = false
  // 重置表单数据
  Object.assign(userForm, getInitialUserForm())
}

async function handleSave() {
  if (!formRef.value) return

  try {
    await formRef.value.validate()

    // 处理生日数据
    const saveData = {
      ...userForm,
      birthday: userForm.birthday ? new Date(userForm.birthday).toISOString().split('T')[0] : '',
      gender: Number(userForm.gender) as 0 | 1 | 2,
    }

    // 调用更新用户信息的 API
    saving.value = true
    const { error } = await updateUserInfo(authStore.userInfo.id, saveData)
    if (error) return

    // 更新本地状态
    authStore.setUserInfo({
      ...authStore.userInfo,
      ...saveData,
    })

    isEditing.value = false
    window.$message?.success('保存成功')
  } finally {
    saving.value = false
  }
}

async function handlePasswordChange() {
  try {
    await passwordFormRef.value?.validate()
    changingPassword.value = true
    const result = await changePassword({
      oldPassword: passwordForm.oldPassword,
      newPassword: passwordForm.newPassword,
      confirmPassword: passwordForm.confirmPassword,
    })

    if (!result.error) {
      Object.assign(passwordForm, {
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
      })
      window.$message?.success(result.data?.message || '密码修改成功')
      await authStore.resetStore()
    }
  } catch (_) {
    window.$message?.error('密码修改失败，请检查当前密码是否正确')
  } finally {
    changingPassword.value = false
  }
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
  const name = `avatar_${authStore.userInfo.id}_${userForm.nickname || 'user'}_${Date.now()}.${type.split('/')[1] || 'jpeg'}`
  const file = new File([payload.blob], name, { type })

  userForm.avatar = URL.createObjectURL(payload.blob)
  try {
    const res = await uploadAvatar(file)
    if (res.data && res.data.downloadUrl) {
      userForm.avatar = res.data.downloadUrl
      authStore.setUserInfo({
        ...authStore.userInfo,
        avatar: res.data.downloadUrl,
      })
      window.$message?.success('头像上传成功')
    }
  } catch (_) {
    window.$message?.error('头像上传失败，请重试')
  } finally {
    cutterRef.value?.closeCropper()
    cutterRef.value?.clearImage()
  }
}
function onCropError(msg: string) {
  window.$message?.error(msg)
}

// 格式化日期
function formatDate(dateStr?: string | Date) {
  if (!dateStr) return '-'
  const d = new Date(dateStr)
  if (Number.isNaN(d.getTime())) return '-'
  return d.toLocaleString('zh-CN')
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
              :disabled="!isEditing"
              :class="{ 'cursor-pointer hover-avatar': isEditing }"
              @change="onAvatarFileChange"
            >
              <!-- 有头像时显示头像 -->
              <NAvatar v-if="userForm.avatar" :size="100" :src="userForm.avatar" round class="border-4 border-white shadow-lg" />
              <!-- 无头像时显示默认头像 -->
              <div v-else class="default-avatar">
                <SvgIcon icon="ph:user-circle" class="text-4xl text-gray-400" />
                <span class="text-xs text-gray-500 mt-1">未设置</span>
              </div>
            </NUpload>

            <!-- 基本信息 -->
            <div class="space-y-2">
              <h3 class="text-xl font-semibold text-gray-800">{{ userForm.nickname }}</h3>
              <p class="text-gray-600">@{{ authStore.userInfo.auth.username }}</p>
              <NTag :type="statusType" size="small">
                {{ statusText }}
              </NTag>
              <!-- 头像提示 -->
              <p v-if="!userForm.avatar && !isEditing" class="text-xs text-gray-400 mt-2">点击编辑按钮可上传头像</p>
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
              <div class="flex justify-between items-center mb-6">
                <h2 class="text-lg font-semibold text-gray-800">个人资料</h2>
                <div class="space-x-2">
                  <NButton v-if="!isEditing" type="primary" @click="handleEdit">
                    <SvgIcon icon="ph:pencil-simple" class="mr-1" />
                    编辑
                  </NButton>
                  <template v-else>
                    <NButton @click="handleCancel" :disabled="saving">取消</NButton>
                    <NButton type="primary" @click="handleSave" :loading="saving">
                      <SvgIcon icon="ph:check" class="mr-1" />
                      保存
                    </NButton>
                  </template>
                </div>
              </div>

              <NForm ref="formRef" :model="userForm" :rules="rules" label-placement="left" label-width="100" :disabled="!isEditing">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <NFormItem label="昵称" path="nickname">
                    <NInput v-model:value="userForm.nickname" placeholder="请输入昵称" />
                  </NFormItem>

                  <NFormItem label="性别" path="gender">
                    <NRadioGroup v-model:value="userForm.gender">
                      <NSpace>
                        <NRadio v-for="option in genderOptions" :key="option.value" :value="option.value">
                          {{ option.label }}
                        </NRadio>
                      </NSpace>
                    </NRadioGroup>
                  </NFormItem>

                  <NFormItem label="手机号" path="mobile">
                    <NInput v-model:value="userForm.mobile" placeholder="请输入手机号" />
                  </NFormItem>

                  <NFormItem label="邮箱" path="email">
                    <NInput v-model:value="userForm.email" placeholder="请输入邮箱地址" />
                  </NFormItem>

                  <NFormItem label="生日" path="birthday">
                    <NDatePicker v-model:value="userForm.birthday" type="date" placeholder="请选择生日" class="w-full" clearable />
                  </NFormItem>

                  <NFormItem label="所在城市" path="city">
                    <NInput v-model:value="userForm.city" placeholder="请输入所在城市" />
                  </NFormItem>

                  <NFormItem label="职业" path="profession">
                    <NInput v-model:value="userForm.profession" placeholder="请输入职业" />
                  </NFormItem>
                </div>

                <NFormItem label="个人简介" path="bio">
                  <NInput v-model:value="userForm.bio" type="textarea" placeholder="请输入个人简介" :rows="3" show-count maxlength="200" />
                </NFormItem>
              </NForm>
            </NTabPane>

            <!-- 安全设置标签页 -->
            <NTabPane name="security" tab="安全设置">
              <div class="max-w-2xl">
                <h2 class="text-lg font-semibold text-gray-800 mb-6">修改密码</h2>

                <NForm ref="passwordFormRef" :model="passwordForm" :rules="passwordRules" label-placement="left" label-width="120">
                  <NFormItem label="当前密码" path="oldPassword">
                    <NInput
                      v-model:value="passwordForm.oldPassword"
                      type="password"
                      show-password-on="click"
                      placeholder="请输入当前密码"
                    />
                  </NFormItem>

                  <NFormItem label="新密码" path="newPassword">
                    <NInput v-model:value="passwordForm.newPassword" type="password" show-password-on="click" placeholder="请输入新密码" />
                  </NFormItem>

                  <NFormItem label="确认新密码" path="confirmPassword">
                    <NInput
                      v-model:value="passwordForm.confirmPassword"
                      type="password"
                      show-password-on="click"
                      placeholder="请确认新密码"
                    />
                  </NFormItem>

                  <NFormItem>
                    <NButton type="primary" @click="handlePasswordChange" :loading="changingPassword">
                      <SvgIcon icon="ph:lock" class="mr-1" />
                      修改密码
                    </NButton>
                  </NFormItem>
                </NForm>
              </div>
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
