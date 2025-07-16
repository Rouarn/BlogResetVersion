<script lang="ts" setup>
const props = withDefaults(defineProps<{ blogList?: Api.Home.BlogItem[] }>(), {
  blogList: () => [],
})
</script>

<template>
  <div class="relative mx-auto max-w-1200px w-full px-4 sm:px-6">
    <div class="grid grid-cols-1 gap-8 lg:grid-cols-3 md:grid-cols-2">
      <!-- 卡片1 -->
      <div
        v-for="item in props.blogList"
        :key="item.id"
        class="blog-card overflow-hidden bg-white transition-transform duration-300 hover:shadow-lg hover:-translate-y-1"
      >
        <div class="h-200px overflow-hidden">
          <NImage :src="item.cover" alt="" object-fit="cover" class="transition-transform duration-300 hover:rotate-6 hover:scale-140" />
        </div>
        <div class="p-6">
          <div class="mb-2 text-11px text-#666 font-600 uppercase">{{ item.date }}</div>
          <h3 class="mb-3 text-18px text-#222 font-bold">{{ item.title }}</h3>
          <p class="mb-4 text-14px text-#666">{{ item.description }}</p>
          <NButton :bordered="false" ghost text-color="#444" class="readMore p-0 font-medium transition-colors"> Read More </NButton>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.blog-card {
  box-shadow: 0 5px 30px rgba(0, 0, 0, 0.1);
}

.readMore {
  &::before {
    position: absolute;
    content: '';
    height: 2px;
    width: 20px;
    background: #333;
    bottom: 16px;
    right: -30px;
  }
}
</style>
