<script lang="ts" setup>
import { reactive, ref } from 'vue';
import WaterfallFlow from './module/waterfall-flow.vue';

// 分类
const isActiveType = ref('All');
const workType = ref([
  {
    name: 'All',
    value: 'All'
  },
  {
    name: 'Branding',
    value: 'Branding'
  },
  {
    name: 'Graphic',
    value: 'Graphic'
  },
  {
    name: 'Design',
    value: 'Design'
  },
  {
    name: 'Video',
    value: 'Video'
  }
]);
const handleWorkType = (type: string) => {
  isActiveType.value = type;
};

const workList = reactive<Api.Work.WorkItem[]>([
  {
    id: 1,
    image: 'https://picsum.photos/200/300',
    title: 'string',
    description: 'string'
  },
  {
    id: 2,
    image: 'https://picsum.photos/200/200',
    title: 'string',
    description: 'string'
  },
  {
    id: 3,
    image: 'https://picsum.photos/200/400',
    title: 'string',
    description: 'string'
  },
  {
    id: 4,
    image: 'https://picsum.photos/200/100',
    title: 'string',
    description: 'string'
  },
  {
    id: 5,
    image: 'https://picsum.photos/200/250',
    title: 'string',
    description: 'string'
  },
  {
    id: 6,
    image: 'https://picsum.photos/200/240',
    title: 'string',
    description: 'string'
  }
]);
</script>

<template>
  <NSpace vertical>
    <NSpace
      class="home-area relative z-0 h-screen bg-cover bg-fixed bg-center bg-no-repeat px-3"
      align="center"
      justify="center"
      vertical
      :size="0"
    >
      <NH2 class="mb-[1.25rem] text-[2.625rem] font-bold tracking-[0.125rem]">Here Is my short video info.</NH2>
      <NP class="mb-[1.25rem] text-[0.875rem] text-[#444] font-normal leading-[1.625rem] capitalize">
        We are Professional web developer and designer in this market.
      </NP>
      <NButton
        class="mt-6 touch-manipulation rounded-[0.125rem] bg-[#444] text-white uppercase transition-all duration-300 ease-[ease] hover:border hover:border-[#444] hover:text-black"
        ghost
        :bordered="false"
        size="large"
      >
        About Us
      </NButton>
    </NSpace>

    <NSpace vertical :size="24" class="mb-15 mt-25">
      <div class="text-center">
        <NButton
          v-for="(item, index) in workType"
          :key="index"
          ghost
          :bordered="false"
          class="mx-3 text-12px font-bold uppercase"
          @click="handleWorkType(item.value)"
        >
          {{ item.name }}
        </NButton>
      </div>

      <WaterfallFlow :initial-items="workList" />
    </NSpace>
  </NSpace>
</template>

<style lang="scss" scoped>
.home-area {
  background-clip: initial;
  background-origin: initial;
  background-image: url('@/assets/imgs/slider-2.jpg');
  background-color: rgba(0, 0, 0, 0);
}

:deep(.n-button:not(.n-button--disabled):hover),
:deep(.n-button:not(.n-button--disabled):focus),
:deep(.n-button__content:hover) {
  color: #111 !important;
}
</style>
