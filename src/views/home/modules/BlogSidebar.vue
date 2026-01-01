<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { fetchCategoryList } from '@/service/api/category'
import pkg from '@/../package.json'
import { useRouterPush } from '@/hooks/common/router'

defineOptions({
  name: 'BlogSidebar',
})

const { routerPushByKey } = useRouterPush()
const { author } = pkg

const profile = ref<Api.Blog.Profile>({
  nickname: author.name,
  title: author.title,
  avatar: author.avatar,
  cover: author.cover,
  bio: author.bio,
  currentStatus: author.currentStatus,
  socialLinks: Object.entries(author.socialLinks).map(([key, link]) => ({
    key,
    label: key.charAt(0).toUpperCase() + key.slice(1),
    icon: `simple-icons:${key}`,
    link,
    class: 'hover:text-indigo-600',
  })),
})

const categories = ref<Api.Category.Category[]>([])

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
  routerPushByKey('tags', { query: { categoryId: String(id) } })
}

onMounted(() => {
  getCategories()
})
</script>

<template>
  <aside class="hidden lg:block lg:w-1/3 space-y-12">
    <!-- 个人卡片 -->
    <div
      v-if="profile"
      class="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
      @click.self="routerPushByKey('about')"
    >
      <div class="w-20 h-20 rounded-2xl flex items-center justify-center mb-6 overflow-hidden">
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
          <span class="text-xs bg-slate-100 px-2 py-1 rounded text-slate-400">{{ cat.count || 0 }}</span>
        </li>
      </ul>
    </div>
  </aside>
</template>
