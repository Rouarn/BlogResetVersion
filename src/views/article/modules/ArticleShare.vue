<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import SvgIcon from '@/components/custom/svg-icon.vue'

defineOptions({ name: 'ArticleShare' })

interface Props {
  show: boolean
  article: Api.Article.Article
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'update:show', value: boolean): void
}>()

const visible = computed({
  get: () => props.show,
  set: (val) => emit('update:show', val),
})

const showWechatQR = ref(false)
const currentUrl = ref('')

const wechatQrUrl = computed(() => {
  return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(currentUrl.value)}`
})

watch(
  () => props.show,
  (val) => {
    if (val) {
      currentUrl.value = window.location.href
    }
  },
)

const shareConfig = [
  {
    icon: 'ri:qq-fill',
    color: '#12b7f5',
    label: 'QQ',
    action: () => {
      const shareUrl = `http://connect.qq.com/widget/shareqq/index.html?url=${encodeURIComponent(currentUrl.value)}&title=${encodeURIComponent(props.article?.title ?? '')}&source=${encodeURIComponent('Blog')}&desc=${encodeURIComponent(props.article?.summary ?? '')}&pics=${encodeURIComponent(props.article?.cover ?? '')}`
      window.open(shareUrl)
    },
  },
  {
    icon: 'ri:weibo-fill',
    color: '#e6162d',
    label: '微博',
    action: () => {
      const shareUrl = `http://service.weibo.com/share/share.php?url=${encodeURIComponent(currentUrl.value)}&title=${encodeURIComponent(props.article?.title ?? '')}&pic=${encodeURIComponent(props.article?.cover ?? '')}&searchPic=false`
      window.open(shareUrl)
    },
  },
  {
    icon: 'ri:wechat-fill',
    color: '#07c160',
    label: '微信',
    action: () => {
      showWechatQR.value = true
    },
  },
]
</script>

<template>
  <NModal v-model:show="visible" preset="card" title="分享到" class="w-96" size="small">
    <div class="grid grid-cols-3 gap-4 py-4">
      <button
        v-for="item in shareConfig"
        :key="item.label"
        class="flex flex-col items-center gap-2 group hover:bg-slate-50 p-2 rounded-xl transition-colors"
        @click="item.action"
      >
        <div
          class="w-12 h-12 rounded-full flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform"
          :style="{ backgroundColor: item.color }"
        >
          <SvgIcon :icon="item.icon" class="text-2xl" />
        </div>
        <span class="text-xs text-slate-600">{{ item.label }}</span>
      </button>
    </div>
  </NModal>

  <NModal v-model:show="showWechatQR" preset="card" title="微信扫一扫分享" class="w-80">
    <div class="flex flex-col items-center gap-4 py-4">
      <img :src="wechatQrUrl" alt="WeChat QR Code" class="w-48 h-48" />
      <p class="text-sm text-slate-500">打开微信，点击右上角"+"，选择"扫一扫"</p>
    </div>
  </NModal>
</template>
