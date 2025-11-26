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
    <div ref="listRef" class="px-3 py-3 space-y-6">
      <template v-for="item in props.grouped" :key="item.t === 'date' ? 'd-' + (item as any).label : 'm-' + (item as any).m.id">
        <div v-if="item.t === 'date'" class="text-center">
          <span class="date-chip">{{ (item as any).label }}</span>
        </div>
        <div v-else class="flex" :class="(item as any).m.self ? 'justify-end' : 'justify-start'">
          <div class="bubble" :class="(item as any).m.self ? 'bubble-self' : 'bubble-other'">
            <div class="bubble-content">{{ (item as any).m.content }}</div>
            <div class="bubble-footer" :class="(item as any).m.self ? 'bubble-footer-self' : 'bubble-footer-other'">
              <span class="name">{{ (item as any).m.sender || ((item as any).m.self ? $t('chat.me') : $t('chat.other')) }}</span>
              <span class="dot">·</span>
              <span class="time">{{ props.formatTime((item as any).m.ts) }}</span>
              <span class="status" v-if="(item as any).m.status === 'sending'">
                <SvgIcon icon="ph:clock" /> {{ $t('chat.statusSending') }}
              </span>
              <span class="status" v-else-if="(item as any).m.status === 'sent'">
                <SvgIcon icon="ph:check" /> {{ $t('chat.statusSent') }}
              </span>
              <span class="status error" v-else-if="(item as any).m.status === 'failed'">
                <SvgIcon icon="ph:warning" /> {{ $t('chat.statusFailed') }}
                <NButton tertiary size="tiny" class="ml-2" @click="emits('retry', (item as any).m.id)">{{ $t('chat.retry') }}</NButton>
              </span>
            </div>
          </div>
        </div>
      </template>
    </div>
  </NScrollbar>
</template>

<style lang="scss" scoped>
.bubble {
  max-width: 70%;
  padding: 10px 12px;
  border-radius: 16px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
}
.bubble-self {
  background: rgba(0, 150, 136, 0.14);
}
.bubble-other {
  background: rgba(250, 250, 250, 0.92);
  border: 1px solid rgba(0, 0, 0, 0.06);
}
.bubble-content {
  font-size: 14px;
  line-height: 1.7;
  white-space: pre-wrap;
  word-break: break-word;
}
.bubble-footer {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 6px;
  font-size: 12px;
  opacity: 0.7;
}
.bubble-footer-self {
  justify-content: flex-end;
}
.bubble-footer-other {
  justify-content: flex-start;
}
.status {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}
.status.error {
  color: #e5484d;
}
.date-chip {
  font-size: 12px;
  padding: 3px 10px;
  border-radius: 999px;
  background: rgba(0, 0, 0, 0.06);
}
</style>
