<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useChatSocket } from '@/service/socket'
import { $t } from '@/locales'
import dayjs from 'dayjs'

defineOptions({ name: 'NotificationCenter' })

const show = ref<boolean>(false)
const chat = useChatSocket({ autoConnect: true })

const count = computed<number>(() => chat.notifications.value.length)
const latestNotifications = computed(() => {
  const list = [...chat.notifications.value]
  list.sort((a, b) => b.ts - a.ts)
  return list.slice(0, 10)
})

onMounted(async () => {
  try {
    await chat.connect()
    await chat.joinRoom('notifications')
  } catch (err) {
    console.warn('notification init failed', err)
  }
})

function formatType(t: string) {
  if (t === 'join') return $t('notification.typeJoin')
  if (t === 'leave') return $t('notification.typeLeave')
  if (t === 'user_count') return $t('notification.typeUserCount')
  return t
}

function formatTime(ts: number) {
  return dayjs(ts).format('L HH:mm')
}
</script>

<template>
  <NPopover v-model:show="show" trigger="click" placement="bottom" :width="320">
    <template #trigger>
      <NBadge :value="count" :max="99">
        <ButtonIcon icon="ph:bell" :tooltip-content="$t('notification.title')" />
      </NBadge>
    </template>
    <div class="p-2">
      <div class="text-14px font-medium mb-2">{{ $t('notification.latest') }}</div>
      <div v-if="latestNotifications.length === 0" class="py-4 text-center text-12px opacity-70">{{ $t('notification.none') }}</div>
      <NScrollbar v-else class="max-h-60">
        <div v-for="n in latestNotifications" :key="n.id" class="py-1 px-2 hover:bg-gray-100/40 rounded">
          <div class="text-13px">{{ formatType(n.type) }} · {{ n.user || $t('notification.system') }}</div>
          <div class="text-12px opacity-70">{{ $t('notification.room') }}: {{ n.room }} · {{ formatTime(n.ts) }}</div>
        </div>
      </NScrollbar>
    </div>
  </NPopover>
</template>

<style scoped></style>
