<script setup lang="ts">
import { computed } from 'vue'
import { type FormRules, NButton, NForm, NFormItem, NInput, NSelect, NUpload, type UploadCustomRequestOptions } from 'naive-ui'
import { useAuthStore } from '@/stores/modules/auth'

interface Props {
  model: Api.Article.CreateArticleDto
  categories: { label: string; value: number }[]
  rules?: FormRules
  handleUpload: (options: UploadCustomRequestOptions) => void
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'openCreateCategory'): void
  (e: 'update:model', value: Api.Article.CreateArticleDto): void
}>()

const localModel = computed({
  get: () => props.model,
  set: (val) => emit('update:model', val),
})

const authStore = useAuthStore()
</script>

<template>
  <div class="h-full flex flex-col bg-gray-50 dark:bg-[#1c1c20] overflow-hidden">
    <div class="p-4 font-medium text-base border-b border-gray-100 dark:border-gray-800 shrink-0">文章设置</div>

    <div class="p-4 flex-1 overflow-y-auto">
      <NForm :model="localModel" :rules="rules" label-placement="top" size="medium">
        <NFormItem label="分类" path="categoryId">
          <div class="flex gap-2 w-full">
            <NSelect
              v-model:value="localModel.categoryId"
              :options="categories"
              placeholder="选择分类"
              filterable
              clearable
              class="flex-1"
            />
            <NButton secondary @click="emit('openCreateCategory')" title="新建分类">
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
            v-model:value="localModel.summary"
            type="textarea"
            placeholder="文章摘要（可选）"
            :autosize="{ minRows: 3, maxRows: 6 }"
          />
        </NFormItem>

        <NFormItem label="封面图" path="cover">
          <div class="w-full flex flex-col gap-2">
            <NInput v-model:value="localModel.cover" placeholder="输入图片 URL" />
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
          v-if="localModel.cover"
          class="mb-6 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 aspect-video bg-gray-100 dark:bg-gray-800 flex items-center justify-center"
        >
          <img :src="localModel.cover" class="w-full h-full object-cover" />
        </div>

        <NFormItem label="置顶" path="isFeatured">
          <NSelect
            v-model:value="localModel.isFeatured"
            :options="[
              { label: '不置顶', value: 0 },
              { label: '置顶', value: 1 },
            ]"
          />
        </NFormItem>
      </NForm>
    </div>

    <div class="p-4 text-xs text-gray-400 text-center border-t border-gray-100 dark:border-gray-800 shrink-0">
      {{ authStore.userInfo.nickname || authStore.userInfo.auth.username }}
    </div>
  </div>
</template>

<style scoped>
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
