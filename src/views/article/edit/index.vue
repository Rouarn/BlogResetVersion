<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import {
  type FormRules,
  NButton,
  NDrawer,
  NDrawerContent,
  NInput,
  NModal,
  NPopconfirm,
  NSpace,
  NSpin,
  type UploadCustomRequestOptions,
  useMessage,
} from 'naive-ui'
import ArticleSetting from './components/ArticleSetting.vue'
import { createArticle, createCategory, fetchArticleDetail, fetchCategoryList, updateArticle, uploadFile } from '@/service/api'
import { useAppStore } from '@/stores/modules/app'
import { useAuthStore } from '@/stores/modules/auth'
import { useThemeStore } from '@/stores/modules/theme'
import { localStg } from '@/utils/storage'
import 'md-editor-v3/lib/style.css'
import { useRouterPush } from '@/hooks/router'
import { MdEditor } from 'md-editor-v3'

defineOptions({
  name: 'ArticleEdit',
})

const route = useRoute()
const message = useMessage()
const { routerPushByKey } = useRouterPush()
const themeStore = useThemeStore()
const appStore = useAppStore()
const authStore = useAuthStore()

const loading = ref(false)
const submitting = ref(false)
const showSettings = ref(false)

const isEdit = computed(() => !!route.query.id)
const articleId = computed(() => route.query.id as string)
const editorTheme = computed(() => (themeStore.darkMode ? 'dark' : 'light'))

// 缓存 Key: article_draft_{userId}
const cacheKey = computed(() => (authStore.userInfo.id ? `article_draft_${authStore.userInfo.id}` : null))

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
const newCategoryColor = ref('#6366f1')
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
      color: newCategoryColor.value,
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
        model.cover = articleData.cover?.replace(/[`\s]/g, '') || ''
        model.isFeatured = articleData.isFeatured
      }
    } else if (cacheKey.value) {
      // 只有在新增模式下，才尝试恢复本地缓存
      const cached = localStg.get(cacheKey.value as keyof StorageType.Local) as Api.Article.CreateArticleDto
      if (cached) {
        model.title = cached.title || ''
        model.content = cached.content || ''
        model.summary = cached.summary || ''
        model.categoryId = cached.categoryId || null
        model.status = cached.status || 'draft'
        model.cover = cached.cover || ''
        model.isFeatured = cached.isFeatured || 0
        message.info('已恢复上次未保存的草稿')
      }
    }
  } finally {
    loading.value = false
  }
}

// 重置（清空）编辑器和缓存
function handleReset() {
  model.title = ''
  model.content = ''
  model.summary = ''
  model.categoryId = null
  model.status = 'draft'
  model.cover = ''
  model.isFeatured = 0

  if (cacheKey.value) {
    localStg.remove(cacheKey.value as keyof StorageType.Local)
    message.success('已清空内容和缓存')
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
        // 发布成功后，清除本地缓存
        if (cacheKey.value) {
          localStg.remove(cacheKey.value as keyof StorageType.Local)
        }
        routerPushByKey('home')
      }
    }
  } finally {
    submitting.value = false
  }
}

// 自动保存草稿到本地缓存（仅限新增文章）
const watchModel = watch(
  model,
  (newVal) => {
    if (!isEdit.value && cacheKey.value) {
      localStg.set(cacheKey.value as keyof StorageType.Local, newVal)
    }
  },
  { deep: true },
)

onMounted(() => {
  initData()
})

onUnmounted(() => {
  watchModel()
})
</script>

<template>
  <div class="h-full flex flex-col bg-white dark:bg-[#18181c] overflow-hidden">
    <!-- 顶部栏 -->
    <div
      class="px-6 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between shrink-0 z-10 bg-white dark:bg-[#18181c]"
      :class="[appStore.isMobile ? 'flex-col' : 'h-16']"
    >
      <div class="flex-1 mr-8" :class="appStore.isMobile ? 'py-2' : ''">
        <input
          v-model="model.title"
          type="text"
          placeholder="输入文章标题..."
          class="w-full text-2xl font-bold bg-transparent border-none outline-none placeholder-gray-400 dark:text-white"
        />
      </div>
      <NSpace align="center" :class="appStore.isMobile ? 'w-full justify-end! pb-2' : ''">
        <div class="text-gray-400 text-sm flex items-center mr-2" v-if="submitting">
          <div class="i-line-md-loading-twotone-loop text-lg mr-1"></div>
          保存中...
        </div>
        <!-- 重置按钮（仅在新增模式显示） -->
        <NPopconfirm v-if="!isEdit" @positive-click="handleReset">
          <template #trigger>
            <NButton secondary type="error">重置</NButton>
          </template>
          确定要清空当前内容和本地缓存吗？此操作无法撤销。
        </NPopconfirm>

        <NPopconfirm @positive-click="handleSubmit('draft')">
          <template #trigger>
            <NButton :loading="submitting">保存草稿</NButton>
          </template>
          是否确认保存草稿？
        </NPopconfirm>

        <NPopconfirm @positive-click="handleSubmit('published')">
          <template #trigger>
            <NButton type="primary" :loading="submitting">发布</NButton>
          </template>
          是否确认发布文章？
        </NPopconfirm>

        <!-- 移动端设置按钮 -->
        <ButtonIcon v-if="appStore.isMobile" @click="showSettings = true" secondary circle icon="ph:gear-six-bold" />
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
              placeholder="开始创作..."
              :toolbars-exclude="['github', 'save']"
              no-upload-img
            />
          </div>

          <!-- 右侧设置栏 (桌面端) -->
          <ArticleSetting
            v-if="!appStore.isMobile"
            class="w-80 border-l border-gray-100 dark:border-gray-800 shrink-0"
            v-model:model="model"
            :categories="categories"
            :rules="rules"
            :handle-upload="handleUpload"
            @open-create-category="openCreateCategory"
          />
        </div>
      </NSpin>
    </div>

    <!-- 移动端设置抽屉 -->
    <NDrawer v-if="appStore.isMobile" v-model:show="showSettings" width="320" placement="right">
      <NDrawerContent body-content-style="padding: 0">
        <ArticleSetting
          class="h-full"
          v-model:model="model"
          :categories="categories"
          :rules="rules"
          :handle-upload="handleUpload"
          @open-create-category="openCreateCategory"
        />
      </NDrawerContent>
    </NDrawer>

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
        <!-- 分类颜色选择器 -->
        <NColorPicker v-model:value="newCategoryColor" class="mt-2" />
      </div>
    </NModal>
  </div>
</template>

<style scoped>
/* 编辑器自定义 */
:deep(.md-editor) {
  --md-bk-color: transparent;
  min-height: 650px;
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
</style>
