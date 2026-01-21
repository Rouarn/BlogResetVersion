<script lang="ts" setup>
import SearchModal from './components/search-modal.vue'
import useBoolean from '@/hooks/state/use-boolean'
import { $t } from '@/locales'

defineOptions({ name: 'GlobalSearch' })

const { bool: show, toggle } = useBoolean()
</script>

<template>
  <ButtonIcon :tooltip-content="$t('common.search')" @click="toggle">
    <icon-uil-search />
  </ButtonIcon>
  <SearchModal v-model:show="show" />
</template>

<style lang="scss" scoped></style>
