<script setup lang="ts">
import { h, onMounted, reactive, ref } from 'vue'
import { NButton, NPopconfirm, NSpace, NTag } from 'naive-ui'
import { deleteArticle, fetchArticleList } from '@/service/api'
import { useAuthStore } from '@/stores/modules/auth'
import { useRouterPush } from '@/hooks/common/router'
import type { DataTableColumns } from 'naive-ui'

defineOptions({
  name: 'MyArticles',
})

const authStore = useAuthStore()
const { routerPushByKey } = useRouterPush()

const loadingArticles = ref(false)
const articleList = ref<Api.Article.Article[]>([])
const articlePagination = reactive({
  page: 1,
  pageSize: 10,
  itemCount: 0,
  prefix: ({ itemCount }: { itemCount?: number }) => `共 ${itemCount} 条`,
})

function formatDate(dateStr?: string) {
  if (!dateStr) return '-'
  const d = new Date(dateStr)
  if (Number.isNaN(d.getTime())) return '-'
  return d.toLocaleString('zh-CN')
}

async function fetchMyArticles() {
  loadingArticles.value = true
  try {
    const { data, error } = await fetchArticleList({
      current: articlePagination.page,
      size: articlePagination.pageSize,
      authorId: authStore.userInfo.id,
    })
    if (!error && data) {
      articleList.value = data.records
      articlePagination.itemCount = data.total
    }
  } finally {
    loadingArticles.value = false
  }
}

function handleEditArticle(id: number) {
  routerPushByKey('article-edit', { query: { id: String(id) } })
}

async function handleDeleteArticle(id: number) {
  try {
    const { error } = await deleteArticle([id])
    if (!error) {
      window.$message?.success('删除成功')
      fetchMyArticles()
    }
  } catch (_) {
    window.$message?.error('删除失败')
  }
}

function handlePageChange(page: number) {
  articlePagination.page = page
  fetchMyArticles()
}

const articleColumns: DataTableColumns<Api.Article.Article> = [
  {
    title: '标题',
    key: 'title',
    width: 200,
    ellipsis: {
      tooltip: true,
    },
  },
  {
    title: '状态',
    key: 'status',
    width: 100,
    render(row) {
      return h(
        NTag,
        {
          type: row.status === 'published' ? 'success' : 'warning',
          size: 'small',
        },
        {
          default: () => (row.status === 'published' ? '已发布' : '草稿'),
        },
      )
    },
  },
  {
    title: '发布时间',
    key: 'createdAt',
    width: 180,
    render(row) {
      return formatDate(row.createdAt)
    },
  },
  {
    title: '阅读/点赞',
    key: 'stats',
    width: 120,
    render(row) {
      return `${row.views} / ${row.likes}`
    },
  },
  {
    title: '操作',
    key: 'actions',
    width: 150,
    render(row) {
      return h(NSpace, null, {
        default: () => [
          h(
            NButton,
            {
              size: 'small',
              type: 'primary',
              secondary: true,
              onClick: () => handleEditArticle(row.id),
            },
            { default: () => '编辑' },
          ),
          h(
            NPopconfirm,
            {
              onPositiveClick: () => handleDeleteArticle(row.id),
            },
            {
              default: () => '确认删除该文章吗？',
              trigger: () =>
                h(
                  NButton,
                  {
                    size: 'small',
                    type: 'error',
                    secondary: true,
                  },
                  { default: () => '删除' },
                ),
            },
          ),
        ],
      })
    },
  },
]

onMounted(() => {
  fetchMyArticles()
})
</script>

<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-lg font-semibold text-gray-800">文章管理</h2>
      <NButton type="primary" @click="routerPushByKey('article-edit')">
        <SvgIcon icon="ph:plus" class="mr-1" />
        写文章
      </NButton>
    </div>

    <NDataTable
      :columns="articleColumns"
      :data="articleList"
      :loading="loadingArticles"
      :pagination="articlePagination"
      @update:page="handlePageChange"
      :bordered="false"
    />
  </div>
</template>
