<script setup lang="ts">
import { computed } from 'vue'
import BlogBottomNav from '@/views/home/modules/BlogBottomNav.vue'
import BlogFooter from '@/views/home/modules/BlogFooter.vue'
import BlogNavbar from '@/views/home/modules/BlogNavbar.vue'
import { useRouterPush } from '@/hooks/common/router'
import { blogArticles } from '@/views/home/modules/blog-data'

defineOptions({
  name: 'BlogArchive',
})

const { routerPushByKey } = useRouterPush()

// Group articles by year
const archives = computed(() => {
  const groups: Record<string, typeof blogArticles> = {}
  blogArticles.forEach((article) => {
    const year = article.date.split('-')[0]
    if (!groups[year]) {
      groups[year] = []
    }
    groups[year].push(article)
  })
  // Sort years descending
  return Object.keys(groups)
    .sort((a, b) => Number(b) - Number(a))
    .map((year) => ({
      year,
      articles: groups[year],
    }))
})

const openArticle = (id: number) => {
  routerPushByKey('article', { params: { id: String(id) } })
}
</script>

<template>
  <div class="min-h-screen bg-slate-50 font-sans text-slate-800 pb-20 md:pb-0">
    <BlogNavbar />

    <main class="max-w-5xl mx-auto px-6 py-12 animate-fade-in">
      <header class="mb-12">
        <h1 class="text-3xl font-bold mb-2">文章归档</h1>
        <p class="text-slate-500">时间轴记录着思考的轨迹</p>
      </header>

      <div class="space-y-12 relative">
        <!-- Vertical Line -->
        <div class="absolute left-2.5 top-2 bottom-2 w-0.5 bg-slate-200 hidden md:block"></div>

        <section v-for="group in archives" :key="group.year" class="relative md:pl-10">
          <!-- Year Marker -->
          <div class="absolute left-0 top-1.5 w-5 h-5 bg-slate-800 rounded-full border-4 border-white shadow-sm hidden md:block z-10"></div>

          <h2 class="text-4xl font-black text-slate-200 mb-6 md:mb-8 md:text-slate-200 md:text-6xl md:-ml-4">{{ group.year }}</h2>

          <div class="space-y-6">
            <div
              v-for="article in group.articles"
              :key="article.id"
              class="flex flex-col md:flex-row md:items-center group cursor-pointer"
              @click="openArticle(article.id)"
            >
              <div class="flex items-center space-x-4 md:w-32 shrink-0 mb-2 md:mb-0">
                <span class="text-sm font-medium text-slate-400">{{ article.date.slice(5) }}</span>
                <span class="md:hidden h-px bg-slate-200 flex-1"></span>
              </div>
              <div class="flex-1 pb-4 border-b border-slate-100 group-last:border-0">
                <h3 class="text-lg font-bold group-hover:text-indigo-600 transition-colors">{{ article.title }}</h3>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>

    <BlogFooter />
    <BlogBottomNav />
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
