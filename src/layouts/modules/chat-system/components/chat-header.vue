<script setup lang="ts">
import { $t } from '@/locales'

defineOptions({ name: 'ChatHeader' })

const props = defineProps<{
  connected: boolean
  connecting: boolean
  currentRoomDisplay: string
  msgSearch: string
  typingUsersText: string
}>()

const emits = defineEmits<{
  (e: 'update:msgSearch', v: string): void
  (e: 'scrollToBottom'): void
  (e: 'clearRoom'): void
}>()
</script>

<template>
  <div class="px-3 py-2 flex items-center justify-between border-b border-gray-200/40">
    <div class="flex items-center gap-2">
      <span
        class="inline-block w-8px h-8px rounded-full"
        :class="props.connected ? 'bg-green-500' : props.connecting ? 'bg-yellow-500' : 'bg-red-500'"
      />
      <NTag size="small" type="info">{{ props.currentRoomDisplay }}</NTag>
    </div>
    <div class="flex items-center gap-2">
      <NInput
        :value="props.msgSearch"
        size="small"
        :placeholder="$t('chat.searchMessages')"
        class="w-40"
        @update:value="(v) => emits('update:msgSearch', v as string)"
      />
      <NTag v-if="props.typingUsersText" size="small" type="success">{{ props.typingUsersText }}</NTag>
      <ButtonIcon icon="ph:arrow-down" :tooltip-content="$t('chat.scrollToBottom')" @click="emits('scrollToBottom')" />
      <ButtonIcon icon="ph:trash" :tooltip-content="$t('chat.clearRoom')" @click="emits('clearRoom')" />
    </div>
  </div>
</template>

<style scoped></style>
