<script setup lang="ts">
import SvgIcon from '@/components/custom/svg-icon.vue'
import BlogBottomNav from '@/views/home/modules/BlogBottomNav.vue'
import BlogFooter from '@/views/home/modules/BlogFooter.vue'
import BlogNavbar from '@/views/home/modules/BlogNavbar.vue'

defineOptions({
  name: 'BlogAbout',
})
</script>

<template>
  <div class="min-h-screen bg-slate-50 font-sans text-slate-800 pb-20 md:pb-0">
    <BlogNavbar />

    <main class="animate-fade-in">
      <!-- Profile Header -->
      <div class="h-64 md:h-80 bg-slate-900 relative">
        <img
          src="https://modao.cc/agent-py/media/generated_images/2025-12-27/edcd2a4451b646b395eee4f661e37eb3.jpg"
          alt="Cover"
          class="w-full h-full object-cover opacity-40"
        />
        <div class="absolute -bottom-12 left-6 md:left-1/2 md:-translate-x-1/2 md:flex md:flex-col md:items-center">
          <div class="w-24 h-24 md:w-32 md:h-32 rounded-3xl border-4 border-white overflow-hidden bg-white shadow-xl">
            <img
              src="https://modao.cc/agent-py/media/generated_images/2025-12-27/cb3b6cf9265c4fe883e7270bda82011c.jpg"
              alt="Avatar"
              class="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      <div class="max-w-2xl mx-auto px-6 pt-16 md:pt-24 pb-12">
        <div class="text-center mb-10">
          <h1 class="text-3xl font-black mb-2">Liam Wang</h1>
          <p class="text-indigo-600 font-medium">产品设计师 & 开发者</p>
        </div>

        <div class="space-y-10">
          <section class="space-y-4">
            <h3 class="text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-200 pb-2">简介</h3>
            <p class="text-slate-600 leading-relaxed">
              你好，我是一名常驻上海的独立创作者。专注于极简主义设计与高效的前端开发。我相信好的产品应该像空气一样自然存在。
              <br /><br />
              业余时间，我会在这里记录折腾各类开源工具的过程，分享关于技术、设计与生活哲学的思考。
            </p>
          </section>

          <section class="space-y-4">
            <h3 class="text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-200 pb-2">社交链接</h3>
            <div class="flex gap-4">
              <a
                href="#"
                class="w-12 h-12 rounded-full bg-white border border-slate-100 flex items-center justify-center hover:bg-slate-800 hover:text-white transition-all shadow-sm"
              >
                <SvgIcon icon="simple-icons:github" class="text-xl" />
              </a>
              <a
                href="#"
                class="w-12 h-12 rounded-full bg-white border border-slate-100 flex items-center justify-center hover:bg-sky-500 hover:text-white transition-all shadow-sm"
              >
                <SvgIcon icon="simple-icons:twitter" class="text-xl" />
              </a>
              <a
                href="#"
                class="w-12 h-12 rounded-full bg-white border border-slate-100 flex items-center justify-center hover:bg-emerald-500 hover:text-white transition-all shadow-sm"
              >
                <SvgIcon icon="simple-icons:wechat" class="text-xl" />
              </a>
              <a
                href="#"
                class="w-12 h-12 rounded-full bg-white border border-slate-100 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all shadow-sm"
              >
                <SvgIcon icon="heroicons:envelope" class="text-xl" />
              </a>
            </div>
          </section>

          <section>
            <div class="p-5 bg-orange-50 rounded-2xl border border-orange-100 flex items-center space-x-4">
              <div class="relative">
                <div class="w-3 h-3 rounded-full bg-orange-400 animate-ping absolute opacity-75"></div>
                <div class="w-3 h-3 rounded-full bg-orange-500 relative"></div>
              </div>
              <div>
                <p class="text-xs text-orange-800 font-bold uppercase tracking-wide mb-1">Current Status</p>
                <p class="text-sm text-orange-900 font-medium">正在筹备 2026 年度视觉复盘项目</p>
              </div>
            </div>
          </section>
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
