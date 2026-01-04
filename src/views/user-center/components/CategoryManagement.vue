<script setup lang="ts">
import { h, onMounted, reactive, ref } from 'vue'
import {
  type FormInst,
  type FormRules,
  NButton,
  NColorPicker,
  NDataTable,
  NForm,
  NFormItem,
  NInput,
  NInputNumber,
  NModal,
  NPopconfirm,
  NSpace,
  NTag,
  useMessage,
} from 'naive-ui'
import { createCategory, deleteCategory, fetchCategoryList, updateCategory } from '@/service/api'
import type { DataTableColumns } from 'naive-ui'

defineOptions({
  name: 'CategoryManagement',
})

const message = useMessage()

// 列表数据
const loading = ref(false)
const categoryList = ref<Api.Category.Category[]>([])

// 模态框控制
const showModal = ref(false)
const modalType = ref<'create' | 'edit'>('create')
const modalLoading = ref(false)

// 表单数据
const formRef = ref<FormInst | null>(null)
const formModel = reactive<Api.Category.CreateCategoryDto & { id?: number }>({
  name: '',
  code: '',
  color: '#6366f1',
  sortOrder: 0,
})

// 表单规则
const rules: FormRules = {
  name: [
    { required: true, message: '请输入分类名称', trigger: 'blur' },
    { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' },
  ],
  code: [
    { required: true, message: '请输入分类代码', trigger: 'blur' },
    { pattern: /^[a-zA-Z0-9_]+$/, message: '只能包含字母、数字和下划线', trigger: 'blur' },
  ],
  sortOrder: [{ required: true, type: 'number', message: '请输入排序号', trigger: 'blur' }],
}

// 获取列表
async function fetchData() {
  loading.value = true
  try {
    const { data, error } = await fetchCategoryList()
    if (!error && data) {
      categoryList.value = data
    }
  } finally {
    loading.value = false
  }
}

// 打开新增模态框
function handleAdd() {
  modalType.value = 'create'
  formModel.id = undefined
  formModel.name = ''
  formModel.code = ''
  formModel.color = '#6366f1'
  formModel.sortOrder = categoryList.value.length + 1
  showModal.value = true
}

// 打开编辑模态框
function handleEdit(row: Api.Category.Category) {
  modalType.value = 'edit'
  formModel.id = row.id
  formModel.name = row.name
  formModel.code = row.code
  formModel.color = row.color || '#6366f1'
  formModel.sortOrder = row.sortOrder
  showModal.value = true
}

// 提交表单
async function handleSubmit() {
  await formRef.value?.validate()

  modalLoading.value = true
  try {
    if (modalType.value === 'create') {
      const { error } = await createCategory({
        name: formModel.name,
        code: formModel.code,
        color: formModel.color,
        sortOrder: formModel.sortOrder,
      })
      if (!error) {
        message.success('创建成功')
        showModal.value = false
        fetchData()
      }
    } else {
      if (!formModel.id) return
      const { error } = await updateCategory(formModel.id, {
        name: formModel.name,
        code: formModel.code,
        color: formModel.color,
        sortOrder: formModel.sortOrder,
      })
      if (!error) {
        message.success('更新成功')
        showModal.value = false
        fetchData()
      }
    }
  } finally {
    modalLoading.value = false
  }
}

// 删除分类
async function handleDelete(id: number) {
  try {
    const { error } = await deleteCategory([id])
    if (!error) {
      message.success('删除成功')
      fetchData()
    }
  } catch {
    message.error('删除失败')
  }
}

// 表格列定义
const columns: DataTableColumns<Api.Category.Category> = [
  {
    title: '名称',
    key: 'name',
    width: 150,
  },
  {
    title: '代码',
    key: 'code',
    width: 150,
    render(row: Api.Category.Category) {
      return h(
        NTag,
        {
          color: { color: row.color ? `${row.color}20` : undefined, textColor: row.color, borderColor: row.color },
          bordered: true,
          size: 'small',
        },
        { default: () => row.code },
      )
    },
  },
  {
    title: '颜色',
    key: 'color',
    width: 100,
    render(row: Api.Category.Category) {
      return row.color
        ? h('div', {
            style: {
              width: '20px',
              height: '20px',
              backgroundColor: row.color,
              borderRadius: '4px',
              border: '1px solid #ddd',
            },
          })
        : '-'
    },
  },
  {
    title: '排序',
    key: 'sortOrder',
    width: 100,
  },
  {
    title: '文章数',
    key: 'count',
    width: 100,
  },
  {
    title: '操作',
    key: 'actions',
    width: 150,
    render(row: Api.Category.Category) {
      return h(NSpace, null, {
        default: () => [
          h(
            NButton,
            {
              size: 'small',
              type: 'primary',
              secondary: true,
              onClick: () => handleEdit(row),
            },
            { default: () => '编辑' },
          ),
          h(
            NPopconfirm,
            {
              onPositiveClick: () => handleDelete(row.id),
            },
            {
              default: () => `确认删除分类 "${row.name}" 吗？此操作可能影响关联的文章。`,
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
  fetchData()
})
</script>

<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-lg font-semibold text-gray-800">分类管理</h2>
      <NButton type="primary" @click="handleAdd">
        <div class="i-ph-plus mr-1"></div>
        新增分类
      </NButton>
    </div>

    <NDataTable :columns="columns" :data="categoryList" :loading="loading" :bordered="false" :pagination="{ pageSize: 10 }" />

    <NModal v-model:show="showModal" preset="card" :title="modalType === 'create' ? '新增分类' : '编辑分类'" class="w-[500px]">
      <NForm ref="formRef" :model="formModel" :rules="rules" label-placement="left" label-width="80" require-mark-placement="right-hanging">
        <NFormItem label="名称" path="name">
          <NInput v-model:value="formModel.name" placeholder="请输入分类名称" />
        </NFormItem>
        <NFormItem label="代码" path="code">
          <NInput v-model:value="formModel.code" placeholder="Category_XXX" />
        </NFormItem>
        <NFormItem label="颜色" path="color">
          <NColorPicker v-model:value="formModel.color" />
        </NFormItem>
        <NFormItem label="排序" path="sortOrder">
          <NInputNumber v-model:value="formModel.sortOrder" class="w-full" />
        </NFormItem>
      </NForm>
      <template #footer>
        <NSpace justify="end">
          <NButton @click="showModal = false">取消</NButton>
          <NButton type="primary" :loading="modalLoading" @click="handleSubmit">确定</NButton>
        </NSpace>
      </template>
    </NModal>
  </div>
</template>
