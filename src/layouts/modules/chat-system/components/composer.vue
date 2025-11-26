<script setup lang="ts">
import { $t } from '@/locales'

const props = defineProps<{
  modelValue: string
  connected: boolean
}>()

const emits = defineEmits<{
  (e: 'update:modelValue', v: string): void
  (e: 'send'): void
  (e: 'typingStart'): void
  (e: 'typingStop'): void
}>()

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault()
    emits('send')
  } else {
    emits('typingStart')
  }
}

function onBlur() {
  emits('typingStop')
}
</script>

<template>
  <div class="px-3 py-2 border-t border-gray-200/40">
    <div class="flex items-end gap-2">
      <div class="flex-1">
        <NInput
          :value="props.modelValue"
          type="textarea"
          :autosize="{ minRows: 1, maxRows: 6 }"
          :placeholder="$t('chat.inputHint')"
          @update:value="(v) => emits('update:modelValue', v as string)"
          @keydown="onKeydown"
          @input="() => emits('typingStart')"
          @blur="onBlur"
        />
      </div>
      <NButton type="primary" :disabled="!props.connected" @click="emits('send')">
        <template #icon>
          <SvgIcon icon="ph:paper-plane-right" />
        </template>
        {{ $t('chat.send') }}
      </NButton>
    </div>
    <div class="mt-1 flex items-center gap-2 text-12px opacity-70">
      <ButtonIcon icon="ph:smiley" :tooltip-content="$t('chat.emoji')" />
      <ButtonIcon icon="ph:paperclip" :tooltip-content="$t('chat.attachment')" />
    </div>
  </div>
</template>

<style scoped></style>
