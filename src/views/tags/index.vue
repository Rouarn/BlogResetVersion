<script setup lang="ts">
import { computed } from 'vue'
import SvgIcon from '@/components/custom/svg-icon.vue'
import BlogBottomNav from '@/views/home/modules/BlogBottomNav.vue'
import BlogFooter from '@/views/home/modules/BlogFooter.vue'
import BlogNavbar from '@/views/home/modules/BlogNavbar.vue'
import { useRouterPush } from '@/hooks/common/router'
import { blogArticles } from '@/views/home/modules/blog-data'

defineOptions({
  name: 'BlogTags',
})

const { routerPushByKey } = useRouterPush()

// Aggregate categories
const categories = computed(() => {
  const counts: Record<string, number> = {}
  blogArticles.forEach((article) => {
    counts[article.category] = (counts[article.category] || 0) + 1
  })
  return Object.keys(counts).map((name) => ({
    name,
    count: counts[name],
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
        <h1 class="text-3xl font-bold mb-2">分类标签</h1>
        <p class="text-slate-500">探索感兴趣的话题</p>
      </header>

      <!-- Tags Cloud -->
      <div class="flex flex-wrap gap-4 mb-16">
        <div
          class="px-6 py-3 bg-slate-800 text-white rounded-2xl text-lg font-bold shadow-lg shadow-slate-200 cursor-pointer hover:bg-slate-700 transition-colors"
        >
          全部 {{ blogArticles.length }}
        </div>
        <div
          v-for="cat in categories"
          :key="cat.name"
          class="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-xl text-sm font-medium hover:border-indigo-500 hover:text-indigo-600 cursor-pointer transition-all"
        >
          {{ cat.name }} <span class="text-slate-400 ml-1">{{ cat.count }}</span>
        </div>
      </div>

      <!-- Recent Added (Simulated as All for now) -->
      <h3 class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6 px-1">最近更新</h3>
      <div class="grid md:grid-cols-2 gap-6">
        <div
          v-for="article in blogArticles"
          :key="article.id"
          class="p-6 rounded-2xl bg-white border border-slate-100 hover:shadow-md transition-all group cursor-pointer"
          @click="openArticle(article.id)"
        >
          <div class="flex justify-between items-start mb-3">
            <span class="text-xs font-bold uppercase tracking-tight" :class="article.categoryClass">{{ article.category }}</span>
            <span class="text-xs text-slate-400">{{ article.date }}</span>
          </div>
          <h4 class="text-lg font-bold text-slate-800 leading-snug group-hover:text-indigo-600 mb-2">{{ article.title }}</h4>
          <div class="flex items-center justify-end">
            <SvgIcon icon="heroicons:chevron-right" class="text-slate-300 group-hover:text-indigo-500 transition-colors" />
          </div>
        </div>
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
