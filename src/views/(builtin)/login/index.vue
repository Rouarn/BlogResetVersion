<script setup lang="ts">
import { ref } from 'vue'
import PwdLogin from './modules/pwd-login.vue'
import UserRegister from './modules/register.vue'
import SvgIcon from '@/components/custom/svg-icon.vue'

defineOptions({
  name: 'GlobalLogin',
})

type LoginMode = 'pwd' | 'register'

const loginMode = ref<LoginMode>('pwd')

function switchMode(mode: LoginMode) {
  loginMode.value = mode
}

function handleLoginSuccess() {
  // 登录成功后的处理，通常由 store 或 router 处理跳转
}

function handleRegisterSuccess() {
  switchMode('pwd')
}

function handleSwitchToLogin() {
  switchMode('pwd')
}
</script>

<template>
  <div class="relative flex min-h-screen items-center justify-center bg-slate-50 px-4 dark:bg-slate-900">
    <NCard class="w-full max-w-md shadow-xl rounded-2xl" :bordered="false" size="large">
      <div class="mb-8 flex flex-col items-center gap-2">
        <div class="rounded-full bg-indigo-50 p-3 dark:bg-indigo-900/20">
          <SvgIcon icon="ph:feather-duotone" class="text-4xl text-indigo-600" />
        </div>
        <h2 class="text-2xl font-bold text-slate-800 dark:text-white">
          {{ loginMode === 'register' ? '创建账号' : '欢迎回来' }}
        </h2>
        <p class="text-sm text-slate-500">
          {{ loginMode === 'register' ? '填写以下信息完成注册' : '请输入您的账号和密码登录' }}
        </p>
      </div>

      <div class="w-full">
        <Transition name="fade-slide" mode="out-in">
          <div v-if="loginMode === 'pwd'" key="pwd">
            <PwdLogin @login-success="handleLoginSuccess" />
            <div class="mt-6 flex items-center justify-center gap-2 text-sm">
              <span class="text-slate-500">还没有账号？</span>
              <NButton text type="primary" @click="switchMode('register')"> 立即注册 </NButton>
            </div>
          </div>

          <div v-else key="register">
            <UserRegister @register-success="handleRegisterSuccess" @switch-to-login="handleSwitchToLogin" />
          </div>
        </Transition>
      </div>
    </NCard>

    <div class="absolute bottom-6 text-center text-xs text-slate-400">FocusLog &copy; {{ new Date().getFullYear() }}</div>
  </div>
</template>

<style scoped>
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s ease;
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateX(10px);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateX(-10px);
}
</style>
