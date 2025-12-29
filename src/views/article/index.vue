<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import SvgIcon from '@/components/custom/svg-icon.vue'
import { blogArticles } from '../home/modules/blog-data'
import { useRouterPush } from '@/hooks/common/router'

defineOptions({
  name: 'ArticleDetail',
})

const route = useRoute()
const { routerBack } = useRouterPush()

const articleId = Number((route.params as { id: string }).id)
const article = computed(() => blogArticles.find((a) => a.id === articleId))

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
          </div>
          <h1 class="text-3xl md:text-5xl font-bold leading-tight mb-8">{{ article.title }}</h1>
          <div class="aspect-video rounded-3xl overflow-hidden bg-slate-100">
            <img
              src="https://modao.cc/agent-py/media/generated_images/2025-12-27/4dd42b34daba44ae8137baef8853f28b.jpg"
              alt="featured image"
              class="w-full h-full object-cover"
            />
          </div>
        </header>
        <section class="prose prose-slate prose-lg max-w-none text-slate-700 space-y-6">
          <p>
            2025年，我们不再仅仅是“使用”AI工具，而是与AI共同创造。这种转变体现在工作流的每一个毛细血管中。从代码补全到自动化的复杂决策支持，AI
            正在从一个外部组件变成基础设施的一部分。
          </p>
          <div class="p-8 bg-slate-50 border-l-4 border-indigo-500 italic text-slate-600">
            “界面的本质不是展示功能，而是建立信任感。在 AI 时代，这种信任来自于透明的过程与即时的反馈。”
          </div>
          <h3 class="text-2xl font-bold text-slate-900 mt-12 mb-4">深度协作的三个阶段</h3>
          <p>首先是感知阶段。系统通过上下文理解你的意图，而不是等待明确的指令。其次是联想阶段，它能根据当前任务推荐最相关的资源和策略。</p>
          <ul class="space-y-4 list-disc pl-6">
            <li>场景智能感知：环境信息的全自动录入与分类</li>
            <li>协作知识库：组织内部智慧的实时流控</li>
            <li>多模态交互：自然语言、手势与眼神的无缝对接</li>
          </ul>
          <p>
            当我们回看 2024 年时，那时的大模型似乎还显得有些笨拙。现在的系统已经能够通过 RAG
            技术与实时传感器数据，在确保安全的前提下执行更高优先级的自主任务。
          </p>
        </section>
        <footer class="mt-20 pt-12 border-t border-slate-100 flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <button class="flex items-center space-x-2 px-6 py-2 bg-slate-900 text-white rounded-full hover:bg-slate-800 transition-all">
              <SvgIcon icon="ph:heart-bold" />
              <span>赞 (128)</span>
            </button>
            <button class="p-2 border border-slate-200 rounded-full text-slate-400 hover:text-slate-900 transition-colors">
              <SvgIcon icon="ph:share-network-bold" class="text-xl" />
            </button>
          </div>
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
