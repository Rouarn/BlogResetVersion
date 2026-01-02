<script setup lang="ts">
import { reactive, ref } from 'vue'
import { updateUserInfo } from '@/service/api'
import { useAuthStore } from '@/stores/modules/auth'
import type { FormInst, FormRules } from 'naive-ui'

defineOptions({
  name: 'UserProfile',
})

const authStore = useAuthStore()
const formRef = ref<FormInst | null>(null)
const isEditing = ref(false)
const saving = ref(false)

function normalizeGender(input: unknown): 0 | 1 | 2 {
  const n = Number(input)
  return n === 0 || n === 1 || n === 2 ? (n as 0 | 1 | 2) : 2
}

function getInitialUserForm() {
  return {
    nickname: authStore.userInfo.nickname || '用户',
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

const genderOptions = [
  { label: '男性', value: 0 },
  { label: '女性', value: 1 },
  { label: '保密', value: 2 },
] as const

const rules: FormRules = {
  nickname: [
    { required: true, message: '请输入昵称', trigger: 'blur' },
    { min: 2, max: 20, message: '昵称长度为 2-20 个字符', trigger: 'blur' },
  ],
  mobile: [{ pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }],
  email: [{ type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }],
  bio: [{ max: 200, message: '个人简介最多 200 个字符', trigger: 'blur' }],
}

function handleEdit() {
  isEditing.value = true
}

function handleCancel() {
  isEditing.value = false
  Object.assign(userForm, getInitialUserForm())
}

async function handleSave() {
  if (!formRef.value) return

  try {
    await formRef.value.validate()

    const saveData = {
      ...userForm,
      birthday: userForm.birthday ? new Date(userForm.birthday).toISOString().split('T')[0] : '',
      gender: Number(userForm.gender) as 0 | 1 | 2,
    }

    saving.value = true
    const { error } = await updateUserInfo(authStore.userInfo.id, saveData)
    if (error) return

    authStore.setUserInfo({
      ...authStore.userInfo,
      ...saveData,
    })

    isEditing.value = false
    window.$message?.success('保存成功')
  } catch (_) {
    window.$message?.error('保存失败，请重试')
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <div>
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
  </div>
</template>
