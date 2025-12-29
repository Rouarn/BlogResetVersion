<script setup lang="ts">
import SvgIcon from '@/components/custom/svg-icon.vue'
import { blogProfile } from './blog-data'
import { useRouterPush } from '@/hooks/common/router'

defineOptions({
  name: 'BlogSidebar',
})

const { routerPushByKey } = useRouterPush()
</script>

<template>
  <aside class="hidden lg:block lg:w-1/3 space-y-12">
    <!-- 个人卡片 -->
    <div
      class="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
      @click="routerPushByKey('about')"
    >
      <div class="w-20 h-20 rounded-2xl bg-indigo-50 flex items-center justify-center mb-6">
        <SvgIcon icon="ph:user-circle-duotone" class="text-4xl text-indigo-600" />
      </div>
      <h3 class="text-lg font-bold mb-2">关于博主</h3>
      <p class="text-sm text-slate-500 mb-6 leading-relaxed">{{ blogProfile.title }}</p>
      <div class="flex space-x-2">
        <ButtonIcon
          v-for="item in blogProfile.socialLinks"
          :key="item.key"
          :icon="item.icon"
          :tooltip-content="item.label"
          tag="a"
          :href="item.link"
          target="_blank"
          class="text-slate-400 transition-colors"
          :class="item.class"
        />
      </div>
    </div>
    <!-- 热点标签 -->
    <div>
      <h3
        class="text-sm font-bold uppercase tracking-wider text-slate-400 mb-6 cursor-pointer hover:text-indigo-600"
        @click="routerPushByKey('tags')"
      >
        热门分类
      </h3>
      <ul class="space-y-3">
        <li class="flex justify-between items-center group cursor-pointer" @click="routerPushByKey('tags')">
          <span class="text-slate-600 group-hover:text-indigo-600 transition-colors">技术研发</span>
          <span class="text-xs bg-slate-100 px-2 py-1 rounded text-slate-400">12</span>
        </li>
        <li class="flex justify-between items-center group cursor-pointer" @click="routerPushByKey('tags')">
          <span class="text-slate-600 group-hover:text-indigo-600 transition-colors">界面设计</span>
          <span class="text-xs bg-slate-100 px-2 py-1 rounded text-slate-400">08</span>
        </li>
        <li class="flex justify-between items-center group cursor-pointer" @click="routerPushByKey('tags')">
          <span class="text-slate-600 group-hover:text-indigo-600 transition-colors">生活杂记</span>
          <span class="text-xs bg-slate-100 px-2 py-1 rounded text-slate-400">24</span>
        </li>
      </ul>
    </div>
  </aside>
</template>
