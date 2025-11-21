<script setup lang="ts">
import { computed } from 'vue'
import SettingItem from '../components/setting-item.vue'
import { useThemeStore } from '@/stores/modules/theme'
import { $t } from '@/locales'

defineOptions({
  name: 'WatermarkSettings',
})

const themeStore = useThemeStore()

const isWatermarkTextVisible = computed(
  () => themeStore.watermark.visible && !themeStore.watermark.enableUserName && !themeStore.watermark.enableTime,
)

const watermarkTimeFormatOptions = [
  { label: 'YYYY-MM-DD HH:mm', value: 'YYYY-MM-DD HH:mm' },
  { label: 'YYYY-MM-DD HH:mm:ss', value: 'YYYY-MM-DD HH:mm:ss' },
  { label: 'YYYY/MM/DD HH:mm', value: 'YYYY/MM/DD HH:mm' },
  { label: 'YYYY/MM/DD HH:mm:ss', value: 'YYYY/MM/DD HH:mm:ss' },
  { label: 'HH:mm', value: 'HH:mm' },
  { label: 'HH:mm:ss', value: 'HH:mm:ss' },
  { label: 'MM-DD HH:mm', value: 'MM-DD HH:mm' },
]
</script>

<template>
  <NDivider>{{ $t('theme.watermark.title') }}</NDivider>
  <TransitionGroup tag="div" name="setting-list" class="flex-col-stretch gap-12px">
    <SettingItem key="1" :label="$t('theme.watermark.visible')">
      <NSwitch v-model:value="themeStore.watermark.visible" />
    </SettingItem>
    <SettingItem v-if="themeStore.watermark.visible" key="2" :label="$t('theme.watermark.enableUserName')">
      <NSwitch :value="themeStore.watermark.enableUserName" @update:value="themeStore.setWatermarkEnableUserName" />
    </SettingItem>
    <SettingItem v-if="themeStore.watermark.visible" key="3" :label="$t('theme.watermark.enableTime')">
      <NSwitch :value="themeStore.watermark.enableTime" @update:value="themeStore.setWatermarkEnableTime" />
    </SettingItem>
    <SettingItem v-if="themeStore.watermark.visible && themeStore.watermark.enableTime" key="4" :label="$t('theme.watermark.timeFormat')">
      <NSelect v-model:value="themeStore.watermark.timeFormat" :options="watermarkTimeFormatOptions" size="small" class="w-210px" />
    </SettingItem>
    <SettingItem v-if="isWatermarkTextVisible" key="5" :label="$t('theme.watermark.text')">
      <NInput v-model:value="themeStore.watermark.text" autosize type="text" size="small" class="w-120px" placeholder="SoybeanAdmin" />
    </SettingItem>
  </TransitionGroup>
</template>

<style scoped>
.setting-list-move,
.setting-list-enter-active,
.setting-list-leave-active {
  --uno: transition-all-300;
}

.setting-list-enter-from,
.setting-list-leave-to {
  --uno: opacity-0 -translate-x-30px;
}

.setting-list-leave-active {
  --uno: absolute;
}
</style>
