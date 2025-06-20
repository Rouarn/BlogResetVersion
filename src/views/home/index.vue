<script lang="ts" setup>
import { reactive, ref } from 'vue';
import WaterfallFlow from './module/waterfall-flow.vue';
import LatestBlog from './module/latest-blog.vue';

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

const blogs = reactive<Api.Blog.BlogItem[]>([
  {
    id: 1,
    cover: '/src/assets/imgs/picture/1.jpg',
    title: 'Tips for Delivering a Great Perfor mance in Your Next',
    description:
      'At tincidunt vulputate dis natoque parturient proine mperdiet. Quisque lig pede males us. Semper orc gue lorem ipsum',
    author: 'Soybean',
    date: 'January 26, 2020'
  },
  {
    id: 2,
    cover: '/src/assets/imgs/picture/4.jpg',
    title: 'How To Be The Highest Marketer On Your Team And Skills',
    description:
      'At tincidunt vulputate dis natoque parturient proine mperdiet. Quisque lig pede males us. Semper orc gue lorem ipsum',
    author: 'Soybean',
    date: 'January 28, 2025'
  },
  {
    id: 3,
    cover: '/src/assets/imgs/picture/3.jpg',
    title: '4 Myths Rand Fishkin Wants You to Question Launching ',
    description:
      'At tincidunt vulputate dis natoque parturient proine mperdiet. Quisque lig pede males us. Semper orc gue lorem ipsum',
    author: 'Soybean',
    date: 'August 29, 2025'
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
      <NButton class="primary-button" ghost :bordered="false" :focusable="false" size="large">About Us</NButton>
    </NSpace>

    <NSpace vertical class="my-25">
      <NSpace justify="center" wrap class="mb-[2rem]">
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
      </NSpace>

      <WaterfallFlow :initial-items="workList" :is-active-type="isActiveType" />

      <!-- 更多 -->
      <div class="text-center">
        <NButton class="primary-button" ghost :bordered="false" size="large" :focusable="false" @click="handleMore">
          View More
        </NButton>
      </div>
    </NSpace>

    <NSpace vertical :size="24" class="bg-#F4F7FC pb-90px pt-10">
      <div>
        <NH2 class="blogTitle mb-10 text-center text-28px font-700 uppercase">Latest Blog</NH2>
        <NP class="mx-a w-2xl text-center text-14px text-#666 font-normal">
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sequi tempora veritatis nemo aut ea iusto eos est
          expedita, quas ab adipisci.
        </NP>
      </div>
      <LatestBlog :blog-list="blogs" />
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

.blogTitle {
  position: relative;
  &::after {
    background: #444444 none repeat scroll 0 0;
    bottom: -15px;
    content: '';
    display: block;
    font-size: 20px;
    height: 2px;
    left: 0;
    margin: auto;
    position: absolute;
    right: 0;
    width: 50px;
  }
}
</style>
