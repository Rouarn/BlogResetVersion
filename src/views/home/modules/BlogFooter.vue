<script setup lang="ts">
defineOptions({
  name: 'BlogFooter',
})
</script>

<template>
  <footer class="bg-white border-t border-slate-100 mt-20">
    <div class="max-w-5xl mx-auto px-6 py-12 flex flex-col md:flex-row justify-between items-center text-slate-400 text-sm">
      <p>© 2025 FocusLog. Built with Passion & Minimalism.</p>
      <div class="flex space-x-6 mt-4 md:mt-0">
        <a href="#" class="hover:text-slate-900 transition-colors">隐私政策</a>
        <a href="#" class="hover:text-slate-900 transition-colors">RSS 订阅</a>
      </div>
    </div>
  </footer>
</template>
