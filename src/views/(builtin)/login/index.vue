<script setup lang="ts">
import PwdLogin from './modules/pwd-login.vue'
import UserRegister from './modules/register.vue'

defineOptions({
  name: 'GlobalLogin',
})

type LoginMode = 'pwd' | 'register'

// 登录模式：'pwd' | 'register'
const loginMode = ref<LoginMode>('pwd')
const isSuccess = ref(false)

// 切换登录模式
function switchMode(mode: LoginMode) {
  loginMode.value = mode
}

// 登录成功处理
function handleLoginSuccess() {
  isSuccess.value = true
}

// 注册成功处理
function handleRegisterSuccess() {
  switchMode('pwd')
}

// 从注册切换到登录
function handleSwitchToLogin() {
  switchMode('pwd')
}
</script>

<template>
  <div class="login">
    <div class="container" :class="{ success: isSuccess }">
      <NH1 class="text-unset">
        {{ loginMode === 'register' ? '用户注册' : 'Welcome' }}
      </NH1>

      <!-- 表单卡片容器 -->
      <div class="form-card" v-if="!isSuccess">
        <!-- 模式切换标签页 -->
        <div class="mode-tabs">
          <button type="button" class="mode-tab" :class="{ active: loginMode === 'pwd' }" @click="switchMode('pwd')">
            <i class="i-carbon-password"></i>
            <span>密码登录</span>
          </button>
          <button type="button" class="mode-tab" :class="{ active: loginMode === 'register' }" @click="switchMode('register')">
            <i class="i-carbon-user-plus"></i>
            <span>用户注册</span>
          </button>
        </div>

        <!-- 动态组件 -->
        <div class="form-container">
          <PwdLogin v-if="loginMode === 'pwd'" @login-success="handleLoginSuccess" />
          <UserRegister
            v-else-if="loginMode === 'register'"
            @register-success="handleRegisterSuccess"
            @switch-to-login="handleSwitchToLogin"
          />
        </div>
      </div>
    </div>

    <!-- 背景方块 -->
    <ul class="list-none fixed top-0 left-0 w-full h-full z-1">
      <li
        v-for="i in 10"
        :key="i"
        class="absolute bottom-[-160px] bg-white bg-opacity-15 bgBlock"
        :class="{
          'left-1/10': i === 1,
          'left-2/10 w-20 h-20 ': i === 2,
          'left-1/4': i === 3,
          'left-4/10 w-15 h-15 bg-opacity-25': i === 4,
          'left-7/10': i === 5,
          'left-8/10 w-30 h-30 bg-opacity-20': i === 6,
          'left-32/100 w-40 h-40': i === 7,
          'left-55/100 w-5 h-5': i === 8,
          'left-1/4 w-2.5 h-2.5 bg-opacity-30': i === 9,
          'left-9/10 w-40 h-40': i === 10,
        }"
      ></li>
    </ul>
  </div>
</template>

<style lang="scss" scoped>
.login {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(to top left, #ffe29f, #ffa99f, #ff719a);
  overflow: hidden;

  .container {
    text-align: center;
    color: #fff;

    & > h1 {
      font-size: 40px;
      font-weight: 100;
      letter-spacing: 2px;
      margin-bottom: 15px;
      /* 过渡效果 */
      transition: 1s ease-in-out;
    }

    .form-card {
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(10px);
      border-radius: 20px;
      border: 1px solid rgba(255, 255, 255, 0.2);
      padding: 0;
      margin: 20px auto;
      max-width: 400px;
      overflow: hidden;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
      position: relative;
      z-index: 2;
    }

    .mode-tabs {
      display: flex;
      background: rgba(255, 255, 255, 0.05);
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);

      .mode-tab {
        flex: 1;
        outline: none;
        background: transparent;
        color: rgba(255, 255, 255, 0.7);
        border: none;
        padding: 16px 12px;
        font-size: 13px;
        cursor: pointer;
        transition: all 0.3s ease;
        font-weight: 300;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 4px;
        position: relative;

        i {
          font-size: 18px;
          margin-bottom: 2px;
        }

        span {
          font-size: 12px;
        }

        &:hover {
          background: rgba(255, 255, 255, 0.1);
          color: rgba(255, 255, 255, 0.9);
        }

        &.active {
          background: rgba(255, 255, 255, 0.15);
          color: #fff;
          font-weight: 500;

          &::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            height: 2px;
            background: linear-gradient(90deg, #ff719a, #ffc371);
          }
        }
      }
    }

    .form-container {
      padding: 30px;
      position: relative;
      z-index: 2;
      opacity: 1;
      transition: opacity 0.5s;
    }

    &.success {
      h1 {
        transform: translateY(75px);
      }

      .form-card {
        opacity: 0;
        visibility: hidden;
        transform: translateY(20px);
      }
    }
  }

  .bgBlock {
    animation-name: square;
    animation-iteration-count: infinite;
    animation-timing-function: linear;

    @for $i from 1 through 10 {
      &:nth-child(#{$i}) {
        animation-duration: $i * 3s;
        animation-delay: if($i == 1, 0s, ($i - 1) * 3s);
      }
    }
  }

  @keyframes square {
    0% {
      transform: translateY(0);
    }
    100% {
      transform: translateY(-100vh) rotate(600deg);
    }
  }
}
</style>
