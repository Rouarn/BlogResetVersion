<template>
  <div>
    <MdPreview :model-value="optionsData.articleDetail" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import MdPreview from '@/components/custom/md-preview.vue'

defineOptions({ name: 'ArticlePreview' })

const route = useRoute() as { params: { id?: string } }

const optionsData = computed(() => ({
  articleId: String(route.params.id || ''),
  articleDetail: '',
}))
</script>

<style lang="scss" scoped></style>
