<script setup lang="ts">
import { computed } from 'vue'
import { useAuthStore } from '@/stores/modules/auth'
import { RouteNameEnum } from '@/enum'
import { useSvgIcon } from '@/hooks/common/icon'
import { useRouterPush } from '@/hooks/common/router'
import { $t } from '@/locales'
import type { VNode } from 'vue'

defineOptions({
  name: 'UserAvatar',
})

const authStore = useAuthStore()
const { routerPushByKey, toLogin } = useRouterPush()
const { SvgIconVNode } = useSvgIcon()

function loginOrRegister() {
  toLogin()
}

type DropdownKey = RouteNameEnum.USER_CENTER | 'logout'

type DropdownOption =
  | {
      key: DropdownKey
      label: string
      icon?: () => VNode
    }
  | {
      type: 'divider'
      key: string
    }

const options = computed(() => {
  const opts: DropdownOption[] = [
    {
      label: $t('common.userCenter'),
      key: RouteNameEnum.USER_CENTER,
      icon: SvgIconVNode({ icon: 'ph:user-circle', fontSize: 18 }),
    },
    {
      type: 'divider',
      key: 'divider',
    },
    {
      label: $t('common.logout'),
      key: 'logout',
      icon: SvgIconVNode({ icon: 'ph:sign-out', fontSize: 18 }),
    },
  ]

  return opts
})

function logout() {
  window.$dialog?.info({
    title: $t('common.tip'),
    content: $t('common.logoutConfirm'),
    positiveText: $t('common.confirm'),
    negativeText: $t('common.cancel'),
    onPositiveClick: () => {
      authStore.resetStore()
    },
  })
}

function handleDropdown(key: DropdownKey) {
  if (key === 'logout') {
    logout()
  } else {
    // 如果你的其他选项是跳转到路由，这里会直接支持
    routerPushByKey(key)
  }
}

function handleError() {
  authStore.userInfo.avatar = ''
}
</script>

<template>
  <NButton v-if="!authStore.isLogin" quaternary @click="loginOrRegister">
    {{ $t('page.login.common.loginOrRegister') }}
  </NButton>
  <NDropdown v-else placement="bottom" trigger="click" :options="options" @select="handleDropdown">
    <div>
      <ButtonIcon>
        <SvgIcon icon="ph:user-circle" class="text-lg" v-if="!authStore.userInfo.avatar" />
        <NImage
          :src="authStore.userInfo.avatar"
          class="w-20px h-20px rounded-full"
          fit="cover"
          v-else
          @error="handleError"
          preview-disabled
        />
        <span class="text-16px font-medium">{{ authStore.userInfo.nickname }}</span>
      </ButtonIcon>
    </div>
  </NDropdown>
</template>

<style scoped></style>
