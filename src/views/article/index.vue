<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import MarkdownViewer from '@/components/common/markdown-viewer.vue'
import SvgIcon from '@/components/custom/svg-icon.vue'
import { blogArticles } from '../home/modules/blog-data'
import { useRouterPush } from '@/hooks/common/router'

defineOptions({
  name: 'ArticleDetail',
})

const route = useRoute()
const { routerBack, routerPushByKey } = useRouterPush()

const articleId = computed(() => Number((route.params as { id: string }).id))
const article = computed(() => blogArticles.find((a) => a.id === articleId.value))

const currentIndex = computed(() => blogArticles.findIndex((a) => a.id === articleId.value))
const prevArticle = computed(() => (currentIndex.value < blogArticles.length - 1 ? blogArticles[currentIndex.value + 1] : null))
const nextArticle = computed(() => (currentIndex.value > 0 ? blogArticles[currentIndex.value - 1] : null))

const navigateTo = (id: number) => {
  routerPushByKey('article', { params: { id: String(id) } })
}

const goBack = () => {
  routerBack()
}
</script>

<template>
  <div class="bg-white min-h-screen relative">
    <button
      class="fixed top-24 left-4 md:left-8 p-3 bg-white shadow-xl border border-slate-100 rounded-full hover:scale-110 transition-transform z-40 md:top-24"
      @click="goBack"
    >
      <SvgIcon icon="ph:arrow-left" class="text-2xl" />
    </button>

    <div v-if="article" class="max-w-3xl mx-auto px-6 py-12 animate-fade-in">
      <article>
        <header class="mb-12">
          <div class="flex items-center space-x-4 mb-6">
            <span class="px-3 py-1 bg-indigo-50 text-indigo-600 text-xs font-bold rounded-full">{{ article.category }}</span>
            <span class="text-slate-400 text-sm">发表于 {{ article.date }}</span>
            <span class="text-slate-300 mx-2">·</span>
            <span class="text-slate-400 text-sm flex items-center"> <SvgIcon icon="ph:eye" class="mr-1" /> {{ article.views }} 阅读 </span>
          </div>
          <h1 class="text-3xl md:text-5xl font-bold leading-tight mb-8">{{ article.title }}</h1>
          <div class="aspect-video rounded-3xl overflow-hidden bg-slate-100">
            <img :src="article.cover" alt="featured image" class="w-full h-full object-cover" />
          </div>
        </header>
        <section class="max-w-none text-slate-700 space-y-6">
          <MarkdownViewer :content="article.content" />
        </section>
        <footer class="mt-20 pt-12 border-t border-slate-100">
          <div class="flex items-center justify-between mb-12">
            <div class="flex items-center space-x-4">
              <button class="flex items-center space-x-2 px-6 py-2 bg-slate-900 text-white rounded-full hover:bg-slate-800 transition-all">
                <SvgIcon icon="ph:heart-bold" />
                <span>赞 (128)</span>
              </button>
              <button class="p-2 border border-slate-200 rounded-full text-slate-400 hover:text-slate-900 transition-colors">
                <SvgIcon icon="ph:share-network-bold" class="text-xl" />
              </button>
            </div>
          </div>

          <nav class="grid grid-cols-2 gap-4 pt-8 border-t border-slate-100">
            <div v-if="prevArticle" class="group cursor-pointer text-left" @click="navigateTo(prevArticle.id)">
              <div class="text-xs text-slate-400 mb-1 group-hover:text-indigo-600 transition-colors">上一篇</div>
              <div class="text-sm font-bold text-slate-800 truncate group-hover:text-indigo-600 transition-colors">
                {{ prevArticle.title }}
              </div>
            </div>
            <div v-else></div>

            <div v-if="nextArticle" class="group cursor-pointer text-right" @click="navigateTo(nextArticle.id)">
              <div class="text-xs text-slate-400 mb-1 group-hover:text-indigo-600 transition-colors">下一篇</div>
              <div class="text-sm font-bold text-slate-800 truncate group-hover:text-indigo-600 transition-colors">
                {{ nextArticle.title }}
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
  </div>
</template>

<style>
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
