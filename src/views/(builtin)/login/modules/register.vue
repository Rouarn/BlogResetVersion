<script setup lang="ts">
import { ref } from 'vue'
import { fetchCaptcha, fetchCaptchaCheck, fetchRegister } from '@/service/api/login'

defineOptions({
  name: 'UserRegister',
})

const emit = defineEmits<{
  registerSuccess: []
  switchToLogin: []
}>()

interface FormData extends Api.Auth.RegisterUser {
  confirmPassword: string
}

// 表单数据
const formData = ref<FormData>({
  username: '',
  password: '',
  confirmPassword: '',
  nickname: '',
  email: '',
  mobile: '',
  gender: 0, // 0: 未知, 1: 男, 2: 女
})

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

// 表单验证
function validateForm() {
  const { username, password, confirmPassword, email, mobile } = formData.value

  if (!username.trim()) {
    window.$message?.error('请输入用户名')
    return false
  }

  if (username.length < 3 || username.length > 20) {
    window.$message?.error('用户名长度应在3-20个字符之间')
    return false
  }

  if (!password.trim()) {
    window.$message?.error('请输入密码')
    return false
  }

  if (password.length < 6) {
    window.$message?.error('密码长度不能少于6位')
    return false
  }

  if (password !== confirmPassword) {
    window.$message?.error('两次输入的密码不一致')
    return false
  }

  if (!captcha.value.trim()) {
    window.$message?.error('请输入验证码')
    return false
  }

  // 邮箱格式验证（可选）
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    window.$message?.error('邮箱格式不正确')
    return false
  }

  // 手机号格式验证（可选）
  if (mobile && !/^1[3-9]\d{9}$/.test(mobile)) {
    window.$message?.error('手机号格式不正确')
    return false
  }

  return true
}

async function handleRegister() {
  if (loading.value) {
    return
  }

  if (!validateForm()) {
    return
  }

  loading.value = true

  try {
    // 先验证验证码
    const { error, message } = await fetchCaptchaCheck({
      token: captchaToken.value,
      code: captcha.value,
    })

    if (error) {
      window.$message?.error(message)
      await resetCaptcha()
      return
    }

    // 准备注册数据
    const registerData = {
      username: formData.value.username.trim(),
      password: formData.value.password.trim(),
      captchaToken: captchaToken.value,
      captchaCode: captcha.value,
      nickname: formData.value.nickname?.trim() || formData.value.username.trim(),
      email: formData.value.email?.trim() || undefined,
      mobile: formData.value.mobile?.trim() || undefined,
      gender: formData.value.gender,
    }

    // 调用注册API
    await fetchRegister(registerData)

    window.$message?.success('注册成功！请登录')
    emit('registerSuccess')
  } catch (_) {
    window.$message?.error('注册失败，请重试')
    await resetCaptcha()
  } finally {
    loading.value = false
  }
}

function handleSwitchToLogin() {
  emit('switchToLogin')
}
</script>

<template>
  <form class="register-form" @submit.prevent="handleRegister">
    <input type="text" placeholder="用户名 (3-20个字符)" v-model="formData.username" :disabled="loading" maxlength="20" autofocus />

    <input type="password" placeholder="密码 (至少6位)" v-model="formData.password" :disabled="loading" minlength="6" />

    <input type="password" placeholder="确认密码" v-model="formData.confirmPassword" :disabled="loading" />

    <input type="text" placeholder="昵称 (可选)" v-model="formData.nickname" :disabled="loading" maxlength="50" />

    <input type="email" placeholder="邮箱 (可选)" v-model="formData.email" :disabled="loading" />

    <input type="tel" placeholder="手机号 (可选)" v-model="formData.mobile" :disabled="loading" maxlength="11" />

    <!-- 性别选择 -->
    <div class="gender-container">
      <label class="gender-label">性别：</label>
      <div class="gender-options">
        <label class="gender-option">
          <input type="radio" v-model="formData.gender" :value="0" :disabled="loading" />
          <span>未知</span>
        </label>
        <label class="gender-option">
          <input type="radio" v-model="formData.gender" :value="1" :disabled="loading" />
          <span>男</span>
        </label>
        <label class="gender-option">
          <input type="radio" v-model="formData.gender" :value="2" :disabled="loading" />
          <span>女</span>
        </label>
      </div>
    </div>

    <!-- 验证码 -->
    <div class="captcha-container">
      <input type="text" placeholder="请输入验证码" v-model="captcha" class="captcha-input" maxlength="4" :disabled="loading" />
      <div class="captcha-display" @click="resetCaptcha">
        <img :src="captchaCode" alt="验证码" class="captcha-img" />
      </div>
    </div>

    <button class="btn-register" type="submit" :disabled="loading">
      {{ loading ? '注册中...' : '注册' }}
    </button>

    <div class="switch-login" @click="handleSwitchToLogin">已有账号？点击登录</div>
  </form>
</template>

<style lang="scss" scoped>
.register-form {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  z-index: 2;
  opacity: 1;
  transition: opacity 0.5s;
  max-height: 70vh;
  overflow-y: auto;
  padding: 10px;

  input[type='text'],
  input[type='password'],
  input[type='email'],
  input[type='tel'] {
    outline: none;
    border: 1px solid rgba(255, 255, 255, 0.4);
    background-color: rgba(255, 255, 255, 0.2);
    width: 250px;
    padding: 8px 12px;
    border-radius: 3px;
    margin: 0 auto 8px auto;
    text-align: center;
    color: #fff;
    font-size: 14px;
    transition: 0.25s;

    &::placeholder {
      color: #fff;
      font-size: 13px;
      font-weight: 300;
    }

    &:hover:not(:disabled) {
      background-color: rgba(255, 255, 255, 0.4);
    }

    &:focus {
      background-color: #fff;
      width: 280px;
      color: #ff719a;
    }

    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  }

  .gender-container {
    display: flex;
    align-items: center;
    margin: 8px auto;
    width: 250px;
    color: #fff;
    font-size: 14px;

    .gender-label {
      margin-right: 10px;
      font-weight: 300;
    }

    .gender-options {
      display: flex;
      gap: 15px;

      .gender-option {
        display: flex;
        align-items: center;
        cursor: pointer;

        input[type='radio'] {
          margin-right: 5px;
          width: auto;

          &:disabled {
            cursor: not-allowed;
          }
        }

        span {
          font-size: 13px;
          font-weight: 300;
        }
      }
    }
  }

  .captcha-container {
    display: flex;
    align-items: center;
    gap: 8px;
    margin: 8px auto;
    width: 250px;

    .captcha-input {
      width: 150px;
      outline: none;
      border: 1px solid rgba(255, 255, 255, 0.4);
      background-color: rgba(255, 255, 255, 0.2);
      padding: 8px 12px;
      border-radius: 3px;
      text-align: center;
      color: #fff;
      font-size: 14px;
      transition: 0.25s;
      margin: 0;

      &::placeholder {
        color: #fff;
        font-size: 13px;
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
      height: 36px;
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

  .btn-register {
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
    margin-top: 10px;

    &:hover:not(:disabled) {
      background-color: #f5f7f9;
    }

    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  }

  .switch-login {
    color: #fff;
    font-size: 13px;
    margin-top: 15px;
    cursor: pointer;
    text-decoration: underline;
    transition: 0.25s;

    &:hover {
      color: #f0f0f0;
    }
  }
}

/* 滚动条样式 */
.register-form::-webkit-scrollbar {
  width: 4px;
}

.register-form::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
}

.register-form::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 2px;
}

.register-form::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.5);
}
</style>
