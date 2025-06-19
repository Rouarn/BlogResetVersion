<script lang="ts" setup>
//
</script>

<template>
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
</template>

<style lang="scss" scoped>
.home-area {
  background-clip: initial;
  background-origin: initial;
  background-image: url('@/assets/imgs/slider-2.jpg');
  background-color: rgba(0, 0, 0, 0);
}
</style>
