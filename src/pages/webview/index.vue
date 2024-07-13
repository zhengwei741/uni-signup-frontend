<template>
  <web-view id="viewopen" :src="src"> </web-view>
</template>
<script setup lang="ts">
import { GZ_APPID, REDIRECT_URL } from '@/const'
import { useCommonStore } from '@/store/common'

const { userId } = useCommonStore()

const src =
  'https://open.weixin.qq.com/connect/oauth2/authorize' +
  `?appid=${GZ_APPID}` +
  `&redirect_uri=${encodeURIComponent(`${REDIRECT_URL}?userId=${userId}`)}` +
  '&response_type=code' +
  '&scope=snsapi_base#wechat_redirect'
</script>
