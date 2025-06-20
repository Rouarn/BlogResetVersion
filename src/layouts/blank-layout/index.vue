<script setup lang="ts">
import { ref } from 'vue';
import GlobalHeader from '../modules/global-header/index.vue';
// import GlobalBreadcrumb from '../modules/global-breadcrumb/index.vue';
import GlobalContent from '../modules/global-content/index.vue';
import GlobalFooter from '../modules/global-footer/index.vue';

defineOptions({
  name: 'BlankLayout'
});

const top = ref(false);
const handleBackTop = (item: boolean) => {
  top.value = item;
};
</script>

<template>
  <div>
    <GlobalHeader :top="top" />
    <!-- <GlobalBreadcrumb /> -->
    <GlobalContent :show-padding="false" />
    <GlobalFooter />
    <NBackTop :right="100" class="z-3" @update:show="handleBackTop" />
  </div>
</template>

<style scoped></style>
