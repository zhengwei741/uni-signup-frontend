<template>
  <uni-container>
    <view class="activity-detail">
      <text>2023年环太湖自行车比赛</text>

      <text>报名开始：2023-02-26 21:30</text>
      <text>报名结束：2023-03-22 21:30</text>

      <view> 南京G捷号 </view>

      <text>活动介绍</text>

      <text>我的报名</text>

      <text>所有报名</text>
    </view>
  </uni-container>
</template>
<script setup lang="ts">
import { reactive } from 'vue'
import type { Activity } from '@/typings/activity'

const act = reactive<Activity>({})
</script>
<style scoped lang="scss">
.activity-detail {
}
</style>
