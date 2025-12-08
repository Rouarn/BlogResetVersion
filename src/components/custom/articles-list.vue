<template>
  <div class="flex-col gap-24px">
    <div
      v-for="item in tableData"
      :key="item.id"
      class="card-wrapper bg-white dark:bg-gray-900 p-20px flex gap-20px"
      @click="handleClick(item.id)"
    >
      <NImage :src="item.cover" :alt="item.title" class="w-200px h-130px rd-10px object-cover" />
      <NFlex vertical class="flex-1">
        <div class="flex-1">
          <div class="text-18px font-600 mb-8px">{{ item.title }}</div>
          <div class="text-14px color-gray-600 dark:color-gray-300 mb-12px">
            {{ item.summary }}
          </div>
        </div>
        <div class="flex gap-8px text-12px color-gray-500">
          <span>{{ item.type }}</span>
          <span>·</span>
          <span>{{ item.timeAgo }}</span>
        </div>
      </NFlex>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouterPush } from '@/hooks/common/router'
defineOptions({
  name: 'ArticlesList',
})

const { routerPush } = useRouterPush()

interface Props {
  modelValue?: string
  modelType?: string
}
const _props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  modelType: 'All',
})

// type Event = {
//   (e: 'update:modelValue'): void
// }
// const emit = defineEmits<Event>()

interface ArticleItem {
  id: number
  title: string
  summary: string
  cover: string
  type: string
  timeAgo: string
}

const tableData = ref<ArticleItem[]>([])

const getTableData = async () => {
  tableData.value = [
    {
      id: 1,
      title: '如何快速创建一个轻量美观的导航站?',
      summary:
        '在现在信息过载的数字化时代，信息碎片化问题越来越严重，拥有一个经过严格筛查的高质量网址导航页，已经成为许多人的需求。一个轻量、美观的导航页可以大大提升工作效率和用户体验。',
      cover: 'https://images.unsplash.com/photo-1542626991-cbc4e32524cc?q=80&w=1080&auto=format&fit=crop',
      type: '文章',
      timeAgo: '7月前',
    },
    {
      id: 2,
      title: '2025年独立完成的第一个项目',
      summary:
        '近年以来，一直在使用自己搭建的个人网址导航主页。我把导航页作为常用浏览器的主页，几乎每天都在使用。对于个人来说，感觉还是很方便的。',
      cover: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1080&auto=format&fit=crop',
      type: '文章',
      timeAgo: '8月前',
    },
  ]
}

const handleClick = (id: number) => {
  routerPush({ path: `/article/${id}` })
}

onMounted(() => {
  getTableData()
})
</script>

<style scoped></style>
