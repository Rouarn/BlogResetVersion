<template>
  <NModal v-model:show="modalShow" :mask-closable="maskClosable">
    <!--
    组件：CroppingImage（基于 vue-cropper 的图片裁剪弹窗）
    结构：模态框 -> 工作台（左：裁剪器 | 右：实时预览） -> 工具栏
    交互：选择图片 -> 设置比例/旋转/缩放 -> 实时预览 -> 确认裁剪
    事件：done（完成）、preview（预览）、error（错误）、clear（清空）、v-model 同步
  -->
    <div class="cutter flex-col gap-12px">
      <NSpace justify="space-between">
        <!-- 弹窗标题 -->
        <div class="croppertitle text-14px font-medium">
          {{ croppertitle }}
        </div>
        <!-- 关闭按钮 -->
        <NButton type="primary" size="small" block ghost :bordered="false" @click="closeCropper">
          <icon-mdi-close class="text-20px" />
        </NButton>
      </NSpace>

      <!-- 裁剪与预览区 -->
      <div class="workbench grid gap-12px md:grid-cols-[1fr_minmax(220px,0.35fr)]">
        <!-- 裁剪器容器：当存在图片时渲染裁剪器，否则展示占位提示 -->
        <div class="cropper-wrap">
          <VueCropper
            v-if="option.img"
            :key="option.img"
            ref="cropperRef"
            :img="option.img"
            :output-size="option.outputSize"
            :output-type="option.outputType"
            :info="option.info"
            :can-scale="option.canScale"
            :auto-crop="option.autoCrop"
            :auto-crop-width="option.autoCropWidth"
            :auto-crop-height="option.autoCropHeight"
            :fixed="option.fixed"
            :fixed-number="option.fixedNumber"
            :full="option.full"
            :fixed-box="option.fixedBox"
            :can-move="option.canMove"
            :can-move-box="option.canMoveBox"
            :original="option.original"
            :center-box="option.centerBox"
            :high="option.high"
            :info-true="option.infoTrue"
            :max-img-size="option.maxImgSize"
            @img-load="onImgLoad"
            @real-time="onRealTime"
          />

          <div v-else class="placeholder flex-center h-260px bg-[rgb(var(--layout-bg-color))]">
            <div class="text-12px text-[rgb(var(--base-text-color)/0.6)]">请选择图片进行裁剪</div>
          </div>
        </div>

        <!-- 实时预览：与裁剪区域同步展示当前裁剪结果和尺寸信息 -->
        <div v-if="showPreview" class="preview-wrap">
          <div class="preview-card">
            <div class="preview-header">裁剪预览</div>
            <div class="preview-body">
              <img v-if="previewUrl" :src="previewUrl" alt="preview" class="preview-img" />
              <div v-else class="preview-empty">暂无预览</div>
            </div>
            <div class="preview-footer text-12px text-[rgb(var(--base-text-color)/0.6)]">
              {{ previewMetaText }}
            </div>
          </div>
        </div>
      </div>

      <!-- 操作工具栏：包含文件选择、比例切换、旋转缩放、确认清空等 -->
      <div class="toolbar flex items-center flex-wrap gap-8px">
        <!-- 文件选择（兼容外部上传组件，可隐藏） -->
        <div v-if="showFileInput" class="upload-btn">
          <input ref="fileInputRef" type="file" :accept="accept" class="hidden" @change="onFileChange" />
          <NButton size="small" secondary @click="triggerFileInput"> 选择图片 </NButton>
        </div>

        <!-- 比例选择 -->
        <NSelect v-model:value="aspect" :options="aspectOptions" size="small" class="w-120px" :to="'body'" @update:value="onAspectChange" />

        <!-- 旋转/缩放操作 -->
        <div class="flex items-center gap-6px">
          <NButton size="small" @click="rotateLeft">左旋90°</NButton>
          <NButton size="small" @click="rotateRight">右旋90°</NButton>
          <NButton size="small" @click="zoomOut">缩小</NButton>
          <NButton size="small" @click="zoomIn">放大</NButton>
          <NButton size="small" tertiary @click="resetCropper">重置</NButton>
        </div>

        <div class="ml-auto flex items-center gap-6px">
          <NButton size="small" type="primary" :disabled="!hasImage" @click="confirmCrop">确认裁剪</NButton>
          <NButton size="small" :disabled="!hasImage" @click="clearImage">清空</NButton>
        </div>
      </div>
    </div>
  </NModal>
</template>

<script setup lang="ts">
import 'vue-cropper/dist/index.css'
import { useDebounceFn } from '@vueuse/core'
import { VueCropper } from 'vue-cropper'

/**
 * CroppingImage：基于 vue-cropper 的图片裁剪组件
 * 功能特性：
 * - 上传/外部传入图片（File/Blob/Base64）
 * - 交互操作（比例、旋转、缩放、重置）
 * - 右侧实时预览（尺寸元信息）
 * - 裁剪输出（Base64 与 Blob）并通过事件回传
 * - 大图按需压缩（简单 Canvas 压缩），减少体积
 */

// 组件名定义，便于调试与 DevTools 展示
defineOptions({ name: 'CroppingImage' })

/** 裁剪比例枚举（'free' 表示自由比例） */
type AspectKey = '1:1' | '4:3' | '16:9' | 'free'
/** 导出图片格式 */
type OutputType = 'jpeg' | 'png' | 'webp'

/** 裁剪完成/实时预览的载荷结构 */
interface EmitDonePayload {
  base64?: string
  blob?: Blob
  fileName?: string
  width?: number
  height?: number
}

/** 组件入参（props） */
interface Props {
  /** 兼容 v-model:show 控制显示 */
  show?: boolean
  /** 弹窗标题 */
  croppertitle?: string
  /** 是否点击遮罩层关闭弹窗 */
  maskClosable?: boolean
  /** 默认裁剪比例 */
  defaultAspect?: AspectKey
  /** 允许的最大文件大小（MB） */
  maxSizeMB?: number
  /** 输出格式 */
  outputType?: OutputType
  /** 输出质量（0.1-1） */
  outputQuality?: number
  /** 是否显示文件选择器（可由外部上传控件驱动） */
  showFileInput?: boolean
  /** 是否显示右侧预览 */
  showPreview?: boolean
  /** 初始图片（来自外部上传控件） */
  modelValue?: string | Blob | File | null
  /** 接受的文件类型 */
  accept?: string
}

const props = withDefaults(defineProps<Props>(), {
  show: false,
  croppertitle: '裁剪头像',
  maskClosable: false,
  defaultAspect: '1:1',
  maxSizeMB: 5,
  outputType: 'jpeg',
  outputQuality: 0.9,
  showFileInput: true,
  showPreview: true,
  modelValue: null,
  accept: 'image/*',
})

const emit = defineEmits<{
  /** 裁剪完成 */
  (e: 'done', payload: EmitDonePayload): void
  /** 选图或裁剪中实时预览 */
  (e: 'preview', payload: EmitDonePayload): void
  /** 发生错误 */
  (e: 'error', msg: string): void
  /** 清空图片 */
  (e: 'clear'): void
  /** v-model 更新 */
  (e: 'update:modelValue', v: string | Blob | File | null): void
  (e: 'update:show', v: boolean): void
}>()

interface CropperApi {
  rotateLeft: () => void
  rotateRight: () => void
  changeScale: (n: number) => void
  clearCrop: () => void
  goAutoCrop: () => void
  getCropData: (cb: (base64: string) => void) => void
  getCropBlob: (cb: (blob: Blob) => void) => void
  cropW?: number
  cropH?: number
}
// 裁剪器实例引用（调用旋转/缩放/裁剪等 API）
const cropperRef = ref<CropperApi | null>(null)
// 文件选择 input 引用（用于触发系统文件选择器）
const fileInputRef = ref<HTMLInputElement | null>(null)
// 当前裁剪比例（受控于下拉选择）
const aspect = ref<AspectKey>(props.defaultAspect)
// 比例选项（下拉）
const aspectOptions = [
  { label: '1:1', value: '1:1' },
  { label: '4:3', value: '4:3' },
  { label: '16:9', value: '16:9' },
  { label: '自由', value: 'free' },
]

/**
 * vue-cropper 配置对象
 * 说明：多数配置与官方组件一致，此处维持默认交互体验
 */
const option = reactive({
  img: '', // 当前裁剪图片（对象 URL）
  outputSize: props.outputQuality, // 导出质量（0.1-1）
  outputType: props.outputType, // 导出格式（jpeg/png/webp）
  info: true, // 显示裁剪框信息（默认）
  canScale: true, // 是否允许缩放
  autoCrop: true, // 是否默认生成裁剪框
  autoCropWidth: undefined as number | undefined, // 默认裁剪框宽度（可按比例生成）
  autoCropHeight: undefined as number | undefined, // 默认裁剪框高度
  fixed: true, // 是否固定裁剪比例
  fixedNumber: [1, 1] as [number, number], // 固定比例（w:h）
  full: false, // 是否输出原图比例（false 为裁剪结果）
  fixedBox: false, // 是否固定裁剪框大小
  canMove: true, // 是否允许移动图片
  canMoveBox: true, // 是否允许移动裁剪框
  original: false, // 是否按原始比例渲染
  centerBox: true, // 裁剪框是否限制在图片区域中
  high: true, // 是否开启高清（2x）渲染
  infoTrue: false, // 显示真实输出像素信息
  maxImgSize: 2000, // 图片最大边长（像素），超出可能影响性能
})

// 是否已有图片（用于控制按钮可用态）
const hasImage = computed(() => Boolean(option.img))

// 本地组件状态：预览和对象 URL 管理
const state = reactive({
  previewUrl: '', // 右侧预览用的对象 URL
  previewMeta: { width: 0, height: 0 }, // 当前裁剪区域尺寸
  objectUrl: '' as string | null, // 当前图片的对象 URL（便于释放）
})

// 预览地址与尺寸文本（例如：512 × 512）
const previewUrl = computed(() => state.previewUrl)
const previewMetaText = computed(() => {
  const { width, height } = state.previewMeta
  return width && height ? `${width.toFixed(0)} × ${height.toFixed(0)}` : '—'
})
// 弹窗显示状态（支持 v-model:show 双向绑定）
const modalShow = ref<boolean>(false)
// 双向同步：内部状态 -> 外部 v-model:show
watch(modalShow, (v) => {
  emit('update:show', v)
})
// 双向同步：外部 props.show -> 内部状态，首次立即应用
watch(
  () => props.show,
  (v) => {
    modalShow.value = !!v
  },
  { immediate: true },
)

/** 将比例字符串转换为固定比例（'free' 为非固定） */
function setFixedNumberByAspect(key: AspectKey) {
  if (key === 'free') {
    option.fixed = false
    option.fixedNumber = [1, 1]
  } else {
    option.fixed = true
    const [w, h] = key.split(':').map((n) => Number(n))
    option.fixedNumber = [w || 1, h || 1]
  }
}

/** 猜文件名：基于当前模型值（File/Blob/Base64）生成默认文件名 */
function guessFileName() {
  const outExt = props.outputType
  const mv = props.modelValue
  const date = Date.now()
  if (mv instanceof File) {
    const base = mv.name.replace(/\.[^/.]+$/, '')
    return `${base}-${date}.${outExt}`
  }
  if (typeof mv === 'string') {
    const m = mv.match(/^data:image\/(\w+);base64,/)
    const ext = m?.[1] || outExt
    return `image-${date}.${ext}`
  }
  if (mv instanceof Blob && mv.type) {
    const ext = mv.type.split('/')[1] || outExt
    return `image-${date}.${ext}`
  }
  return `image-${date}.${outExt}`
}

/**
 * 防抖：更新右侧预览
 * 说明：调用裁剪器的 getCropBlob 获取当前裁剪结果并生成预览 URL
 * 注意：每次更新需释放旧的对象 URL，避免内存泄漏
 */
const updatePreviewDebounced = useDebounceFn(() => {
  if (!cropperRef.value) return
  cropperRef.value.getCropBlob((blob: Blob) => {
    const url = URL.createObjectURL(blob)
    // 释放旧预览 URL
    if (state.previewUrl) URL.revokeObjectURL(state.previewUrl)
    state.previewUrl = url
    // 获取裁剪尺寸
    state.previewMeta = { width: cropperRef.value?.cropW || 0, height: cropperRef.value?.cropH || 0 }
    emit('preview', { blob, fileName: guessFileName(), width: state.previewMeta.width, height: state.previewMeta.height })
  })
}, 200)

/**
 * 按需压缩大图片（简易 Canvas 压缩）
 * - 超过 maxMB 时按比例缩放到约 90% 目标大小
 * - 维持导出类型与质量设置
 */
async function ensureCompressed(file: File, maxMB: number, quality: number, type: OutputType): Promise<File> {
  const bytesLimit = maxMB * 1024 * 1024
  if (file.size <= bytesLimit) return file

  const bitmap = await createImageBitmap(file)
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')!
  // 按比例缩放宽高（目标大小约为最大值的 90%）
  const scale = Math.sqrt((bytesLimit * 0.9) / file.size)
  canvas.width = Math.max(1, Math.floor(bitmap.width * scale))
  canvas.height = Math.max(1, Math.floor(bitmap.height * scale))
  ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height)
  const blob: Blob = await new Promise((resolve) => canvas.toBlob((b) => resolve(b as Blob), `image/${type}`, quality))
  const compressed = new File([blob], file.name.replace(/\.(\w+)$/, `.${type}`), { type: blob.type })
  return compressed.size < file.size ? compressed : file
}

/** Base64 DataURL 转 Blob（用于外部传入的 base64 初始值） */
function dataUrlToBlob(dataUrl: string): Blob {
  const arr = dataUrl.split(',')
  const mime = arr[0].match(/:(.*?);/)![1]
  const bstr = atob(arr[1])
  let n = bstr.length
  const u8arr = new Uint8Array(n)
  while (n--) u8arr[n] = bstr.charCodeAt(n)
  return new Blob([u8arr], { type: mime })
}

setFixedNumberByAspect(aspect.value)

/** 比例切换：更新固定比例并重新自动生成裁剪框 */
function onAspectChange(v: AspectKey) {
  setFixedNumberByAspect(v)
  nextTick(() => {
    cropperRef.value?.goAutoCrop()
  })
}

/**
 * 选择文件：处理类型校验、按需压缩、对象 URL 管理与预览
 * - 触发时来自原生 input[type=file]
 */
async function onFileChange(e: Event) {
  const input = e.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return

  if (!file.type.startsWith('image/')) {
    emit('error', '仅支持图片文件')
    return
  }

  // 文件尺寸校验与压缩
  const fileToUse = await ensureCompressed(file, props.maxSizeMB, props.outputQuality, props.outputType)
  const url = URL.createObjectURL(fileToUse)

  // 释放旧 URL
  if (state.objectUrl) URL.revokeObjectURL(state.objectUrl)
  state.objectUrl = url

  option.img = url
  emit('update:modelValue', fileToUse)

  // 加载后生成预览
  nextTick(updatePreviewDebounced)
}

/**
 * 外部驱动：监听 v-model 初始图片
 * 支持：File/Blob/Base64 三种形式的初始值
 */
watch(
  () => props.modelValue,
  async (val) => {
    if (!val) return
    let file: File | Blob
    if (val instanceof File || val instanceof Blob) file = val
    else file = dataUrlToBlob(val)
    const url = URL.createObjectURL(file)
    if (state.objectUrl) URL.revokeObjectURL(state.objectUrl)
    state.objectUrl = url
    option.img = url
    nextTick(updatePreviewDebounced)
  },
  { immediate: true },
)

/** 图片加载回调：失败时向外抛出错误信息 */
function onImgLoad(status: 'success' | 'error') {
  if (status !== 'success') emit('error', '图片加载失败')
}

/** 实时回调：进行防抖预览更新（随裁剪器交互触发） */
function onRealTime() {
  updatePreviewDebounced()
}

/** 旋转与缩放：每次操作后触发预览更新（防抖） */
function rotateLeft() {
  cropperRef.value?.rotateLeft()
  updatePreviewDebounced()
}
function rotateRight() {
  cropperRef.value?.rotateRight()
  updatePreviewDebounced()
}
function zoomIn() {
  cropperRef.value?.changeScale(1)
  updatePreviewDebounced()
}
function zoomOut() {
  cropperRef.value?.changeScale(-1)
  updatePreviewDebounced()
}
function resetCropper() {
  cropperRef.value?.clearCrop()
  cropperRef.value?.goAutoCrop()
  updatePreviewDebounced()
}

/** 触发原生文件选择器 */
function triggerFileInput() {
  fileInputRef.value?.click()
}

/** 打开裁剪弹窗（对外暴露） */
function openCropper() {
  modalShow.value = true
}
/** 关闭裁剪弹窗（对外暴露） */
function closeCropper() {
  modalShow.value = false
}

function clearImage() {
  option.img = ''
  if (state.objectUrl) URL.revokeObjectURL(state.objectUrl)
  state.objectUrl = null
  state.previewUrl = ''
  state.previewMeta = { width: 0, height: 0 }
  emit('clear')
  emit('update:modelValue', null)
}

/**
 * 确认裁剪：同时输出 Base64 与 Blob，并透传宽高等信息
 * 关闭弹窗以完成一次流程
 */
function confirmCrop() {
  if (!cropperRef.value) return
  cropperRef.value.getCropData((base64: string) => {
    cropperRef.value?.getCropBlob((blob: Blob) => {
      const payload: EmitDonePayload = {
        base64,
        blob,
        fileName: guessFileName(),
        width: state.previewMeta.width,
        height: state.previewMeta.height,
      }
      emit('done', payload)
      closeCropper()
      nextTick(() => {
        clearImage()
      })
    })
  })
}

/** 对外暴露方法：兼容外部上传组件主动传入 File */
function setImage(file: File) {
  const evt = { target: { files: [file] } } as unknown as Event
  onFileChange(evt)
}

// 暴露外部可调用的 API（打开/关闭、设置图片、确认/清空）
defineExpose({ confirmCrop, clearImage, setImage, openCropper, closeCropper })

// 显示控制（受 props 驱动）
const showFileInput = computed(() => props.showFileInput)
const showPreview = computed(() => props.showPreview)
</script>

<style lang="scss" scoped>
/*
  组件样式：结构化布局与交互优化
  - cutter：弹窗主体容器
  - workbench：裁剪工作台（裁剪器 + 预览）
  - toolbar：操作工具栏（上传/比例/旋转缩放/确认）
  兼顾浅色/深色模式的视觉一致性
*/
.cutter {
  display: flex;
  flex-direction: column;
  gap: 14px;
  width: 70%;
  max-width: 900px;
  background: rgb(var(--container-bg-color));
  border: 1px solid rgb(var(--base-text-color) / 0.14);
  border-radius: 12px;
  padding: 16px 18px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition:
    background 0.2s,
    border-color 0.2s;

  .croppertitle {
    font-size: 15px;
    font-weight: 600;
    color: rgb(var(--base-text-color));
    letter-spacing: 0.2px;
  }

  .workbench {
    display: grid;
    gap: 16px;

    @media (min-width: 768px) {
      grid-template-columns: 1fr minmax(240px, 0.35fr);
    }

    .cropper-wrap {
      position: relative;
      width: 100%;
      background: rgb(var(--layout-bg-color));
      border: 1px solid rgb(var(--base-text-color) / 0.14);
      border-radius: 10px;
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: center;
      transition:
        border-color 0.2s,
        background 0.2s;

      &:hover {
        border-color: rgb(var(--base-text-color) / 0.24);
      }

      .placeholder {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 280px;
        font-size: 13px;
        color: rgb(var(--base-text-color) / 0.6);
        user-select: none;
      }
    }

    .preview-wrap {
      display: flex;
      flex-direction: column;
      gap: 12px;

      .preview-card {
        background: rgb(var(--container-bg-color));
        border: 1px solid rgb(var(--base-text-color) / 0.14);
        border-radius: 10px;
        box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
        overflow: hidden;
        transition:
          border-color 0.2s,
          background 0.2s;

        .preview-header {
          font-size: 13px;
          font-weight: 500;
          color: rgb(var(--base-text-color));
          background: rgb(var(--layout-bg-color));
          padding: 8px 12px;
          border-bottom: 1px solid rgb(var(--base-text-color) / 0.14);
        }

        .preview-body {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 200px;
          background: rgb(var(--layout-bg-color));
          padding: 8px;

          .preview-img {
            max-width: 100%;
            max-height: 100%;
            object-fit: contain;
            border-radius: 8px;
            transition:
              transform 0.25s ease,
              box-shadow 0.25s ease;

            &:hover {
              transform: scale(1.03);
              box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
            }
          }

          .preview-empty {
            font-size: 12px;
            color: rgb(var(--base-text-color) / 0.6);
          }
        }

        .preview-footer {
          padding: 6px 12px;
          background: rgb(var(--layout-bg-color));
          border-top: 1px solid rgb(var(--base-text-color) / 0.14);
          text-align: right;
          font-size: 12px;
          color: rgb(var(--base-text-color) / 0.6);
        }
      }
    }
  }

  .toolbar {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 10px;
    padding: 10px 12px;
    background: rgb(var(--layout-bg-color));
    border: 1px solid rgb(var(--base-text-color) / 0.14);
    border-radius: 10px;
    box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.02);
    transition:
      background 0.2s,
      border-color 0.2s;

    .upload-btn {
      cursor: pointer;
      input {
        display: none;
      }
    }

    .n-button {
      transition: all 0.2s ease;
      &:hover {
        transform: translateY(-1px);
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
      }
      &:active {
        transform: translateY(0);
        box-shadow: none;
      }
    }

    .n-select {
      min-width: 120px;
    }

    .ml-auto {
      margin-left: auto;
    }
  }
}
</style>
