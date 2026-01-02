<script setup lang="ts">
import { reactive, ref } from 'vue'
import { changePassword } from '@/service/api'
import { useAuthStore } from '@/stores/modules/auth'
import type { FormInst, FormRules } from 'naive-ui'

defineOptions({
  name: 'UserSecurity',
})

const authStore = useAuthStore()
const passwordFormRef = ref<FormInst | null>(null)
const changingPassword = ref(false)

const passwordForm = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: '',
})

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
</script>

<template>
  <div class="max-w-2xl">
    <h2 class="text-lg font-semibold text-gray-800 mb-6">修改密码</h2>

    <NForm ref="passwordFormRef" :model="passwordForm" :rules="passwordRules" label-placement="left" label-width="120">
      <NFormItem label="当前密码" path="oldPassword">
        <NInput v-model:value="passwordForm.oldPassword" type="password" show-password-on="click" placeholder="请输入当前密码" />
      </NFormItem>

      <NFormItem label="新密码" path="newPassword">
        <NInput v-model:value="passwordForm.newPassword" type="password" show-password-on="click" placeholder="请输入新密码" />
      </NFormItem>

      <NFormItem label="确认新密码" path="confirmPassword">
        <NInput v-model:value="passwordForm.confirmPassword" type="password" show-password-on="click" placeholder="请确认新密码" />
      </NFormItem>

      <NFormItem>
        <NButton type="primary" @click="handlePasswordChange" :loading="changingPassword">
          <SvgIcon icon="ph:lock" class="mr-1" />
          修改密码
        </NButton>
      </NFormItem>
    </NForm>
  </div>
</template>
