<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import { useChatSocket } from '@/service/socket'
import { useAppStore } from '@/stores/modules/app'
import { $t } from '@/locales'
import { setDayjsLocale } from '@/locales/dayjs'
import dayjs from 'dayjs'

defineOptions({ name: 'ChatSystem' })

const appStore = useAppStore()
const show = ref<boolean>(false)
const input = ref<string>('')
const msgSearch = ref<string>('')
const roomSearch = ref<string>('')
const defaultRoomId = 'global'
const defaultRoomLabel = computed<string>(() => $t('chat.room'))

const chat = useChatSocket({ autoConnect: true })

const connected = computed<boolean>(() => chat.state.value.isConnected)
const connecting = computed<boolean>(() => chat.state.value.isConnecting)
const unread = computed<number>(() => chat.unreadMessagesCount.value)
const currentRoomId = computed<string>(() => chat.currentRoom.value || defaultRoomId)
const currentRoomDisplay = computed<string>(() => {
  const id = currentRoomId.value
  const room = chat.getRoomList().find((r) => r.id === id)
  if (room?.name) return room.name
  if (id === defaultRoomId) return defaultRoomLabel.value
  return id
})
const rooms = computed(() => chat.getRoomList().filter((r) => r.id.toLowerCase().includes(roomSearch.value.toLowerCase())))
const msgsRaw = chat.currentRoomMessages
const filteredMsgs = computed(() => {
  const q = msgSearch.value.trim().toLowerCase()
  if (!q) return msgsRaw.value
  return msgsRaw.value.filter((m) => m.content.toLowerCase().includes(q))
})
const typingUsersText = computed<string>(() => {
  const set = chat.typingUsers.value.get(currentRoomId.value) || new Set<string>()
  const arr = Array.from(set)
  if (arr.length === 0) return ''
  if (arr.length === 1) return `${arr[0]} ${$t('chat.typing')}`
  return `${arr.slice(0, 2).join('、')}${arr.length > 2 ? ' ' + $t('chat.typingMany') : ''}`
})

const listRef = ref<HTMLElement | null>(null)

let typingTimer: number | null = null
const typing = ref<boolean>(false)

function scrollToBottom() {
  const el = listRef.value
  if (!el) return
  el.scrollTop = el.scrollHeight
}

async function ensureJoined(room: string) {
  try {
    if (!chat.joinedRooms.value.includes(room)) await chat.joinRoom(room)
  } catch (err) {
    console.warn('join room failed', err)
  }
}

function stopTyping() {
  if (!typing.value) return
  typing.value = false
  chat.sendTypingStatus(currentRoomId.value, false)
}

function open() {
  show.value = true
  ensureJoined(currentRoomId.value)
  chat.setCurrentRoom(currentRoomId.value)
  nextTick(scrollToBottom)
}

function formatTime(ts: number) {
  return dayjs(ts).format('L HH:mm')
}

function formatDate(ts: number) {
  const d = dayjs(ts)
  const today = dayjs()
  const yest = dayjs().subtract(1, 'day')
  if (d.startOf('day').valueOf() === today.startOf('day').valueOf()) return $t('chat.today')
  if (d.startOf('day').valueOf() === yest.startOf('day').valueOf()) return $t('chat.yesterday')
  return d.format('L')
}

const grouped = computed(() => {
  const out: Array<{ t: 'date'; label: string } | { t: 'msg'; m: (typeof msgsRaw.value)[number] }> = []
  let lastLabel = ''
  filteredMsgs.value.forEach((m) => {
    const label = formatDate(m.ts)
    if (label !== lastLabel) {
      out.push({ t: 'date', label })
      lastLabel = label
    }
    out.push({ t: 'msg', m })
  })
  return out
})

watch(
  () => filteredMsgs.value.length,
  async () => {
    await nextTick()
    scrollToBottom()
  },
)

function startTyping() {
  if (!connected.value) return
  if (!typing.value) {
    typing.value = true
    chat.sendTypingStatus(currentRoomId.value, true)
  }
  if (typingTimer) window.clearTimeout(typingTimer)
  typingTimer = window.setTimeout(stopTyping, 1500)
}

onMounted(async () => {
  try {
    setDayjsLocale(appStore.locale)
    await chat.connect()
    await ensureJoined(defaultRoomId)
    chat.setCurrentRoom(defaultRoomId)
  } catch (err) {
    console.warn('chat init failed', err)
  }
})

watch(
  () => appStore.locale,
  (lang) => setDayjsLocale(lang),
)

async function send() {
  const v = input.value.trim()
  if (!v) return
  try {
    await chat.sendMessage(currentRoomId.value, v)
    input.value = ''
    stopTyping()
  } catch (err) {
    console.warn('send failed', err)
  }
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault()
    send()
  } else {
    startTyping()
  }
}

function retry(id: string) {
  chat.retryMessage(id)
}

function clearRoom() {
  chat.clearRoomMessages(currentRoomId.value)
}

async function selectRoom(id: string) {
  await ensureJoined(id)
  chat.setCurrentRoom(id)
}

const newRoom = ref<string>('')
async function createOrJoinRoom() {
  const id = newRoom.value.trim()
  if (!id) return
  await ensureJoined(id)
  chat.setCurrentRoom(id)
  newRoom.value = ''
}
</script>

<template>
  <NBadge :value="unread" :max="99">
    <ButtonIcon icon="ph:chat-circle" :tooltip-content="$t('chat.title')" @click="open" />
  </NBadge>
  <NDrawer v-model:show="show" width="720" placement="right">
    <NDrawerContent :body-content-style="{ padding: 0 }">
      <div class="h-full flex">
        <div class="w-56 border-r border-gray-200/40 flex flex-col">
          <div class="p-2">
            <NInput v-model:value="roomSearch" :placeholder="$t('chat.filterRooms')" size="small" />
          </div>
          <NScrollbar class="flex-1 min-h-0">
            <div class="py-1">
              <div
                v-for="r in rooms"
                :key="r.id"
                class="px-3 py-2 cursor-pointer flex items-center justify-between hover:bg-gray-100/40"
                :class="r.id === currentRoomId ? 'bg-gray-100/30' : ''"
                @click="selectRoom(r.id)"
              >
                <div class="text-14px truncate max-w-32">{{ r.name || r.id }}</div>
                <div class="flex items-center gap-2">
                  <NBadge :value="r.unreadCount" :max="99" v-if="r.unreadCount > 0" />
                  <NTag size="small" type="info">{{ r.userCount }}</NTag>
                </div>
              </div>
            </div>
          </NScrollbar>
          <div class="p-2 border-t border-gray-200/40 flex items-center gap-2">
            <NInput v-model:value="newRoom" size="small" :placeholder="$t('chat.joinOrCreate')" @keyup.enter="createOrJoinRoom" />
            <NButton size="small" type="primary" @click="createOrJoinRoom">{{ $t('chat.join') }}</NButton>
          </div>
        </div>
        <div class="flex-1 flex flex-col min-h-0">
          <div class="px-3 py-2 flex items-center justify-between border-b border-gray-200/40">
            <div class="flex items中心 gap-2">
              <span
                class="inline-block w-8px h-8px rounded-full"
                :class="connected ? 'bg-green-500' : connecting ? 'bg-yellow-500' : 'bg-red-500'"
              />
              <NTag size="small" type="info">{{ currentRoomDisplay }}</NTag>
            </div>
            <div class="flex items-center gap-2">
              <NInput v-model:value="msgSearch" size="small" :placeholder="$t('chat.searchMessages')" class="w-40" />
              <NTag v-if="typingUsersText" size="small" type="success">{{ typingUsersText }}</NTag>
              <ButtonIcon icon="ph:arrow-down" :tooltip-content="$t('chat.scrollToBottom')" @click="scrollToBottom" />
              <ButtonIcon icon="ph:trash" :tooltip-content="$t('chat.clearRoom')" @click="clearRoom" />
            </div>
          </div>
          <div class="flex-1 min-h-0">
            <NScrollbar class="h-full">
              <div ref="listRef" class="px-3 py-3 space-y-3">
                <template v-for="item in grouped" :key="item.t === 'date' ? 'd-' + item.label : 'm-' + item.m.id">
                  <div v-if="item.t === 'date'" class="flex items-center justify-center">
                    <NTag type="default" size="small">{{ item.label }}</NTag>
                  </div>
                  <div v-else class="flex items-end gap-2" :class="item.m.self ? 'justify-end' : 'justify-start'">
                    <div v-if="!item.m.self" class="w-8 h-8 rounded-full bg-gray-300 text-12px flex items-center justify-center">
                      {{ (item.m.sender || $t('chat.other')).slice(0, 1) }}
                    </div>
                    <div
                      class="max-w-80 px-3 py-2 rounded-2xl shadow-sm"
                      :class="item.m.self ? 'bg-[var(--primary-color)]/18' : 'bg-gray-100/60'"
                    >
                      <div class="flex items-center justify-between gap-3 mb-1">
                        <div class="text-12px opacity-70">{{ item.m.sender || (item.m.self ? $t('chat.me') : $t('chat.other')) }}</div>
                        <div class="text-12px opacity-60">{{ formatTime(item.m.ts) }}</div>
                      </div>
                      <div class="text-14px leading-6 whitespace-pre-wrap break-words">{{ item.m.content }}</div>
                      <div class="mt-1 flex items-center gap-2 justify-end text-12px">
                        <template v-if="item.m.status === 'sending'">
                          <SvgIcon icon="ph:clock" />
                          {{ $t('chat.statusSending') }}
                        </template>
                        <template v-else-if="item.m.status === 'sent'">
                          <SvgIcon icon="ph:check" />
                          {{ $t('chat.statusSent') }}
                        </template>
                        <template v-else-if="item.m.status === 'failed'">
                          <SvgIcon icon="ph:warning" class="text-red-500" />
                          {{ $t('chat.statusFailed') }}
                          <NButton tertiary size="tiny" @click="retry(item.m.id)">{{ $t('chat.retry') }}</NButton>
                        </template>
                      </div>
                    </div>
                    <div v-if="item.m.self" class="w-8 h-8 rounded-full bg-primary/30 text-12px flex items-center justify-center">
                      {{ $t('chat.me') }}
                    </div>
                  </div>
                </template>
              </div>
            </NScrollbar>
          </div>
          <div class="px-3 py-2 border-t border-gray-200/40">
            <div class="flex items-end gap-2">
              <div class="flex-1">
                <NInput
                  v-model:value="input"
                  type="textarea"
                  :autosize="{ minRows: 1, maxRows: 6 }"
                  :placeholder="$t('chat.inputHint')"
                  @keydown="onKeydown"
                  @input="startTyping"
                  @blur="stopTyping"
                />
              </div>
              <NButton type="primary" :disabled="!connected" @click="send">
                <template #icon>
                  <SvgIcon icon="ph:paper-plane-right" />
                </template>
                {{ $t('chat.send') }}
              </NButton>
            </div>
            <div class="mt-1 flex items-center gap-2 text-12px opacity-70">
              <ButtonIcon icon="ph:smiley" :tooltip-content="$t('chat.emoji')" />
              <ButtonIcon icon="ph:paperclip" :tooltip-content="$t('chat.attachment')" />
              <span>
                {{ $t('chat.currentStatus') }}：{{
                  connected ? $t('chat.statusConnected') : connecting ? $t('chat.statusConnecting') : $t('chat.statusDisconnected')
                }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </NDrawerContent>
  </NDrawer>
</template>

<style scoped>
.max-w-80 {
  max-width: 80%;
}
</style>
