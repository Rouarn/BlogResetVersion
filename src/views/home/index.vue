<route lang="json5">
{
  meta: {
    layout: 'base-layout',
    title: '首页',
    i18nKey: 'route.home',
    order: 0,
    icon: 'material-symbols:home-app-logo',
  },
}
</route>

<script setup lang="ts">
import welcome from '@/assets/images/welcome.png'
</script>

<template>
  <NSpace justify="center" align="center" class="bg-layout">
    <NImage :src="welcome" preview-disabled class="max-w-[1200px] mx-auto" />
  </NSpace>
</template>
