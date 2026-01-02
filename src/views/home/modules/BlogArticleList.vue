<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import SvgIcon from '@/components/custom/svg-icon.vue'
import { fetchArticleList } from '@/service/api/article'
import { useRouterPush } from '@/hooks/common/router'
import dayjs from 'dayjs'

defineOptions({
  name: 'BlogArticleList',
})

const route = useRoute()
const { routerPushByKey } = useRouterPush()
const articles = ref<Api.Article.Article[]>([])
const loading = ref(false)

const getArticles = async () => {
  loading.value = true
  try {
    const params: Api.Article.ArticleSearchParams = {
      current: 1,
      size: 10,
    }

    if (route.query.categoryId) {
      params.categoryId = Number(route.query.categoryId)
    }

    const { data } = await fetchArticleList(params)
    console.log('data: ', data)
    if (data?.records) {
      articles.value = data.records
    } else {
      articles.value = []
    }
  } catch (error) {
    console.error('Failed to fetch articles:', error)
  } finally {
    loading.value = false
  }
}

watch(
  () => route.query.categoryId,
  () => {
    getArticles()
  },
)

const openArticle = (id: number) => {
  routerPushByKey('article', { params: { id: String(id) } })
}

const formatDate = (date: string) => {
  if (!date) return ''
  return dayjs(date).format('YYYY-MM-DD')
}

onMounted(() => {
  getArticles()
})
</script>

<template>
  <section class="lg:w-2/3 animate-fade-in">
    <header class="mb-12">
      <h1 class="text-4xl font-bold text-slate-900 mb-4">记录思考的瞬间</h1>
      <p class="text-slate-500 max-w-lg">
        今天是 {{ dayjs().format('YYYY年MM月DD日') }}。这里是我分享关于技术、设计与生活哲学的地方，旨在寻找数字世界的宁静。
      </p>
    </header>
    <div v-if="loading" class="text-center py-10">
      <p>加载中...</p>
    </div>
    <div v-else class="space-y-16">
      <article v-for="article in articles" :key="article.id" class="group">
        <div class="flex items-center space-x-3 text-xs font-medium uppercase tracking-widest mb-3">
          <span :class="[article.category?.colorClass || 'text-indigo-500']">{{ article.category?.name }}</span>
          <span class="w-1 h-1 bg-slate-300 rounded-full"></span>
          <span class="text-slate-400">{{ formatDate(article.createdAt) }}</span>
        </div>
        <h2
          class="text-2xl font-bold mb-4 group-hover:text-indigo-600 transition-colors cursor-pointer leading-tight"
          @click="openArticle(article.id)"
        >
          {{ article.title }}
        </h2>
        <p class="text-slate-600 mb-6 line-clamp-3">
          {{ article.summary }}
        </p>
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-3">
            <div class="w-8 h-8 rounded-full bg-slate-200 overflow-hidden">
              <NAvatar :src="article.author?.avatar ?? 'https://picsum.photos/200/200'" :lazy="true" object-fit="cover" round />
            </div>
            <span class="text-sm font-medium text-slate-700">{{ article.author?.nickname || 'Unknown' }}</span>
          </div>
          <NA
            href="javascript:;"
            class="flex items-center text-sm font-semibold text-indigo-600 hover:translate-x-1 transition-transform"
            @click="openArticle(article.id)"
          >
            阅读全文 <SvgIcon icon="ph:arrow-right-bold" class="ml-1" />
          </NA>
        </div>
      </article>
      <div v-if="articles.length === 0" class="text-center py-10 text-slate-400">暂无文章</div>
    </div>
    <button
      class="mt-20 w-full py-4 border-2 border-dashed border-slate-200 rounded-xl text-slate-400 font-medium hover:border-indigo-300 hover:text-indigo-500 transition-all"
      @click="routerPushByKey('archive')"
    >
      加载更多历史文章
    </button>
  </section>
</template>
