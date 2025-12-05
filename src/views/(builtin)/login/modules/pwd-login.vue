<script setup lang="ts">
import { fetchCaptcha, fetchCaptchaCheck } from '@/service/api/login'
import { useAuthStore } from '@/stores/modules/auth'

defineOptions({
  name: 'PwdLogin',
})

const emit = defineEmits<{
  loginSuccess: []
}>()

const authStore = useAuthStore()

const userName = ref('newuser')
const password = ref('password123')
const captcha = ref('') // 验证码
const captchaCode = ref('') // 验证码图片
const captchaToken = ref('') // 验证码token
const loading = ref(false)

// 生成验证码
async function generateCaptcha() {
  const { data, error, message } = await fetchCaptcha()
  if (error) {
    window.$message?.error(message)
    return
  }
  captchaCode.value = data.image
  captchaToken.value = data.token
}

// 重置验证码
async function resetCaptcha() {
  captcha.value = ''
  captchaToken.value = ''
  await generateCaptcha()
}

// 初始化验证码
onMounted(() => {
  generateCaptcha()
})

async function handleLogin() {
  if (loading.value) {
    return
  }

  userName.value = userName.value.trim()
  password.value = password.value.trim()
  captcha.value = captcha.value.trim()

  if (!userName.value || !password.value) {
    window.$message?.error('请输入用户名和密码')
    return
  }

  if ((!captcha.value && captcha.value.length < 1) || captcha.value.length < 4) {
    window.$message?.error('请输入验证码')
    return
  }

  loading.value = true

  try {
    const { error, message } = await fetchCaptchaCheck({
      token: captchaToken.value,
      code: captcha.value,
    })
    console.log(error, message)
    if (error) {
      await resetCaptcha()
      return
    }

    await authStore.login(userName.value, password.value)

    if (authStore.isLogin) {
      emit('loginSuccess')
    }
  } catch (_) {
    window.$message?.error('登录失败，请重试')
    await resetCaptcha()
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <form class="pwd-login-form" @submit.prevent="handleLogin">
    <input type="text" placeholder="您的账号" v-model="userName" :disabled="loading" autofocus />
    <input type="password" placeholder="您的密码" v-model="password" :disabled="loading" />

    <!-- 验证码 -->
    <div class="captcha-container">
      <input type="text" placeholder="请输入验证码" v-model="captcha" class="captcha-input" maxlength="4" :disabled="loading" />
      <div class="captcha-display" @click="resetCaptcha">
        <img :src="captchaCode" alt="验证码" class="captcha-img" />
      </div>
    </div>

    <button class="btn-login" type="submit" :disabled="loading">
      {{ loading ? '登录中...' : '登录' }}
    </button>
  </form>
</template>

<style lang="scss" scoped>
.pwd-login-form {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  z-index: 2;
  opacity: 1;
  transition: opacity 0.5s;

  input {
    outline: none;
    border: 1px solid rgba(255, 255, 255, 0.4);
    background-color: rgba(255, 255, 255, 0.2);
    width: 250px;
    padding: 10px 15px;
    border-radius: 3px;
    margin: 0 auto 10px auto;
    text-align: center;
    color: #fff;
    font-size: 15px;
    transition: 0.25s;

    &::placeholder {
      color: #fff;
      font-size: 14px;
      font-weight: 300;
    }

    &:hover:not(:disabled) {
      background-color: rgba(255, 255, 255, 0.4);
    }

    &:focus {
      background-color: #fff;
      width: 300px;
      color: #ff719a;
    }

    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  }

  .captcha-container {
    display: flex;
    align-items: center;
    gap: 8px;
    margin: 0 auto 10px auto;
    width: 250px;

    .captcha-input {
      width: 150px;
      outline: none;
      border: 1px solid rgba(255, 255, 255, 0.4);
      background-color: rgba(255, 255, 255, 0.2);
      padding: 10px 15px;
      border-radius: 3px;
      text-align: center;
      color: #fff;
      font-size: 15px;
      transition: 0.25s;
      margin: 0;

      &::placeholder {
        color: #fff;
        font-size: 14px;
        font-weight: 300;
      }

      &:hover:not(:disabled) {
        background-color: rgba(255, 255, 255, 0.4);
      }

      &:focus {
        background-color: #fff;
        color: #ff719a;
        width: 160px;
      }

      &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }
    }

    .captcha-display {
      width: 92px;
      height: 40px;
      background-color: rgba(255, 255, 255, 0.9);
      border: 1px solid rgba(255, 255, 255, 0.4);
      border-radius: 3px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
      font-weight: bold;
      color: #ff719a;
      cursor: pointer;
      user-select: none;
      transition: 0.25s;
      letter-spacing: 1px;

      &:hover {
        background-color: #fff;
        transform: scale(1.02);
      }

      .captcha-img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }
  }

  .btn-login {
    outline: none;
    background-color: #fff;
    color: #ff719a;
    border: none;
    width: 250px;
    padding: 10px 15px;
    border-radius: 3px;
    font-size: 15px;
    cursor: pointer;
    transition: 0.25s;

    &:hover:not(:disabled) {
      background-color: #f5f7f9;
    }

    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  }
}
</style>
