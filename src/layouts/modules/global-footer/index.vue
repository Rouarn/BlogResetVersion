<script setup lang="ts">
import { NSpace, NText } from 'naive-ui'

const currentYear = new Date().getFullYear()
</script>

<template>
  <footer class="w-full bg-white dark:bg-#18181c border-t border-gray-200 dark:border-gray-700 py-6">
    <div class="max-w-screen-md mx-auto px-4 text-center">
      <NSpace vertical size="small">
        <NText depth="3" class="text-sm"> &copy; 2022 - {{ currentYear }} 刘亮 </NText>

        <NSpace justify="center" size="medium" align="center" class="flex-wrap">
          <NText tag="a" href="#" depth="3" class="text-sm hover:text-primary cursor-pointer"> 版权声明 </NText>
          <NText tag="a" href="https://beian.miit.gov.cn/" target="_blank" depth="3" class="text-sm hover:text-primary cursor-pointer">
            豫ICP备2024084155号-3
          </NText>
          <NText
            tag="a"
            href="https://beian.mps.gov.cn/#/query/webSearch?code=41172102000259"
            target="_blank"
            depth="3"
            class="flex items-center gap-1 text-sm hover:text-primary cursor-pointer"
          >
            <img src="/beian.png" alt="" class="w-4 h-4" />
            <span>豫公网安备41172102000259号</span>
          </NText>
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
