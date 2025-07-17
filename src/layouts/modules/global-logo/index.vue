<script setup lang="ts">
import { useThemeStore } from '@/stores/modules/theme'
import { $t } from '@/locales'

defineOptions({
  name: 'GlobalLogo',
})

interface Props {
  /** Whether to show the title */
  showTitle?: boolean
}

withDefaults(defineProps<Props>(), {
  showTitle: true,
})

const themeStore = useThemeStore()

const inverted = computed(() => themeStore.themeScheme === 'dark')
</script>

<template>
  <RouterLink to="/" class="flex-center nowrap-hidden">
    <SystemLogo class="text-32px text-primary" />
    <h2
      v-show="showTitle"
      class="pl-8px text-16px text-primary font-bold transition duration-300 ease-in-out"
      :class="[inverted ? 'invert' : '']"
    >
      {{ $t('system.title') }}
    </h2>
  </RouterLink>
</template>

<style scoped></style>
