<script setup lang="ts">
import { computed, ref } from 'vue'
import { $t } from '@/locales'

defineOptions({ name: 'RoomList' })

const props = defineProps<{
  rooms: Array<{ id: string; name: string; userCount: number; unreadCount: number }>
  currentRoomId: string
  roomSearch: string
}>()

const emits = defineEmits<{
  (e: 'update:roomSearch', v: string): void
  (e: 'select', id: string): void
  (e: 'create', id: string): void
}>()

const search = computed({
  get: () => props.roomSearch,
  set: (v: string) => emits('update:roomSearch', v),
})

const newRoom = ref('')

function createOrJoin() {
  const id = newRoom.value.trim()
  if (!id) return
  emits('create', id)
  newRoom.value = ''
}
</script>

<template>
  <div class="w-56 border-r border-gray-200/40 flex flex-col">
    <div class="p-2">
      <NInput v-model:value="search" :placeholder="$t('chat.filterRooms')" size="small" />
    </div>
    <div class="h-[calc(100vh-120px)]">
      <NScrollbar class="flex-1 min-h-0">
        <div class="py-1">
          <div
            v-for="r in rooms"
            :key="r.id"
            class="px-3 py-2 cursor-pointer flex items-center justify-between hover:bg-gray-100/40"
            :class="r.id === currentRoomId ? 'bg-gray-100/30' : ''"
            @click="emits('select', r.id)"
          >
            <div class="text-14px truncate max-w-32">{{ r.name || r.id }}</div>
            <div class="flex items-center gap-2">
              <NBadge :value="r.unreadCount" :max="99" v-if="r.unreadCount > 0" />
              <NTag size="small" type="info">{{ r.userCount }}</NTag>
            </div>
          </div>
        </div>
      </NScrollbar>
    </div>
    <div class="p-2 border-t border-gray-200/40 flex items-center gap-2">
      <NInput v-model:value="newRoom" size="small" :placeholder="$t('chat.joinOrCreate')" @keyup.enter="createOrJoin" />
      <NButton size="small" type="primary" @click="createOrJoin">{{ $t('chat.join') }}</NButton>
    </div>
  </div>
</template>

<style scoped></style>
