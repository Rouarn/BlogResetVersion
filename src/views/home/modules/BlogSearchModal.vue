<script setup lang="ts">
import { computed, ref } from 'vue'
import SearchFooter from '@/layouts/modules/global-search/components/search-footer.vue'
import { fetchArticleList } from '@/service/api/article'
import { useAppStore } from '@/stores/modules/app'
import { useThemeStore } from '@/stores/modules/theme'
import { useRouterPush } from '@/hooks/common/router'
import { onKeyStroke, useDebounceFn } from '@vueuse/core'

defineOptions({ name: 'BlogSearchModal' })

const visible = defineModel<boolean>('show', { required: true })

const { routerPushByKey } = useRouterPush()
const appStore = useAppStore()
const theme = useThemeStore()

const isMobile = computed(() => appStore.isMobile)
const keyword = ref('')
const activeIndex = ref(0)
const results = ref<Api.Article.Article[]>([])
const loading = ref(false)

const handleClose = () => {
  visible.value = false
  // Delay clearing to avoid flickering during transition
  setTimeout(() => {
    keyword.value = ''
    results.value = []
    activeIndex.value = 0
  }, 200)
}

const searchArticles = async () => {
  if (!keyword.value.trim()) {
    results.value = []
    return
  }

  loading.value = true
  activeIndex.value = 0

  try {
    const { data } = await fetchArticleList({
      current: 1,
      size: 20,
      keyword: keyword.value.trim(),
    })
    if (data?.records) {
      results.value = data.records
    } else {
      results.value = []
    }
  } catch (error) {
    console.error('Failed to search articles:', error)
    results.value = []
  } finally {
    loading.value = false
  }
}

const handleSearch = useDebounceFn(searchArticles, 300)

const navigateToArticle = (articleId: number) => {
  handleClose()
  routerPushByKey('article', { params: { id: String(articleId) } })
}

// Keyboard navigation
const handleUp = () => {
  if (results.value.length === 0) return
  activeIndex.value = activeIndex.value <= 0 ? results.value.length - 1 : activeIndex.value - 1
}

const handleDown = () => {
  if (results.value.length === 0) return
  activeIndex.value = activeIndex.value >= results.value.length - 1 ? 0 : activeIndex.value + 1
}

const handleEnter = () => {
  if (results.value.length === 0) return
  const article = results.value[activeIndex.value]
  if (article) {
    navigateToArticle(article.id)
  }
}

// Register shortcuts
onKeyStroke('Escape', handleClose)
onKeyStroke('Enter', handleEnter)
onKeyStroke('ArrowUp', handleUp)
onKeyStroke('ArrowDown', handleDown)
</script>

<template>
  <NModal
    v-model:show="visible"
    :segmented="{ footer: 'soft' }"
    :closable="false"
    preset="card"
    auto-focus
    footer-style="padding: 0; margin: 0"
    class="fixed left-0 right-0"
    :class="[isMobile ? 'size-full top-0px rounded-0' : 'w-630px top-50px']"
    @after-leave="handleClose"
  >
    <NInputGroup>
      <NInput v-model:value="keyword" clearable placeholder="搜索文章..." @input="handleSearch">
        <template #prefix>
          <icon-uil-search class="text-15px text-[#c2c2c2]" />
        </template>
      </NInput>
      <NButton v-if="isMobile" type="primary" ghost @click="handleClose">取消</NButton>
    </NInputGroup>

    <div class="mt-20px">
      <NEmpty v-if="results.length === 0" description="未找到相关文章" />
      <NScrollbar v-else class="max-h-[60vh]">
        <div class="pb-12px">
          <div
            v-for="(article, index) in results"
            :key="article.id"
            class="mt-8px h-56px flex-y-center cursor-pointer justify-between rounded-4px bg-[#e5e7eb] px-14px dark:bg-dark"
            :style="{
              background: activeIndex === index ? theme.themeColor : '',
              color: activeIndex === index ? '#fff' : '',
            }"
            @click="navigateToArticle(article.id)"
            @mouseenter="activeIndex = index"
          >
            <div class="flex-1 flex flex-col overflow-hidden">
              <span class="truncate font-medium">
                {{ article.title }}
              </span>
              <span class="truncate text-xs opacity-70" :class="activeIndex === index ? 'text-white' : 'text-slate-500'">
                {{ article.summary }}
              </span>
            </div>
            <icon-ant-design-enter-outlined class="icon mr-3px p-2px text-20px" />
          </div>
        </div>
      </NScrollbar>
    </div>

    <template #footer>
      <SearchFooter v-if="!isMobile" />
    </template>
  </NModal>
</template>

<style scoped></style>
