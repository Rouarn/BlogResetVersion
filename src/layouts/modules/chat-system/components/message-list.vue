<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import type { ChatMessage } from '@/service/socket/useChatSocket'
import { $t } from '@/locales'

defineOptions({ name: 'MessageList' })

const props = defineProps<{
  grouped: Array<{ t: 'date'; label: string } | { t: 'msg'; m: ChatMessage }>
  formatTime: (ts: number) => string
}>()

const emits = defineEmits<{
  (e: 'retry', id: string): void
}>()

const listRef = ref<HTMLElement | null>(null)

function scrollToBottom() {
  const el = listRef.value
  if (!el) return
  el.scrollTop = el.scrollHeight
}

defineExpose({ scrollToBottom })

const length = computed(() => props.grouped.length)

watch(length, () => {
  scrollToBottom()
})

onMounted(() => {
  scrollToBottom()
})
</script>

<template>
  <NScrollbar class="h-full">
    <div ref="listRef" class="px-3 py-3 space-y-3">
      <template v-for="item in props.grouped" :key="item.t === 'date' ? 'd-' + (item as any).label : 'm-' + (item as any).m.id">
        <div v-if="item.t === 'date'" class="flex items-center justify-center">
          <NTag type="default" size="small">{{ (item as any).label }}</NTag>
        </div>
        <div v-else class="flex items-end gap-2" :class="(item as any).m.self ? 'justify-end' : 'justify-start'">
          <div v-if="!(item as any).m.self" class="w-8 h-8 rounded-full bg-gray-300 text-12px flex items-center justify-center">
            {{ ((item as any).m.sender || $t('chat.other')).slice(0, 1) }}
          </div>
          <div
            class="max-w-80 px-3 py-2 rounded-2xl shadow-sm"
            :class="(item as any).m.self ? 'bg-[var(--primary-color)]/18' : 'bg-gray-100/60'"
          >
            <div class="flex items-center justify-between gap-3 mb-1">
              <div class="text-12px opacity-70">
                {{ (item as any).m.sender || ((item as any).m.self ? $t('chat.me') : $t('chat.other')) }}
              </div>
              <div class="text-12px opacity-60">{{ props.formatTime((item as any).m.ts) }}</div>
            </div>
            <div class="text-14px leading-6 whitespace-pre-wrap break-words">{{ (item as any).m.content }}</div>
            <div class="mt-1 flex items-center gap-2 justify-end text-12px">
              <template v-if="(item as any).m.status === 'sending'">
                <SvgIcon icon="ph:clock" />
                {{ $t('chat.statusSending') }}
              </template>
              <template v-else-if="(item as any).m.status === 'sent'">
                <SvgIcon icon="ph:check" />
                {{ $t('chat.statusSent') }}
              </template>
              <template v-else-if="(item as any).m.status === 'failed'">
                <SvgIcon icon="ph:warning" class="text-red-500" />
                {{ $t('chat.statusFailed') }}
                <NButton tertiary size="tiny" @click="emits('retry', (item as any).m.id)">{{ $t('chat.retry') }}</NButton>
              </template>
            </div>
          </div>
          <div v-if="(item as any).m.self" class="w-8 h-8 rounded-full bg-primary/30 text-12px flex items-center justify-center">
            {{ $t('chat.me') }}
          </div>
        </div>
      </template>
    </div>
  </NScrollbar>
</template>

<style scoped>
.max-w-80 {
  max-width: 80%;
}
</style>
