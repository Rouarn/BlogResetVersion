<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import ChatHeader from './components/chat-header.vue'
import Composer from './components/composer.vue'
import MessageList from './components/message-list.vue'
import RoomList from './components/room-list.vue'
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

const statusText = computed<string>(() =>
  connected.value ? $t('chat.statusConnected') : connecting.value ? $t('chat.statusConnecting') : $t('chat.statusDisconnected'),
)

const msgListRef = ref<{ scrollToBottom: () => void } | null>(null)

let typingTimer: number | null = null
const typing = ref<boolean>(false)

function scrollToBottom() {
  msgListRef.value?.scrollToBottom()
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
          <RoomList
            :rooms="rooms"
            :current-room-id="currentRoomId"
            :room-search="roomSearch"
            @update:room-search="(v) => (roomSearch = v)"
            @select="selectRoom"
            @create="
              (id) => {
                newRoom = id
                createOrJoinRoom()
              }
            "
          />
        </div>
        <div class="flex-1 flex flex-col min-h-0">
          <ChatHeader
            :connected="connected"
            :connecting="connecting"
            :current-room-display="currentRoomDisplay"
            :msg-search="msgSearch"
            :typing-users-text="typingUsersText"
            :status-text="statusText"
            @update:msg-search="(v) => (msgSearch = v)"
            @scroll-to-bottom="scrollToBottom"
            @clear-room="clearRoom"
          />
          <div class="flex-1 min-h-0">
            <MessageList ref="msgListRef" :grouped="grouped" :format-time="formatTime" @retry="retry" />
          </div>
          <Composer
            :model-value="input"
            :connected="connected"
            @update:model-value="(v) => (input = v)"
            @send="send"
            @typing-start="startTyping"
            @typing-stop="stopTyping"
          />
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
