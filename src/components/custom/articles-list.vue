<template>
  <div class="flex-col gap-24px">
    <div v-for="item in tableData" :key="item.id" class="card-wrapper bg-white dark:bg-gray-900 p-20px flex gap-20px">
      <NImage :src="item.cover" :alt="item.title" class="w-200px h-130px rd-10px object-cover" />
      <NFlex vertical class="flex-1" @click="handleClick(item.id)">
        <div class="flex-1 cursor-pointer">
          <div class="text-18px font-600 mb-8px">{{ item.title }}</div>
          <div class="text-14px color-gray-600 dark:color-gray-300 mb-12px">
            {{ item.summary }}
          </div>
        </div>
        <div class="flex gap-8px text-12px color-gray-500">
          <span>{{ item.type }}</span>
          <span>·</span>
          <span>{{ item.createTime }}</span>
        </div>
      </NFlex>
    </div>
    <div class="mt-16px flex justify-center">
      <NPagination
        v-if="tableData.length > 0"
        v-model:page="pagination.current"
        v-model:page-size="pagination.size"
        :page-count="pagination.pageCount"
        :page-sizes="[5, 10, 20]"
        show-size-picker
        @update:page="getTableData"
        @update:page-size="getTableData"
      />
    </div>

    <!-- 暂无数据 -->
    <div v-if="tableData.length === 0" class="text-center text-14px color-gray-500">暂无数据</div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { fetchArticleList } from '@/service/api/articles'
import { useRouterPush } from '@/hooks/common/router'

defineOptions({ name: 'ArticlesList' })

const { routerPush } = useRouterPush()

interface Props {
  modelValue?: string
  modelType?: string
}
const _props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  modelType: 'All',
})

const tableData = ref<Api.Article.ArticleDetail[]>([])

// 分页
const pagination = ref({
  current: 1,
  size: 10,
  pageCount: 0,
})

const getTableData = async () => {
  const { data, error } = await fetchArticleList()
  if (error) {
    console.error(error)
    return
  }

  tableData.value = data.list || []

  pagination.value.pageCount = Math.max(1, Math.ceil(tableData.value.length / pagination.value.size))
}

const handleClick = (id: string) => {
  routerPush({ path: `/article/${id}` })
}

onMounted(() => {
  getTableData()
})
</script>

<style scoped></style>
