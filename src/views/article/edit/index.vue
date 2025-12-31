<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { useRoute } from 'vue-router'
import {
  type FormRules,
  NButton,
  NForm,
  NFormItem,
  NInput,
  NModal,
  NSelect,
  NSpace,
  NSpin,
  NUpload,
  type UploadCustomRequestOptions,
  useMessage,
} from 'naive-ui'
import { createArticle, createCategory, fetchArticleDetail, fetchCategoryList, updateArticle, uploadFile } from '@/service/api'
import { useAuthStore } from '@/stores/modules/auth'
import { useThemeStore } from '@/stores/modules/theme'
import 'md-editor-v3/lib/style.css'
import { useRouterPush } from '@/hooks/common/router'
import { MdEditor } from 'md-editor-v3'

defineOptions({
  name: 'ArticleEdit',
})

const route = useRoute()
const message = useMessage()
const { routerPushByKey } = useRouterPush()
const authStore = useAuthStore()
const themeStore = useThemeStore()

const loading = ref(false)
const submitting = ref(false)

const isEdit = computed(() => !!route.query.id)
const articleId = computed(() => route.query.id as string)
const editorTheme = computed(() => (themeStore.darkMode ? 'dark' : 'light'))

const formRef = ref()
const model = reactive<Api.Article.CreateArticleDto>({
  title: '',
  content: '',
  summary: '',
  categoryId: null, // 将被选择
  status: 'draft', // 'draft' | 'published'
  cover: '',
  isFeatured: 0,
})

const categories = ref<{ label: string; value: number }[]>([])

// 侧边栏表单规则（可选字段或侧边栏字段）
const rules: FormRules = {
  categoryId: [
    {
      required: true,
      type: 'number',
      message: '请选择文章分类',
      trigger: 'change',
    },
  ],
}

// 分类创建逻辑
const showCreateCategory = ref(false)
const newCategoryName = ref('')
const createCategoryLoading = ref(false)

function openCreateCategory() {
  newCategoryName.value = ''
  showCreateCategory.value = true
}

async function handleConfirmCreateCategory() {
  if (!newCategoryName.value.trim()) return

  createCategoryLoading.value = true
  try {
    // 生成随机的 Code: Category_ + 6位随机字母数字
    const randomSuffix = Math.random().toString(36).substring(2, 8).toUpperCase()
    const categoryCode = `Category_${randomSuffix}`

    const { data, error } = await createCategory({
      name: newCategoryName.value,
      code: categoryCode,
      colorClass: 'bg-blue-500 text-white',
      sortOrder: categories.value.length + 1,
    })

    if (!error && data) {
      const newOption = { label: data.name, value: data.id }
      categories.value.push(newOption)
      model.categoryId = data.id
      message.success('分类创建成功')
      showCreateCategory.value = false
    } else {
      message.error('分类创建失败')
    }
  } catch {
    message.error('分类创建异常')
  } finally {
    createCategoryLoading.value = false
  }
}

async function handleUpload({ file, onFinish, onError }: UploadCustomRequestOptions) {
  if (!file.file) return

  try {
    const { data, error } = await uploadFile(file.file, 'Article Cover', 1)
    if (!error && data) {
      model.cover = data.downloadUrl
      onFinish()
      message.success('上传成功')
    } else {
      onError()
      message.error('上传失败')
    }
  } catch {
    onError()
    message.error('上传异常')
  }
}

async function initData() {
  loading.value = true
  try {
    const { data, error } = await fetchCategoryList()
    if (!error && data) {
      categories.value = data.map((item) => ({
        label: item.name,
        value: item.id,
      }))
    }

    if (isEdit.value) {
      const { data: articleData, error: articleError } = await fetchArticleDetail(articleId.value)
      if (!articleError && articleData) {
        model.title = articleData.title
        model.content = articleData.content
        model.summary = articleData.summary
        model.categoryId = articleData.categoryId
        model.status = articleData.status
        model.cover = articleData.cover
        model.isFeatured = articleData.isRecommend
      }
    }
  } finally {
    loading.value = false
  }
}

async function handleSubmit(status: Api.Article.ArticleStatus) {
  // 手动验证标题和内容
  if (!model.title.trim()) {
    message.warning('请输入文章标题')
    return
  }
  if (!model.content.trim()) {
    message.warning('请输入文章内容')
    return
  }
  if (!model.categoryId) {
    message.warning('请选择文章分类')
    return
  }

  submitting.value = true
  try {
    model.status = status
    model.categoryId = Number(model.categoryId)

    if (isEdit.value) {
      const { error } = await updateArticle(articleId.value, model)
      if (!error) {
        message.success(status === 'published' ? '更新并发布成功' : '草稿更新成功')
        routerPushByKey('home')
      }
    } else {
      const { error } = await createArticle(model)
      if (!error) {
        message.success(status === 'published' ? '发布成功' : '草稿保存成功')
        routerPushByKey('home')
      }
    }
  } finally {
    submitting.value = false
  }
}

onMounted(() => {
  initData()
})
</script>

<template>
  <div class="h-full flex flex-col bg-white dark:bg-[#18181c] overflow-hidden">
    <!-- 顶部栏 -->
    <div
      class="h-16 px-6 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between shrink-0 z-10 bg-white dark:bg-[#18181c]"
    >
      <div class="flex-1 mr-8">
        <input
          v-model="model.title"
          type="text"
          placeholder="输入文章标题..."
          class="w-full text-2xl font-bold bg-transparent border-none outline-none placeholder-gray-400 dark:text-white"
        />
      </div>
      <NSpace>
        <div class="text-gray-400 text-sm flex items-center mr-2" v-if="submitting">
          <div class="i-line-md-loading-twotone-loop text-lg mr-1"></div>
          保存中...
        </div>
        <NButton :loading="submitting" @click="handleSubmit('draft')">保存草稿</NButton>
        <NButton type="primary" :loading="submitting" @click="handleSubmit('published')">发布</NButton>
      </NSpace>
    </div>

    <!-- 主要内容区域 -->
    <div class="flex-1 overflow-hidden relative">
      <NSpin :show="loading" class="h-full">
        <div class="h-full flex">
          <!-- 编辑器区域 -->
          <div class="flex-1 overflow-hidden relative">
            <MdEditor
              v-model="model.content"
              :theme="editorTheme"
              class="h-full w-full !border-none"
              placeholder="开始创作..."
              :toolbars-exclude="['github', 'save']"
              no-upload-img
            />
          </div>

          <!-- 右侧设置栏 -->
          <div
            class="w-80 h-full border-l border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-[#1c1c20] overflow-y-auto shrink-0 flex flex-col"
          >
            <div class="p-4 font-medium text-base border-b border-gray-100 dark:border-gray-800">文章设置</div>

            <div class="p-4 flex-1">
              <NForm ref="formRef" :model="model" :rules="rules" label-placement="top" size="medium">
                <NFormItem label="分类" path="categoryId">
                  <div class="flex gap-2 w-full">
                    <NSelect
                      v-model:value="model.categoryId"
                      :options="categories"
                      placeholder="选择分类"
                      filterable
                      clearable
                      class="flex-1"
                    />
                    <NButton secondary @click="openCreateCategory" title="新建分类">
                      <template #icon>
                        <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
                          <path fill="currentColor" d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6z" />
                        </svg>
                      </template>
                    </NButton>
                  </div>
                </NFormItem>

                <NFormItem label="摘要" path="summary">
                  <NInput
                    v-model:value="model.summary"
                    type="textarea"
                    placeholder="文章摘要（可选）"
                    :autosize="{ minRows: 3, maxRows: 6 }"
                  />
                </NFormItem>

                <NFormItem label="封面图" path="cover">
                  <div class="w-full flex flex-col gap-2">
                    <NInput v-model:value="model.cover" placeholder="输入图片 URL" />
                    <NUpload action="#" :custom-request="handleUpload" :show-file-list="false" accept="image/*">
                      <NButton block secondary>
                        <template #icon>
                          <div class="i-carbon-upload" />
                        </template>
                        上传图片
                      </NButton>
                    </NUpload>
                  </div>
                </NFormItem>

                <div
                  v-if="model.cover"
                  class="mb-6 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 aspect-video bg-gray-100 dark:bg-gray-800 flex items-center justify-center"
                >
                  <img :src="model.cover" class="w-full h-full object-cover" @error="model.cover = ''" />
                </div>

                <NFormItem label="置顶" path="isFeatured">
                  <NSelect
                    v-model:value="model.isFeatured"
                    :options="[
                      { label: '不置顶', value: 0 },
                      { label: '置顶', value: 1 },
                    ]"
                  />
                </NFormItem>
              </NForm>
            </div>

            <div class="p-4 text-xs text-gray-400 text-center border-t border-gray-100 dark:border-gray-800">
              {{ authStore.userInfo.nickname || authStore.userInfo.auth.username }}
            </div>
          </div>
        </div>
      </NSpin>
    </div>

    <!-- 创建分类弹窗 -->
    <NModal
      v-model:show="showCreateCategory"
      preset="dialog"
      title="新建分类"
      positive-text="确认"
      negative-text="取消"
      @positive-click="handleConfirmCreateCategory"
      @negative-click="showCreateCategory = false"
      :loading="createCategoryLoading"
    >
      <div class="py-2">
        <NInput v-model:value="newCategoryName" placeholder="请输入分类名称" @keyup.enter="handleConfirmCreateCategory" autofocus />
      </div>
    </NModal>
  </div>
</template>

<style scoped>
/* 编辑器自定义 */
:deep(.md-editor) {
  --md-bk-color: transparent;
  height: 100%;
}

:deep(.md-editor-toolbar-wrapper) {
  border-bottom: 1px solid #efeff5;
  padding: 0 16px;
}

:deep(.md-editor-content-wrapper) {
  padding: 0;
}

/* 编辑器深色模式调整 */
.dark :deep(.md-editor-toolbar-wrapper) {
  border-bottom: 1px solid #2d2d30;
}

/* 侧边栏滚动条样式 */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
::-webkit-scrollbar-track {
  background: transparent;
}
::-webkit-scrollbar-thumb {
  background: rgba(144, 147, 153, 0.3);
  border-radius: 3px;
}
::-webkit-scrollbar-thumb:hover {
  background: rgba(144, 147, 153, 0.5);
}
</style>
