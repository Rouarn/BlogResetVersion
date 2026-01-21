<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import SvgIcon from '@/components/custom/svg-icon.vue'
import { fetchArticleList } from '@/service/api/article'
import { fetchCategoryList } from '@/service/api/category'
import { useRouterPush } from '@/hooks/router'
import dayjs from 'dayjs'

defineOptions({
  name: 'BlogTags',
})

const { routerPushByKey } = useRouterPush()

const selectedCategoryId = ref<number | 'All'>('All')
const categories = ref<Api.Category.Category[]>([])
const articles = ref<Api.Article.Article[]>([])
const loading = ref(false)
const totalArticles = ref(0)

const getCategories = async () => {
  try {
    const { data } = await fetchCategoryList()
    if (data) {
      categories.value = data
    }
  } catch (error) {
    console.error('Failed to fetch categories:', error)
  }
}

const getArticles = async () => {
  loading.value = true
  try {
    const params: Api.Article.ArticleSearchParams = {
      current: 1,
      size: 100, // Load more for this view, or implement pagination
    }

    if (selectedCategoryId.value !== 'All') {
      params.categoryId = selectedCategoryId.value
    }

    const { data } = await fetchArticleList(params)
    if (data?.records) {
      articles.value = data.records
      totalArticles.value = data.total
    } else {
      articles.value = []
      totalArticles.value = 0
    }
  } catch (error) {
    console.error('Failed to fetch articles:', error)
    articles.value = []
  } finally {
    loading.value = false
  }
}

const setCategory = (id: number | 'All') => {
  selectedCategoryId.value = id
}

const openArticle = (id: number) => {
  routerPushByKey('article', { params: { id: String(id) } })
}

watch(selectedCategoryId, () => {
  getArticles()
})

onMounted(() => {
  getCategories()
  getArticles()
})
</script>

<template>
  <div class="bg-slate-50 text-slate-900 leading-relaxed font-inter min-h-screen">
    <main class="max-w-5xl mx-auto px-6 py-12 md:pt-20">
      <div class="max-w-3xl mx-auto">
        <h1 class="text-3xl font-bold mb-8 text-slate-900">Categories</h1>

        <!-- Categories Cloud -->
        <div class="flex flex-wrap gap-4 mb-16">
          <div
            class="px-6 py-2 rounded-2xl text-lg font-bold shadow-lg shadow-slate-200 cursor-pointer transition-colors"
            :class="
              selectedCategoryId === 'All' ? 'bg-slate-800 text-white hover:bg-slate-700' : 'bg-white text-slate-600 hover:text-indigo-600'
            "
            @click="setCategory('All')"
          >
            全部
          </div>
          <div
            v-for="cat in categories"
            :key="cat.id"
            class="px-4 border rounded-xl text-sm font-medium cursor-pointer transition-all flex items-center"
            :class="
              selectedCategoryId === cat.id ? 'bg-slate-800 text-white hover:bg-slate-700' : 'bg-white text-slate-600 hover:text-indigo-600'
            "
            @click="setCategory(cat.id)"
          >
            {{ cat.name }}
            <span v-if="cat.count" class="ml-1" :class="selectedCategoryId === cat.id ? 'text-white/80' : 'text-slate-400'">{{
              cat.count
            }}</span>
          </div>
        </div>

        <!-- Recent Added (Simulated as All for now) -->
        <h3 class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6 px-1">
          {{ selectedCategoryId === 'All' ? '最近更新' : categories.find((c) => c.id === selectedCategoryId)?.name }}
        </h3>

        <div v-if="loading" class="text-center py-12">
          <div class="inline-block animate-spin rounded-full h-8 w-8 border-4 border-slate-200 border-t-indigo-600"></div>
        </div>

        <div v-else-if="articles.length > 0" class="grid md:grid-cols-2 gap-6">
          <div
            v-for="article in articles"
            :key="article.id"
            class="p-6 rounded-2xl bg-white border border-slate-100 hover:shadow-md transition-all group cursor-pointer animate-fade-in"
            @click="openArticle(article.id)"
          >
            <div class="flex justify-between items-start mb-3">
              <span class="text-xs font-bold uppercase tracking-tight text-indigo-600">{{
                article.category?.name || 'Uncategorized'
              }}</span>
              <span class="text-xs text-slate-400">{{ dayjs(article.createdAt).format('YYYY-MM-DD') }}</span>
            </div>
            <h4 class="text-lg font-bold text-slate-800 leading-snug group-hover:text-indigo-600 mb-2">
              {{ article.title }}
            </h4>
            <div class="flex items-center justify-end">
              <SvgIcon icon="heroicons:chevron-right" class="text-slate-300 group-hover:text-indigo-500 transition-colors" />
            </div>
          </div>
        </div>
        <div v-else class="text-center py-12 text-slate-400">暂无相关文章</div>
      </div>
    </main>
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
  animation: fadeIn 0.5s ease-out forwards;
}
</style>
