<route lang="json5">
{
  meta: {
    title: 'GitHub',
    group: {
      enabled: true,
      title: '链接',
      icon: 'material-symbols-light:attach-file',
      i18nKey: 'route.link',
      order: 1,
    },
  },
}
</route>

<template>
  <div class="card">
    <span class="text">
      GitHub 仓库：
      <a href="https://github.com/Rouarn/frontend-template" target="_blank">https://github.com/Rouarn/frontend-template</a> 🍒🍉🍊
    </span>
  </div>
</template>

<script setup lang="ts" name="github"></script>

<style scoped lang="scss"></style>
