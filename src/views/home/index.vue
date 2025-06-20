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
  { id: 2, type: 'Graphic', url: '/src/assets/imgs/picture/project5.jpg' },
  { id: 1, type: 'Branding', url: '/src/assets/imgs/picture/m-project1.jpg' },
  { id: 4, type: 'Graphic', url: '/src/assets/imgs/picture/project2.jpg' },
  { id: 3, type: 'Branding', url: '/src/assets/imgs/picture/m-project2.jpg' },
  { id: 5, type: 'Design', url: '/src/assets/imgs/picture/m-project3.jpg' },
  { id: 6, type: 'Video', url: '/src/assets/imgs/picture/project1.jpg' },
  { id: 7, type: 'image', url: '/src/assets/imgs/picture/project3.jpg' },
  { id: 8, type: 'Design', url: '/src/assets/imgs/picture/project2.jpg' },
  { id: 9, type: 'Video', url: '/src/assets/imgs/picture/project4.jpg' }
]);

const handleMore = () => {
  const newItems = [
    { id: 10, type: 'Design', url: '/src/assets/imgs/picture/project5.jpg' },
    { id: 11, type: 'Video', url: '/src/assets/imgs/picture/project2.jpg' },
    { id: 12, type: 'image', url: '/src/assets/imgs/picture/project4.jpg' }
  ];

  workList.push(...newItems);
};
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
      <NButton class="primary-button" ghost :bordered="false" :focusable="false" size="large">About Us</NButton>
    </NSpace>

    <NSpace vertical :size="24" class="mt-25">
      <div class="mb-10 text-center">
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

      <WaterfallFlow :initial-items="workList" :is-active-type="isActiveType" />

      <!-- 更多 -->
      <div class="text-center">
        <NButton class="primary-button" ghost :bordered="false" size="large" :focusable="false" @click="handleMore">
          View More
        </NButton>
      </div>
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
