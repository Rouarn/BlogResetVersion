<script setup lang="ts">
import { useAuthStore } from '@/stores/modules/auth'

defineOptions({
  name: 'GlobalLogin',
})

const authStore = useAuthStore()

const userName = ref('admin')
const password = ref('123456')
const isSuccess = ref(false)

async function handleLogin() {
  if (isSuccess.value) {
    return
  }
  userName.value = userName.value.trim()
  password.value = password.value.trim()
  if (!userName.value || !password.value) {
    window.$message?.error('请输入用户名和密码')
    return
  }
  await authStore.login('admin', '123456')
  isSuccess.value = authStore.isLogin
}
</script>

<template>
  <div class="login">
    <div class="container" :class="{ success: isSuccess }">
      <NH1 class="text-unset">Welcome</NH1>
      <form class="form" @submit.prevent="handleLogin">
        <input type="text" placeholder="您的账号" v-model="userName" autofocus />
        <input type="password" placeholder="您的密码" v-model="password" />
        <button class="btn-login" type="submit">登录</button>
      </form>
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

    .form {
      display: flex;
      flex-direction: column;
      align-items: center;
      position: relative;
      z-index: 2;
      opacity: 1;
      /* 不透明度改变时的过渡效果 */
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

        &:hover {
          background-color: rgba(255, 255, 255, 0.4);
        }

        &:focus {
          background-color: #fff;
          width: 300px;
          color: #ff719a;
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

        &:hover {
          background-color: #f5f7f9;
        }
      }
    }

    &.success {
      h1 {
        transform: translateY(75px);
      }

      .form {
        opacity: 0;
        visibility: hidden;
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
