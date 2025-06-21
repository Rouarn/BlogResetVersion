<script lang="ts" setup>
import { useThemeStore } from '@/store/modules/theme';
import SettingItem from '../components/setting-item.vue';

const themeStore = useThemeStore();
</script>

<template>
  <NDivider>背景设置</NDivider>
  <SettingItem label="视频背景">
    <NSwitch v-model:value="themeStore.background.showVideo" />
  </SettingItem>
</template>

<style lang="scss" scoped>
//
</style>
