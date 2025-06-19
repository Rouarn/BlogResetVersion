<script setup lang="ts">
import { ref } from 'vue';
import { type MenuOption } from 'naive-ui';

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
    label: '寻羊冒险记',
    key: 'a-wild-sheep-chase'
  },
  {
    label: '舞，舞，舞',
    key: 'dance-dance-dance',
    children: [
      {
        label: '叙事者',
        key: 'narrator'
      },
      {
        label: '羊男',
        key: 'sheep-man'
      },
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
  }
];
</script>

<template>
  <DarkModeContainer class="fixed-center z-10 h-78px flex-center shadow-sider">
    <NGrid :cols="3" class="max-w-1200px">
      <NGi class="ml-2rem flex items-center justify-start text-22px color-#232332 font-bold">XiaJI</NGi>
      <NGi />
      <NGi>
        <NMenu v-model:value="activeKey" mode="horizontal" :options="menuOptions" responsive />
      </NGi>
    </NGrid>
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
</style>
