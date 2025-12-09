<template>
  <div class="flex-col gap-16px">
    <div class="card-wrapper bg-white dark:bg-gray-900 p-20px rd-10px flex items-center justify-between gap-16px">
      <div class="flex items-center gap-12px flex-1">
        <NInput v-model:value="form.title" placeholder="请输入标题" class="w-100%" />
        <NSelect v-model:value="form.visibility" :options="visibilityOptions" class="w-160px" />
      </div>
      <div class="flex gap-8px">
        <NButton @click="backToList">返回列表</NButton>
        <NButton type="primary" @click="submit">{{ isEdit ? '保存' : '创建' }}</NButton>
      </div>
    </div>
    <div class="flex gap-16px">
      <div class="card-wrapper bg-white dark:bg-gray-900 p-20px rd-10px flex-1">
        <MdEditorWrapper v-model="form.contentMd" />
      </div>
      <div class="card-wrapper bg-white dark:bg-gray-900 p-20px rd-10px min-w-360px flex flex-col">
        <NForm :model="form" label-placement="left">
          <NFormItem label="摘要">
            <NInput v-model:value="form.summary" type="textarea" placeholder="请输入摘要" />
          </NFormItem>
          <NFormItem label="类型">
            <NInput v-model:value="form.type" placeholder="请输入类型（如：技术、随笔）" />
          </NFormItem>
          <NFormItem label="标签">
            <NInput v-model:value="tagsInput" placeholder="用逗号分隔多个标签" />
          </NFormItem>
          <NFormItem label="封面">
            <NInput v-model:value="form.cover" placeholder="请输入封面地址" />
          </NFormItem>
        </NForm>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import MdEditorWrapper from '@/components/custom/md-editor.vue'
import { createArticle, fetchArticleDetail, updateArticle } from '@/service/api/articles'
import { useRouterPush } from '@/hooks/common/router'

defineOptions({ name: 'ArticleEdit' })

const { routerBack } = useRouterPush()
const route = useRoute()

const id = ref<string>('')
const isEdit = ref(false)

const form = ref<Api.Article.CreateArticleRequest>({
  title: '',
  contentMd: '',
  cover: '',
  tags: [],
  summary: '',
  type: '',
  visibility: '1',
})

const tagsInput = ref('')

const visibilityOptions = [
  { label: '公开', value: '1' },
  { label: '私密', value: '2' },
]

function backToList() {
  routerBack()
}

async function init() {
  const qid = (route.query.id as string) || ''
  id.value = qid
  isEdit.value = !!qid
  if (!qid) return
  const { data, error, message } = await fetchArticleDetail(qid)
  if (error) {
    window.$message?.error(message || '获取详情失败')
    return
  }
  form.value = {
    title: data.title,
    contentMd: data.contentMd,
    cover: data.cover,
    tags: data.tags,
    summary: data.summary,
    type: data.type,
    visibility: data.visibility,
  }
  tagsInput.value = (data.tags || []).join(',')
}

async function submit() {
  if (!form.value.title?.trim()) {
    window.$message?.warning('请输入标题')
    return
  }
  if (!form.value.contentMd?.trim()) {
    window.$message?.warning('请输入内容')
    return
  }

  form.value.tags = tagsInput.value
    .split(',')
    .map((t) => t.trim())
    .filter((t) => !!t)

  if (isEdit.value) {
    const { error, message } = await updateArticle(id.value, form.value)
    if (error) {
      window.$message?.error(message || '更新失败')
      return
    }
    window.$message?.success('更新成功')
  } else {
    const { error, message } = await createArticle(form.value)
    if (error) {
      window.$message?.error(message || '创建失败')
      return
    }
    window.$message?.success('创建成功')
  }
  backToList()
}

onMounted(() => {
  init()
})
</script>

<style scoped></style>
