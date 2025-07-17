<template>
  <div class="card">
    <IframePage url="http://www.shixian.xyz"></IframePage>
  </div>
</template>

<script setup lang="ts" name="bing">
import IframePage from '@/views/_builtin/iframe-page/[url].vue'

definePage({
  meta: {
    title: 'XiaJi',
    isAuth: true,
    group: {
      enabled: 'route.link',
    },
  },
})
</script>

<style scoped lang="scss"></style>
