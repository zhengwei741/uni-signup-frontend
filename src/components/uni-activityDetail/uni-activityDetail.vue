<template>
  <view class="light-background-color">
    <uni-card
      :margin="props.margin"
      :padding="props.padding"
      :isShadow="props.isShadow"
      :is-full="props.isFull"
    >
      <view class="section">
        <text class="g-title">{{ pageActivity.title }}</text>
      </view>

      <view class="section">
        <view class="sub-title">报名开始：{{ pageActivity.startTime }}</view>
        <view class="sub-title">报名结束：{{ pageActivity.endTime }}</view>
      </view>

      <view class="section org-info">
        <view class="organizationName">
          <view class="g-title auth-name">{{ pageOrgName || '未认证' }}</view>
          <view class="auth-icon" v-if="pageOrgName">
            <uni-icons
              custom-prefix="iconfont"
              type="icon-renzheng"
              :size="15"
              color="#22f300"
            ></uni-icons>
            已认证</view
          >
        </view>
        <view class="link" @tap.stop="emits('onTapHomeLink')">Ta的主页</view>
      </view>

      <view class="section">
        <text class="g-title">活动介绍</text>
      </view>
      <uni-editer
        v-model="pageActivity.description"
        :editable="false"
      ></uni-editer>

      <slot name="myApply"></slot>

      <slot name="cancelApply"></slot>

      <slot name="allApplyList"></slot>
    </uni-card>
  </view>
</template>
<script setup lang="ts">
import { computed } from 'vue'
import type { Activity } from '@/typings/activity'

const props = withDefaults(
  defineProps<{
    activity: Activity
    organizationName: string
    margin: string
    padding: string
    isShadow: boolean
    isFull: boolean
  }>(),
  {
    margin: '5px',
    padding: '3px'
  }
)

// emits
const emits = defineEmits<{
  (e: 'onTapHomeLink'): void
}>()

// 活动详情
const pageActivity = computed<Activity>(() => {
  return {
    ...props.activity,
    startTime: props.activity.startTime.replace('T', ' '),
    endTime: props.activity.endTime.replace('T', ' ')
  }
})
// 组织机构
const pageOrgName = computed<string>(() => props.organizationName)
</script>
<style scoped lang="scss">
.sub-title {
  color: #c5c5c5;
  font-size: 13px;
}
.section {
  margin-bottom: 5px;
}
.org-info {
  display: flex;
  height: 50px;
  background-color: #e4fafc;
  border-radius: 5px;
  padding: 0 10px;
  .organizationName {
    flex: 2;
    display: flex;
    flex-direction: column;
    > view {
      flex: 1;
      line-height: 25px;
    }
  }
  .link {
    flex: 1;
  }
  .link {
    color: #3498db;
    line-height: 50px;
    text-align: right;
  }
}
.auth-name {
  display: flex;
  align-items: center;
}
</style>
