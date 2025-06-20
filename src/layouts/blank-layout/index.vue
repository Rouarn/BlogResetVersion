<script setup lang="ts">
import GlobalHeader from '../modules/global-header/index.vue';
// import GlobalBreadcrumb from '../modules/global-breadcrumb/index.vue';
import GlobalContent from '../modules/global-content/index.vue';
import GlobalFooter from '../modules/global-footer/index.vue';

defineOptions({
  name: 'BlankLayout'
});
</script>

<template>
  <div>
    <GlobalHeader />
    <!-- <GlobalBreadcrumb /> -->
    <GlobalContent :show-padding="false" />
    <GlobalFooter />
    <NBackTop :right="100" />
  </div>
</template>

<style scoped></style>
