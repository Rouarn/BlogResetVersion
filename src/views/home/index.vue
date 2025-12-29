<script setup lang="ts">
import BlogArticleList from './modules/BlogArticleList.vue'
import BlogBottomNav from './modules/BlogBottomNav.vue'
import BlogFooter from './modules/BlogFooter.vue'
import BlogNavbar from './modules/BlogNavbar.vue'
import BlogSidebar from './modules/BlogSidebar.vue'

defineOptions({ name: 'BlogHome' })
</script>

<template>
  <div class="bg-slate-50 text-slate-900 leading-relaxed font-inter min-h-screen pb-20 md:pb-0">
    <BlogNavbar />
    <main class="max-w-5xl mx-auto px-6 py-12 md:pt-20 lg:flex lg:gap-16">
      <BlogArticleList />
      <BlogSidebar />
    </main>
    <BlogFooter />
    <BlogBottomNav />
  </div>
</template>

<style lang="scss" scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap');

.font-inter {
  font-family:
    'Inter',
    -apple-system,
    BlinkMacSystemFont,
    'Segoe UI',
    Roboto,
    sans-serif;
}

.hide-scrollbar::-webkit-scrollbar {
  display: none;
}
.hide-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

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
