<script setup lang="ts">
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import GlobalHeader from '../modules/global-header/index.vue';
// import GlobalBreadcrumb from '../modules/global-breadcrumb/index.vue';
import GlobalContent from '../modules/global-content/index.vue';
import GlobalFooter from '../modules/global-footer/index.vue';
import ThemeDrawer from '../modules/theme-drawer/index.vue';

const route = useRoute();

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
    <GlobalHeader v-if="!route.path.includes('/login')" :top="top" />
    <!-- <GlobalBreadcrumb /> -->
    <GlobalContent :show-padding="false" />
    <GlobalFooter v-if="!route.path.includes('/login')" />
    <NBackTop :right="100" class="z-3" @update:show="handleBackTop" />
    <ThemeDrawer />
  </div>
</template>

<style scoped></style>
