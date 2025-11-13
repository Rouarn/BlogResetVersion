<template>
  <NModal v-model:show="modalShow" :mask-closable="maskClosable">
    <div class="cutter flex-col gap-12px">
      <NSpace justify="space-between">
        <!-- 弹窗标题 -->
        <div class="croppertitle text-14px font-medium">{{ croppertitle }}</div>
        <!-- 关闭按钮 -->
        <NButton type="primary" size="small" block ghost :bordered="false" @click="modalShow = false"
          ><icon-mdi-close class="text-20px"
        /></NButton>
      </NSpace>

      <!-- 裁剪与预览区 -->
      <div class="workbench grid gap-12px md:grid-cols-[1fr_minmax(220px,0.35fr)]">
        <!-- 裁剪器容器 -->
        <div class="cropper-wrap">
          <VueCropper
            v-if="option.img"
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

          <div v-else class="placeholder flex-center h-260px bg-[var(--bg-soft)]">
            <div class="text-12px text-[var(--text-color-3)]">请选择图片进行裁剪</div>
          </div>
        </div>

        <!-- 实时预览 -->
        <div v-if="showPreview" class="preview-wrap">
          <div class="preview-card">
            <div class="preview-header">裁剪预览</div>
            <div class="preview-body">
              <img v-if="previewUrl" :src="previewUrl" alt="preview" class="preview-img" />
              <div v-else class="preview-empty">暂无预览</div>
            </div>
            <div class="preview-footer text-12px text-[var(--text-color-3)]">
              {{ previewMetaText }}
            </div>
          </div>
        </div>
      </div>

      <!-- 操作工具栏 -->
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
 * - 支持上传、预览、裁剪、旋转、缩放
 * - 支持常用比例设置：1:1、4:3、16:9、自由
 * - 输出 base64 或 Blob，事件透传到父组件
 */

defineOptions({ name: 'CroppingImage' })

type AspectKey = '1:1' | '4:3' | '16:9' | 'free'
type OutputType = 'jpeg' | 'png' | 'webp'

interface EmitDonePayload {
  base64?: string
  blob?: Blob
  fileName?: string
  width?: number
  height?: number
}

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
const cropperRef = ref<CropperApi | null>(null)
const fileInputRef = ref<HTMLInputElement | null>(null)
const aspect = ref<AspectKey>(props.defaultAspect)
const aspectOptions = [
  { label: '1:1', value: '1:1' },
  { label: '4:3', value: '4:3' },
  { label: '16:9', value: '16:9' },
  { label: '自由', value: 'free' },
]

/** vue-cropper 配置对象 */
const option = reactive({
  img: '',
  outputSize: props.outputQuality,
  outputType: props.outputType,
  info: true,
  canScale: true,
  autoCrop: true,
  autoCropWidth: undefined as number | undefined,
  autoCropHeight: undefined as number | undefined,
  fixed: true,
  fixedNumber: [1, 1] as [number, number],
  full: false,
  fixedBox: false,
  canMove: true,
  canMoveBox: true,
  original: false,
  centerBox: true,
  high: true,
  infoTrue: false,
  maxImgSize: 2000,
})

const hasImage = computed(() => Boolean(option.img))

const state = reactive({
  previewUrl: '',
  previewMeta: { width: 0, height: 0 },
  objectUrl: '' as string | null,
})

const previewUrl = computed(() => state.previewUrl)
const previewMetaText = computed(() => {
  const { width, height } = state.previewMeta
  return width && height ? `${width.toFixed(0)} × ${height.toFixed(0)}` : '—'
})
const modalShow = ref<boolean>(false)
watch(modalShow, (v) => {
  emit('update:show', v)
})
watch(
  () => props.show,
  (v) => {
    modalShow.value = !!v
  },
  { immediate: true },
)

/** 将比例字符串转换为固定比例 */
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

/** 猜测文件名（用于回传） */
function guessFileName() {
  return typeof props.modelValue === 'object' && props.modelValue ? (props.modelValue as File).name : 'image'
}

/** 防抖：更新右侧预览 */
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

/** 按需压缩大图片（canvas 压缩） */
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

/** Base64 DataURL 转 Blob */
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

function onAspectChange(v: AspectKey) {
  setFixedNumberByAspect(v)
  nextTick(() => {
    cropperRef.value?.goAutoCrop()
  })
}

/** 选择文件 */
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

/** 外部驱动：监听 v-model 初始图片 */
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

/** 图片加载回调 */
function onImgLoad(status: 'success' | 'error') {
  if (status !== 'success') emit('error', '图片加载失败')
}

/** 实时回调：进行防抖预览更新 */
function onRealTime() {
  updatePreviewDebounced()
}

/** 旋转与缩放 */
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

function triggerFileInput() {
  fileInputRef.value?.click()
}

function openCropper() {
  modalShow.value = true
}
function closeCropper() {
  modalShow.value = false
}

/** 确认裁剪：输出 base64 与 blob */
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
    })
  })
}

/** 清空当前图片 */
function clearImage() {
  option.img = ''
  if (state.objectUrl) URL.revokeObjectURL(state.objectUrl)
  state.objectUrl = null
  state.previewUrl = ''
  state.previewMeta = { width: 0, height: 0 }
  emit('clear')
  emit('update:modelValue', null)
}

/** 对外暴露方法，兼容外部上传组件主动调用 */
function setImage(file: File) {
  const evt = { target: { files: [file] } } as unknown as Event
  onFileChange(evt)
}

defineExpose({ confirmCrop, clearImage, setImage, openCropper, closeCropper })

const showFileInput = computed(() => props.showFileInput)
const showPreview = computed(() => props.showPreview)
</script>

<style lang="scss" scoped>
.cutter {
  display: flex;
  flex-direction: column;
  gap: 14px;
  width: 70%;
  max-width: 900px;
  background: var(--bg-card, #fff);
  border: 1px solid var(--border-color, #e5e7eb);
  border-radius: 12px;
  padding: 16px 18px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition:
    background 0.2s,
    border-color 0.2s;

  .croppertitle {
    font-size: 15px;
    font-weight: 600;
    color: var(--text-color, #222);
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
      background: var(--bg-soft, #fafafa);
      border: 1px solid var(--border-color, #e5e7eb);
      border-radius: 10px;
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: center;
      transition:
        border-color 0.2s,
        background 0.2s;

      &:hover {
        border-color: var(--border-color-hover, #cbd5e1);
      }

      .placeholder {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 280px;
        font-size: 13px;
        color: var(--text-color-3, #999);
        user-select: none;
      }
    }

    .preview-wrap {
      display: flex;
      flex-direction: column;
      gap: 12px;

      .preview-card {
        background: var(--bg-card, #fff);
        border: 1px solid var(--border-color, #e5e7eb);
        border-radius: 10px;
        box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
        overflow: hidden;
        transition:
          border-color 0.2s,
          background 0.2s;

        .preview-header {
          font-size: 13px;
          font-weight: 500;
          color: var(--text-color, #333);
          background: var(--bg-soft, #f8f8f8);
          padding: 8px 12px;
          border-bottom: 1px solid var(--border-color, #e5e7eb);
        }

        .preview-body {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 200px;
          background: var(--bg-soft, #fafafa);
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
            color: var(--text-color-3, #aaa);
          }
        }

        .preview-footer {
          padding: 6px 12px;
          background: var(--bg-soft, #f9f9f9);
          border-top: 1px solid var(--border-color, #e5e7eb);
          text-align: right;
          font-size: 12px;
          color: var(--text-color-3, #999);
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
    background: var(--bg-soft, #f9f9f9);
    border: 1px solid var(--border-color, #e5e7eb);
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

/* 深色模式优化 */
@media (prefers-color-scheme: dark) {
  .cutter {
    background: #1e1e1e;
    border-color: #333;

    .croppertitle {
      color: #e5e5e5;
    }

    .cropper-wrap,
    .preview-card,
    .toolbar {
      background: #262626;
      border-color: #3a3a3a;
    }

    .preview-header,
    .preview-footer {
      background: #2d2d2d;
      border-color: #3a3a3a;
      color: #ccc;
    }

    .preview-body {
      background: #1f1f1f;
    }

    .preview-empty,
    .placeholder {
      color: #777;
    }

    .n-button {
      color: #ddd;
    }
  }
}
</style>
