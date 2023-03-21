<template>
  <view class="light-background-color">
    <uni-card margin="5px" padding="3px">
      <view class="section">
        <text class="g-title">{{ pageActivity.title }}</text>
      </view>

      <view class="section">
        <view class="sub-title">报名开始：{{ pageActivity.startTime }}</view>
        <view class="sub-title">报名结束：{{ pageActivity.endTime }}</view>
      </view>

      <view class="section org-info">
        <view class="organizationName">
          <view class="g-title">{{ pageOrgName }}</view>
          <view>已认证</view>
        </view>
        <view class="link">Ta的主页</view>
      </view>

      <view class="section">
        <text class="g-title">活动介绍</text>
      </view>
      <uni-editer
        v-model="pageActivity.description"
        :editable="false"
      ></uni-editer>

      <view class="section" v-if="myApply">
        <text class="g-title">我的报名</text>
        <uni-list v-if="pageMyApplyList.length">
          <uni-list-item
            showArrow
            v-for="(apply, index) in pageMyApplyList"
            :title="`${index + 1}、${apply.name}`"
            :rightText="apply.groupName"
            :index="apply.id"
          />
        </uni-list>
        <uni-empty v-else></uni-empty>
      </view>

      <view class="section" v-if="cancelApply">
        <text class="g-title">取消的报名</text>
        <uni-list v-if="pageCancelApplyList.length">
          <uni-list-item
            showArrow
            v-for="(apply, index) in pageCancelApplyList"
            :title="`${index + 1}、${apply.name}`"
            :rightText="apply.groupName"
            :index="apply.id"
          />
        </uni-list>
        <uni-empty v-else></uni-empty>
      </view>

      <view class="section">
        <text class="g-title">所有报名</text>
        <uni-list v-if="pageAllApplyList.length">
          <uni-list-item
            showArrow
            v-for="(apply, index) in pageAllApplyList"
            :title="`${index + 1}、${apply.name}`"
            :rightText="apply.groupName"
            :index="apply.id"
          />
        </uni-list>
        <uni-empty v-else></uni-empty>
      </view>
    </uni-card>
  </view>
</template>
<script setup lang="ts">
import { computed } from 'vue'
import type { Activity } from '@/typings/activity'
import type { Apply } from '@/typings/apply'

const props = defineProps<{
  activity: Activity
  organizationName: string
  allApplyList: Apply[]
  myApply: boolean
  myApplyList: Apply[]
  cancelApply: boolean
  cancelApplyList: Apply[]
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
// 所有报名
const pageAllApplyList = computed<Apply[]>(() => props.allApplyList)
// 我的报名
const pageMyApplyList = computed<Apply[]>(() => props.myApplyList)
// 取消报名
const pageCancelApplyList = computed<Apply[]>(() => props.cancelApplyList)
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
</style>
