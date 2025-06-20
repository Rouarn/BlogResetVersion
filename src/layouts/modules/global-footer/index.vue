<script setup lang="ts">
defineOptions({
  name: 'GlobalFooter'
});
</script>

<template>
  <DarkModeContainer class="h-full flex-center flex-col py-90px">
    <NP class="text-22px color-#232332 font-bold">XiaJI</NP>
    <NSpace inline class="mb-20px">
      <NIcon class="icon">
        <icon-material-symbols:mail-rounded />
      </NIcon>
      <NIcon class="icon">
        <icon-ri:weibo-fill />
      </NIcon>
      <NIcon class="icon">
        <icon-ri:github-fill />
      </NIcon>
      <NIcon class="icon">
        <icon-simple-icons:bilibili />
      </NIcon>
    </NSpace>
    <NSpace class="item">
      <NP>Home</NP>
      <NP>Portfolio</NP>
      <NP>About</NP>
      <NP>Blog</NP>
      <NP>Contact</NP>
    </NSpace>
    <NP class="text-#666">Copyright © 2022.Company name All rights reserved.</NP>
  </DarkModeContainer>
</template>

<style lang="scss" scoped>
.item p {
  position: relative;
  padding: 0 0.5rem;
  text-transform: uppercase;
  font-size: 0.7rem;
  color: #444;
  &::before {
    background: #666 none repeat scroll 0 0;
    bottom: 8px;
    content: '';
    height: 4px;
    right: -14px;
    margin-right: 6px;
    position: absolute;
    width: 4px;
  }
}

.icon {
  background: #252525 none repeat scroll 0 0;
  border-radius: 50%;
  color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 16px;
  height: 35px;
  margin: 0 5px;
  width: 35px;
  transition: all 0.3s ease-in-out;
  cursor: pointer;

  &:hover {
    background: #fff;
    color: #252525;
    font-size: 30px;
  }
}
</style>
