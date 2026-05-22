<script setup lang="ts">
import { ref } from 'vue'
import GridDistortion from '@/components/custom/grid-distortion.vue'
import UserAvatar from '@/layouts/modules/global-header/components/user-avatar.vue'
import pkg from '@/../package.json'

defineOptions({
  name: 'BlogAbout',
})

const { author } = pkg

const defaultProfile: Api.Blog.Profile = {
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
}

const profile = ref<Api.Blog.Profile>({ ...defaultProfile })
</script>

<template>
  <div class="min-h-screen bg-slate-50 font-sans text-slate-800">
    <main class="animate-fade-in">
      <!-- Profile Header -->
      <div class="h-80 md:h-80 bg-slate-900 relative group">
        <GridDistortion :image-src="pkg.author.fulitu" :grid="30" :mouse="0.1" :strength="0.15" :relaxation="0.9"> </GridDistortion>

        <!-- 用户头像 -->
        <UserAvatar custom-class="text-#ffffff hover:#ffffff! absolute top-5 right-0" />

        <div class="absolute -bottom-12 left-6 md:left-1/2 md:-translate-x-1/2 md:flex md:flex-col md:items-center">
          <div class="w-24 h-24 md:w-32 md:h-32 rounded-3xl border-4 border-white overflow-hidden bg-white shadow-xl">
            <img v-if="profile.avatar" :src="profile.avatar" alt="Avatar" class="w-full h-full object-cover" />
            <div v-else class="w-full h-full bg-slate-200 flex items-center justify-center text-slate-400">
              <span class="text-xs">No Avatar</span>
            </div>
          </div>
        </div>
      </div>

      <div class="max-w-2xl mx-auto px-6 pt-16 md:pt-24 pb-12">
        <div class="text-center mb-10">
          <h1 class="text-3xl font-black mb-2">{{ profile.nickname }}</h1>
          <p class="text-indigo-600 font-medium">{{ profile.title }}</p>
        </div>

        <div class="space-y-10">
          <section v-if="profile.bio" class="space-y-4">
            <h3 class="text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-200 pb-2">简介</h3>
            <p class="text-slate-600 leading-relaxed">{{ profile.bio }}</p>
          </section>

          <section v-if="profile.socialLinks && profile.socialLinks.length > 0" class="space-y-4">
            <h3 class="text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-200 pb-2">社交链接</h3>
            <div class="flex gap-4">
              <ButtonIcon
                v-for="item in profile.socialLinks"
                :key="item.key"
                :icon="item.icon"
                :tooltip-content="item.label"
                tag="a"
                :href="item.link"
                target="_blank"
                class="!w-12 !h-12 rounded-full bg-white border border-slate-100 flex items-center justify-center transition-all shadow-sm"
                :class="item.class"
              />
            </div>
          </section>

          <section v-if="profile.currentStatus">
            <div class="p-5 bg-orange-50 rounded-2xl border border-orange-100 flex items-center space-x-4">
              <div class="relative">
                <div class="w-3 h-3 rounded-full bg-orange-400 animate-ping absolute opacity-75"></div>
                <div class="w-3 h-3 rounded-full bg-orange-500 relative"></div>
              </div>
              <div>
                <p class="text-xs text-orange-800 font-bold uppercase tracking-wide mb-1">Current Status</p>
                <p class="text-sm text-orange-900 font-medium">{{ profile.currentStatus }}</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
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
