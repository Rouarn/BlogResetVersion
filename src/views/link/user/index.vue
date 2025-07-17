<script setup lang="ts">
defineOptions({
  name: 'UserCenter',
})
definePage({
  meta: {
    title: 'User Center',
    i18nKey: 'common.userCenter',
    group: {
      enabled: 'common.backToHome',
    },
  },
})
</script>

<template>
  <LookForward />
</template>

<style scoped></style>
