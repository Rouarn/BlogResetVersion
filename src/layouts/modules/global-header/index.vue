<script setup lang="ts">
import { computed, h, ref } from 'vue';
import { type MenuOption } from 'naive-ui';
import { useAppStore } from '@/store/modules/app';
import GlobalLogo from '../global-logo/index.vue';
import GlobalSearch from '../global-search/index.vue';
import ThemeButton from './components/theme-button.vue';
import UserAvatar from './components/user-avatar.vue';

defineProps<{
  top: boolean;
}>();

const appStore = useAppStore();

const isMobile = computed(() => appStore.isMobile);

const activeKey = ref('');
const menuOptions: MenuOption[] = [
  {
    label: '首页',
    key: 'hear-the-wind-sing'
  },
  {
    label: '且听风吟',
    key: 'pinball-1973',
    children: [
      {
        label: '且听风吟',
        key: 'rat'
      }
    ]
  },
  {
    label: '舞，舞，舞',
    key: 'dance-dance-dance',
    children: [
      {
        label: '饮品',
        key: 'beverage',
        children: [
          {
            label: '威士忌',
            key: 'whisky'
          }
        ]
      },
      {
        label: '食物',
        key: 'food',
        children: [
          {
            label: '三明治',
            key: 'sandwich'
          }
        ]
      },
      {
        label: '过去增多，未来减少',
        key: 'the-past-increases-the-future-recedes'
      }
    ]
  },
  {
    label: () => {
      return h(GlobalSearch);
    },
    key: 'a-wild-sheep-chase'
  },
  {
    label: () => {
      return h(ThemeButton);
    },
    key: 'sheep-man'
  },
  {
    label: () => {
      return h(UserAvatar);
    },
    key: 'a-trip-to-the-mountains'
  }
];

const isVisible = ref(false);
</script>

<template>
  <DarkModeContainer
    class="fixed-center z-10 flex-center transition-all duration-300"
    :class="[top ? 'h-64px shadow-sider' : 'bg-transparent! h-78px']"
  >
    <NGrid :cols="7" class="max-w-1200px">
      <NGi class="ml-2rem flex items-center justify-start">
        <GlobalLogo custom-class="justify-start w-full" />
      </NGi>
      <NGi span="2"></NGi>
      <NGi :class="[isMobile ? 'flex-center justify-end mr-2rem' : '']" span="4">
        <NMenu v-if="!isMobile" v-model:value="activeKey" mode="horizontal" :options="menuOptions" responsive />
        <NIcon v-if="isMobile" size="20" @click="isVisible = !isVisible">
          <icon-material-symbols:menu />
        </NIcon>
      </NGi>
    </NGrid>

    <NDrawer v-model:show="isVisible" width="80%" placement="right">
      <NDrawerContent title="">
        <NMenu v-model:value="activeKey" mode="vertical" :options="menuOptions" :class="{ isMobile: isMobile }" />
      </NDrawerContent>
    </NDrawer>
  </DarkModeContainer>
</template>

<style lang="scss" scoped>
:deep(.n-menu-item) {
  position: relative;

  &::before {
    opacity: 0;
    width: 0;
    background: #666666 none repeat scroll 0 0;
    bottom: 0;
    content: '';
    height: 1px;
    left: 0;
    margin: auto;
    position: absolute;
    right: 0;
    transition: all 0.3s ease 0s;
  }

  &:hover::before {
    opacity: 1;
    width: 15px;
  }

  .n-menu-item-content-header {
    &:hover {
      color: #666666 !important;
    }
  }
}

.isMobile {
  :deep(.n-menu-item) {
    &::before {
      display: none;
    }
  }
}
</style>
