<template>
  <div class="flex-col gap-16px">
    <div class="flex justify-between items-center">
      <div class="text-18px font-600">我的文章</div>
    </div>

    <NButton type="primary" @click="openCreate">新建文章</NButton>

    <div v-if="filteredList.length > 0">
      <NDataTable
        :columns="columns"
        :data="filteredList"
        :pagination="pagination"
        :row-key="(row) => row.id"
        class="bg-white dark:bg-gray-900 rd-10px"
      />
    </div>

    <div v-else class="text-center text-14px color-gray-500">暂无数据</div>
  </div>
</template>

<script setup lang="ts">
import { computed, h, onMounted, ref } from 'vue'
import { deleteArticle, fetchArticleList } from '@/service/api/articles'
import { useAuthStore } from '@/stores/modules/auth'
import { useRouterPush } from '@/hooks/common/router'
import type { DataTableColumns } from 'naive-ui'

defineOptions({ name: 'MyArticles' })

const { routerPush } = useRouterPush()
const authStore = useAuthStore()

const list = ref<Api.Article.ArticleDetail[]>([])

const pagination = ref({ page: 1, pageSize: 10, showSizePicker: true, pageSizes: [5, 10, 20] })

const filteredList = computed(() => {
  const uid = authStore.userInfo.userId
  if (!uid) return list.value
  return list.value.filter((it) => it.authorId === uid)
})

function viewArticle(id: string) {
  routerPush({ path: `/article/${id}` })
}

function openCreate() {
  routerPush({ path: '/editor' })
}

function openEdit(id: string) {
  routerPush({ path: '/editor', query: { id } })
}

async function getList() {
  const { data, error, message } = await fetchArticleList()
  if (error) {
    window.$message?.error(message || '获取列表失败')
    return
  }
  list.value = data.list || []
}

function confirmDelete(id: string) {
  window.$dialog?.warning({
    title: '提示',
    content: '确认删除该文章？',
    positiveText: '删除',
    negativeText: '取消',
    onPositiveClick: async () => {
      const { error, message } = await deleteArticle(id)
      if (error) {
        window.$message?.error(message || '删除失败')
        return
      }
      window.$message?.success('删除成功')
      await getList()
    },
  })
}

const columns = ref<DataTableColumns<Api.Article.ArticleDetail>>([
  {
    title: '标题',
    key: 'title',
    render: (row) =>
      h(
        'a',
        {
          class: 'color-primary cursor-pointer',
          onClick: () => viewArticle(row.id),
        },
        row.title,
      ),
  },
  {
    title: '摘要',
    key: 'summary',
  },
  {
    title: '类型',
    key: 'type',
  },
  {
    title: '创建时间',
    key: 'createTime',
  },
  {
    title: '操作',
    key: 'actions',
    render: (row) =>
      h('div', { class: 'flex gap-8px' }, [
        h(
          'button',
          {
            class: 'n-button n-button--default n-button--size-small',
            onClick: () => openEdit(row.id),
          },
          '编辑',
        ),
        h(
          'button',
          {
            class: 'n-button n-button--error n-button--size-small n-button--ghost',
            onClick: () => confirmDelete(row.id),
          },
          '删除',
        ),
      ]),
  },
])

onMounted(() => {
  getList()
})
</script>

<style scoped></style>
