<script setup lang="ts">
import { NSpace, NText } from 'naive-ui'

const currentYear = new Date().getFullYear()
</script>

<template>
  <footer class="w-full bg-white dark:bg-#18181c border-t border-gray-200 dark:border-gray-700 py-6">
    <div class="max-w-screen-md mx-auto px-4 text-center">
      <NSpace vertical size="small">
        <NText depth="3" class="text-sm"> © {{ currentYear }} 您的公司名称. 保留所有权利 </NText>

        <NSpace justify="center" size="medium">
          <NText tag="a" href="#" depth="3" class="text-sm hover:text-primary cursor-pointer"> 隐私政策 </NText>
          <NText tag="a" href="#" depth="3" class="text-sm hover:text-primary cursor-pointer"> 服务条款 </NText>
          <NText tag="a" href="#" depth="3" class="text-sm hover:text-primary cursor-pointer"> 联系我们 </NText>
        </NSpace>
      </NSpace>
    </div>
  </footer>
</template>

<style lang="scss" scoped>
footer {
  transition:
    background-color 0.3s,
    border-color 0.3s;
}
</style>
