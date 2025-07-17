<script setup lang="ts">
defineOptions({
  name: 'UserCenter',
})
definePage({
  meta: {
    title: '用户',
    i18key: 'common.userCenter',
    group: {
      enabled: true,
      i18nKey: 'common.backToHome',
      parent: '文档',
    },
  },
})
</script>

<template>
  <LookForward />
</template>

<style scoped></style>
