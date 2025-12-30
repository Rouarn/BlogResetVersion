<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { fetchArticleArchive } from '@/service/api/article'
import { useRouterPush } from '@/hooks/common/router'
import dayjs from 'dayjs'

defineOptions({
  name: 'BlogArchive',
})

const { routerPushByKey } = useRouterPush()
const archives = ref<Api.Article.Archive[]>([])
const loading = ref(false)

const getArchive = async () => {
  loading.value = true
  try {
    const { data } = await fetchArticleArchive()
    if (data) {
      archives.value = data
    }
  } catch (error) {
    console.error('Failed to fetch archive:', error)
  } finally {
    loading.value = false
  }
}

const openArticle = (id: number) => {
  routerPushByKey('article', { params: { id: String(id) } })
}

const formatDate = (date: string) => {
  if (!date) return ''
  return dayjs(date).format('MM-DD')
}

onMounted(() => {
  getArchive()
})
</script>

<template>
  <div class="bg-slate-50 text-slate-900 leading-relaxed font-inter min-h-screen">
    <main class="max-w-5xl mx-auto px-6 py-12 md:pt-20">
      <div class="max-w-3xl mx-auto">
        <h1 class="text-3xl font-bold mb-8 text-slate-900">Archive</h1>

        <div v-if="loading" class="text-center py-10">
          <p>加载中...</p>
        </div>
        <div v-else class="space-y-12 relative animate-fade-in">
          <!-- Vertical Line -->
          <div class="absolute left-2.5 top-2 bottom-2 w-0.5 bg-slate-200 hidden md:block"></div>

          <section v-for="group in archives" :key="group.year" class="relative md:pl-10">
            <!-- Year Marker -->
            <div
              class="absolute left-0 top-1.5 w-5 h-5 bg-slate-800 rounded-full border-4 border-white shadow-sm hidden md:block z-10"
            ></div>

            <h2 class="text-4xl font-black text-slate-200 mb-6 md:mb-8 md:text-slate-200 md:text-6xl md:-ml-4">{{ group.year }}</h2>

            <div class="space-y-6">
              <div
                v-for="article in group.articles"
                :key="article.id"
                class="flex flex-col md:flex-row md:items-center group cursor-pointer"
                @click="openArticle(article.id)"
              >
                <div class="flex items-center space-x-4 md:w-32 shrink-0 mb-2 md:mb-0">
                  <span class="text-sm font-medium text-slate-400">{{ formatDate(article.createTime) }}</span>
                  <span class="md:hidden h-px bg-slate-200 flex-1"></span>
                </div>
                <div class="flex-1 pb-4 border-b border-slate-100 group-last:border-0">
                  <h3 class="text-lg font-bold group-hover:text-indigo-600 transition-colors">{{ article.title }}</h3>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap');

.font-inter {
  font-family:
    'Inter',
    -apple-system,
    BlinkMacSystemFont,
    'Segoe UI',
    Roboto,
    sans-serif;
}

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
