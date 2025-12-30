<script setup lang="ts">
import { onMounted, ref } from 'vue'
import SvgIcon from '@/components/custom/svg-icon.vue'
import { fetchCategoryList } from '@/service/api/category'
import { fetchSiteProfile } from '@/service/api/user'
import { useRouterPush } from '@/hooks/common/router'

defineOptions({
  name: 'BlogSidebar',
})

const { routerPushByKey } = useRouterPush()
const profile = ref<Api.Blog.Profile | null>(null)
const categories = ref<Api.Category.Category[]>([])

const getProfile = async () => {
  try {
    const { data } = await fetchSiteProfile()
    if (data) {
      profile.value = data
    }
  } catch (error) {
    console.error(error)
  }
}

const getCategories = async () => {
  try {
    const { data } = await fetchCategoryList()
    if (data) {
      categories.value = data
    }
  } catch (error) {
    console.error(error)
  }
}

const handleCategoryClick = (id: number) => {
  // Assuming we want to filter home by category, but for now just navigate to tags or home
  routerPushByKey('home', { query: { categoryId: String(id) } })
}

onMounted(() => {
  getProfile()
  getCategories()
})
</script>

<template>
  <aside class="hidden lg:block lg:w-1/3 space-y-12">
    <!-- 个人卡片 -->
    <div
      v-if="profile"
      class="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
      @click="routerPushByKey('about')"
    >
      <div class="w-20 h-20 rounded-2xl bg-indigo-50 flex items-center justify-center mb-6 overflow-hidden">
        <NImage
          v-if="profile.avatar"
          :src="profile.avatar"
          object-fit="cover"
          :alt="profile.nickname"
          :fallback-src="'https://picsum.photos/200/200'"
        />
        <SvgIcon v-else icon="ph:user-circle-duotone" class="text-4xl text-indigo-600" />
      </div>
      <h3 class="text-lg font-bold mb-2">关于博主</h3>
      <p class="text-sm text-slate-500 mb-6 leading-relaxed">{{ profile.title || profile.bio }}</p>
      <div class="flex space-x-2">
        <ButtonIcon
          v-for="item in profile.socialLinks"
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
        <li
          v-for="cat in categories"
          :key="cat.id"
          class="flex justify-between items-center group cursor-pointer"
          @click="handleCategoryClick(cat.id)"
        >
          <span class="text-slate-600 group-hover:text-indigo-600 transition-colors">{{ cat.name }}</span>
          <span class="text-xs bg-slate-100 px-2 py-1 rounded text-slate-400">{{ cat.articleCount || 0 }}</span>
        </li>
      </ul>
    </div>
  </aside>
</template>
