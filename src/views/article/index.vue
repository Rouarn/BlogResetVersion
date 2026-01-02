<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import ArticleShare from './modules/ArticleShare.vue'
import MarkdownViewer from '@/components/common/markdown-viewer.vue'
import SvgIcon from '@/components/custom/svg-icon.vue'
import { fetchArticleDetail, likeArticle } from '@/service/api/article'
import { useRouterPush } from '@/hooks/common/router'
import dayjs from 'dayjs'

defineOptions({
  name: 'ArticleDetail',
})

const route = useRoute()
const { routerBack, routerPushByKey } = useRouterPush()

const articleId = computed(() => (route.params as { id: string }).id)
const article = ref<Api.Article.Article | null>(null)
const loading = ref(false)

const getArticle = async () => {
  if (!articleId.value) return
  loading.value = true
  try {
    const { data } = await fetchArticleDetail(articleId.value)
    if (data) {
      article.value = data
    } else {
      article.value = null
    }
  } catch (error) {
    console.error('Failed to fetch article:', error)
    article.value = null
  } finally {
    loading.value = false
  }
}

// 分享弹窗
const showShareModal = ref(false)

const handleShare = () => {
  showShareModal.value = true
}

const handleLike = async () => {
  if (!article.value) return
  try {
    const { data } = await likeArticle(article.value.id)
    if (typeof data === 'number') {
      article.value.likes = data
    }
  } catch (error) {
    console.error('Failed to like article:', error)
  }
}

const navigateTo = (id: number) => {
  routerPushByKey('article', { params: { id: String(id) } })
}

const goBack = () => {
  routerBack()
}

const formatDate = (date: string) => {
  if (!date) return ''
  return dayjs(date).format('YYYY-MM-DD')
}

watch(
  () => articleId.value,
  () => {
    getArticle()
  },
)

onMounted(() => {
  getArticle()
})
</script>

<template>
  <div class="bg-white min-h-screen relative">
    <button
      class="fixed top-24 left-4 md:left-8 p-3 bg-white shadow-xl border border-slate-100 rounded-full hover:scale-110 transition-transform z-40 md:top-24"
      @click="goBack"
    >
      <SvgIcon icon="ph:arrow-left" class="text-2xl" />
    </button>

    <div v-if="loading" class="flex flex-col items-center justify-center min-h-[50vh]">
      <p class="text-slate-500">加载中...</p>
    </div>

    <div v-else-if="article" class="max-w-3xl mx-auto px-6 py-12 animate-fade-in">
      <article>
        <header class="mb-12">
          <div class="flex items-center space-x-4 mb-6">
            <span class="px-3 py-1 bg-indigo-50 text-indigo-600 text-xs font-bold rounded-full">
              {{ article.category?.name || '未分类' }}
            </span>
            <span class="text-slate-400 text-sm">发表于 {{ formatDate(article.createdAt) }}</span>
            <span class="text-slate-300 mx-2"></span>
            <span class="text-slate-400 text-sm flex items-center"> <SvgIcon icon="ph:eye" class="mr-1" /> {{ article.views }} 阅读 </span>
          </div>
          <h1 class="text-3xl md:text-5xl font-bold leading-tight mb-8">{{ article.title }}</h1>
          <div v-if="article.cover" class="aspect-video rounded-3xl overflow-hidden bg-slate-100">
            <img :src="article.cover" :alt="article.title" class="w-full h-full object-cover" />
          </div>
        </header>
        <section class="max-w-none text-slate-700 space-y-6">
          <MarkdownViewer :content="article.content" />
        </section>
        <footer class="mt-20 pt-12 border-t border-slate-100">
          <div class="flex items-center justify-between mb-12">
            <div class="flex items-center space-x-4">
              <button
                class="flex items-center space-x-2 px-6 py-2 bg-slate-900 text-white rounded-full hover:bg-slate-800 transition-all active:scale-95"
                @click="handleLike"
              >
                <SvgIcon icon="ph:heart-bold" />
                <span>赞 ({{ article.likes || 0 }})</span>
              </button>
              <button
                class="p-2 border border-slate-200 rounded-full text-slate-400 hover:text-slate-900 transition-colors"
                @click="handleShare"
              >
                <SvgIcon icon="ph:share-network-bold" class="text-xl" />
              </button>
            </div>
          </div>

          <nav class="grid grid-cols-2 pt-8 border-t border-slate-100">
            <div v-if="article.prev?.id" class="group cursor-pointer text-left" @click="navigateTo(article.prev.id)">
              <div class="text-xs text-slate-400 mb-1 group-hover:text-indigo-600 transition-colors">上一篇</div>
              <div class="text-sm font-bold text-slate-800 truncate group-hover:text-indigo-600 transition-colors">
                {{ article.prev.title }}
              </div>
            </div>
            <div v-else></div>

            <div v-if="article.next?.id" class="group cursor-pointer text-right" @click="navigateTo(article.next.id)">
              <div class="text-xs text-slate-400 mb-1 group-hover:text-indigo-600 transition-colors">下一篇</div>
              <div class="text-sm font-bold text-slate-800 truncate group-hover:text-indigo-600 transition-colors">
                {{ article.next.title }}
              </div>
            </div>
          </nav>
        </footer>
      </article>
    </div>
    <div v-else class="flex flex-col items-center justify-center min-h-[50vh]">
      <h2 class="text-2xl font-bold text-slate-900 mb-4">未找到文章</h2>
      <p class="text-slate-500 mb-8">抱歉，您访问的文章不存在或已被删除。</p>
      <button class="px-6 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors" @click="goBack">
        返回首页
      </button>
    </div>

    <ArticleShare v-if="article" v-model:show="showShareModal" :article="article" />
  </div>
</template>

<style scoped>
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.animate-fade-in {
  animation: fadeIn 0.6s ease-out forwards;
}
</style>
