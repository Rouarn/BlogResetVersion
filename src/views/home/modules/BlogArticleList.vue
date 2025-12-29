<script setup lang="ts">
import SvgIcon from '@/components/custom/svg-icon.vue'
import { blogArticles } from './blog-data'
import { useRouterPush } from '@/hooks/common/router'

defineOptions({
  name: 'BlogArticleList',
})

const { routerPushByKey } = useRouterPush()

const openArticle = (id: number) => {
  routerPushByKey('article', { params: { id: String(id) } })
}
</script>

<template>
  <section class="lg:w-2/3 animate-fade-in">
    <header class="mb-12">
      <h1 class="text-4xl font-bold text-slate-900 mb-4">记录思考的瞬间</h1>
      <p class="text-slate-500 max-w-lg">今天是 2025年12月27日。这里是我分享关于技术、设计与生活哲学的地方，旨在寻找数字世界的宁静。</p>
    </header>
    <div class="space-y-16">
      <article v-for="article in blogArticles" :key="article.id" class="group">
        <div class="flex items-center space-x-3 text-xs font-medium uppercase tracking-widest mb-3" :class="article.categoryClass">
          <span>{{ article.category }}</span>
          <span class="w-1 h-1 bg-slate-300 rounded-full"></span>
          <span class="text-slate-400">{{ article.date }}</span>
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
              <img :src="article.avatar" alt="author avatar" class="w-full h-full object-cover" />
            </div>
            <span class="text-sm font-medium text-slate-700">{{ article.author }}</span>
          </div>
          <a
            href="javascript:;"
            class="flex items-center text-sm font-semibold text-indigo-600 hover:translate-x-1 transition-transform"
            @click="openArticle(article.id)"
          >
            阅读全文 <SvgIcon icon="ph:arrow-right-bold" class="ml-1" />
          </a>
        </div>
      </article>
    </div>
    <button
      class="mt-20 w-full py-4 border-2 border-dashed border-slate-200 rounded-xl text-slate-400 font-medium hover:border-indigo-300 hover:text-indigo-500 transition-all"
      @click="routerPushByKey('archive')"
    >
      加载更多历史文章
    </button>
  </section>
</template>
