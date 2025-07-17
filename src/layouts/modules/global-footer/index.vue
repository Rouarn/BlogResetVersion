<script setup lang="ts">
import GlobalLogo from '../global-logo/index.vue'

defineOptions({
  name: 'GlobalFooter',
})

const currentYear = new Date().getFullYear()
</script>

<template>
  <footer class="h-full flex-center flex-col py-90px shadow-2xl">
    <GlobalLogo />
    <NSpace inline class="mb-20px mt-4">
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
    <NP class="text-#666">Copyright © {{ currentYear }}.Company name All rights reserved.</NP>
  </footer>
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
