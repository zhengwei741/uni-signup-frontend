<template>
  <view class="content">
    <image class="logo" src="/static/logo.png" />
    <view class="text-area">
      <text class="title">{{ title }}</text>
    </view>
    xxxx
    <Scroll :list="[1,2,3,4,5,6]">
      <template v-slot="item">
        <view>{{ item }}</view>
      </template>
    </Scroll>
    <uni-badge text="1"></uni-badge>
    <uni-tag text="标签"></uni-tag>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Scroll from '@/components/scroll/index.vue'

const title = ref('Hello')

</script>

<style>
.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.logo {
  height: 200rpx;
  width: 200rpx;
  margin-top: 200rpx;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 50rpx;
}

.text-area {
  display: flex;
  justify-content: center;
}

.title {
  font-size: 36rpx;
  color: #8f8f94;
}
</style>
