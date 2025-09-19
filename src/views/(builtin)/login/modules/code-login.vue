<script setup lang="ts">
import { ref } from 'vue'
import { fetchCaptcha, fetchCaptchaCheck } from '@/service/api/login'
import { useAuthStore } from '@/stores/modules/auth'

defineOptions({
  name: 'CodeLogin',
})

const authStore = useAuthStore()

const mobile = ref('')
const smsCode = ref('')
const imageCaptcha = ref('') // 图片验证码
const captchaCode = ref('') // 验证码图片
const captchaToken = ref('') // 验证码token
const loading = ref(false)
const sendingCode = ref(false)
const countdown = ref(0)

// 生成图片验证码
async function generateCaptcha() {
  const { data, error } = await fetchCaptcha()
  if (error) {
    window.$message?.error(error.message)
    return
  }
  captchaCode.value = data.image
  captchaToken.value = data.token
}

// 重置图片验证码
async function resetCaptcha() {
  imageCaptcha.value = ''
  captchaToken.value = ''
  await generateCaptcha()
}

// 初始化验证码
onMounted(() => {
  generateCaptcha()
})

// 倒计时
function startCountdown() {
  countdown.value = 60
  const timer = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) {
      clearInterval(timer)
    }
  }, 1000)
}

// 发送短信验证码
async function sendSmsCode() {
  if (sendingCode.value || countdown.value > 0) {
    return
  }

  const mobileValue = mobile.value.trim()
  const captchaValue = imageCaptcha.value.trim()

  if (!mobileValue) {
    window.$message?.error('请输入手机号')
    return
  }

  if (!/^1[3-9]\d{9}$/.test(mobileValue)) {
    window.$message?.error('手机号格式不正确')
    return
  }

  if (!captchaValue) {
    window.$message?.error('请输入图片验证码')
    return
  }

  sendingCode.value = true

  try {
    // 先验证图片验证码
    const { error } = await fetchCaptchaCheck({
      token: captchaToken.value,
      code: captchaValue,
    })

    if (error) {
      window.$message?.error(error.message)
      await resetCaptcha()
      return
    }

    // 发送短信验证码（需要根据实际API实现）
    const response = await fetch('/api/v1/auth/sms/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        mobile: mobileValue,
        type: 'login',
        captchaToken: captchaToken.value,
        captchaCode: captchaValue,
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || '发送验证码失败')
    }

    window.$message?.success('验证码已发送')
    startCountdown()
  } catch (_) {
    window.$message?.error('发送验证码失败')
    await resetCaptcha()
  } finally {
    sendingCode.value = false
  }
}

// 验证码登录
async function handleCodeLogin() {
  if (loading.value) {
    return
  }

  const mobileValue = mobile.value.trim()
  const smsCodeValue = smsCode.value.trim()

  if (!mobileValue) {
    window.$message?.error('请输入手机号')
    return
  }

  if (!/^1[3-9]\d{9}$/.test(mobileValue)) {
    window.$message?.error('手机号格式不正确')
    return
  }

  if (!smsCodeValue) {
    window.$message?.error('请输入短信验证码')
    return
  }

  if (!/^\d{4,6}$/.test(smsCodeValue)) {
    window.$message?.error('验证码格式不正确')
    return
  }

  loading.value = true

  try {
    authStore.login(mobileValue, smsCodeValue)
  } catch (_) {
    window.$message?.error('登录失败，请重试')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <form class="code-login-form" @submit.prevent="handleCodeLogin">
    <input type="tel" placeholder="请输入手机号" v-model="mobile" :disabled="loading" maxlength="11" autofocus />

    <!-- 图片验证码 -->
    <div class="captcha-container">
      <input
        type="text"
        placeholder="图片验证码"
        v-model="imageCaptcha"
        class="captcha-input"
        maxlength="4"
        :disabled="loading || sendingCode"
      />
      <div class="captcha-display" @click="resetCaptcha">
        <img :src="captchaCode" alt="验证码" class="captcha-img" />
      </div>
    </div>

    <!-- 短信验证码 -->
    <div class="sms-container">
      <input type="text" placeholder="短信验证码" v-model="smsCode" class="sms-input" maxlength="6" :disabled="loading" />
      <button type="button" class="btn-send-code" @click="sendSmsCode" :disabled="sendingCode || countdown > 0 || loading">
        <span v-if="sendingCode">发送中...</span>
        <span v-else-if="countdown > 0">{{ countdown }}s</span>
        <span v-else>发送验证码</span>
      </button>
    </div>

    <button class="btn-login" type="submit" :disabled="loading">
      {{ loading ? '登录中...' : '验证码登录' }}
    </button>
  </form>
</template>

<style lang="scss" scoped>
.code-login-form {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  z-index: 2;
  opacity: 1;
  transition: opacity 0.5s;

  input[type='tel'] {
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

  .sms-container {
    display: flex;
    align-items: center;
    gap: 8px;
    margin: 0 auto 10px auto;
    width: 250px;

    .sms-input {
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

    .btn-send-code {
      width: 92px;
      height: 40px;
      background-color: rgba(255, 255, 255, 0.9);
      border: 1px solid rgba(255, 255, 255, 0.4);
      border-radius: 3px;
      color: #ff719a;
      font-size: 12px;
      font-weight: bold;
      cursor: pointer;
      transition: 0.25s;
      outline: none;

      &:hover:not(:disabled) {
        background-color: #fff;
        transform: scale(1.02);
      }

      &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
        transform: none;
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
