<template>
  <uni-container>
    <view class="activity-detail">
      <uni-activityDetail
        :activity="activity"
        :organizationName="organizationName"
      >
        <template #myApply>
          <view class="section">
            <text class="g-title list-title">所有报名</text>
            <uni-list v-if="allApplyList.length">
              <uni-list-item
                showArrow
                v-for="(apply, index) in allApplyList"
                :title="`${index + 1}、${apply.name}`"
                :rightText="apply.groupName"
                :index="apply.id"
                @tap="() => cancelApply(apply)"
              />
            </uni-list>
            <uni-empty v-else></uni-empty>
          </view>
        </template>
      </uni-activityDetail>
      <view class="actions">
        <uni-grid :column="5" :show-border="false" :square="false">
          <uni-grid-item @tap="shareToggle">
            <view class="grid-item-box">
              <uni-icons
                custom-prefix="iconfont"
                type="icon-fenxiang3"
                :size="20"
                color="#777"
              ></uni-icons>
              <text class="text">分享</text>
            </view>
          </uni-grid-item>
          <uni-grid-item>
            <view class="grid-item-box">
              <uni-icons
                custom-prefix="iconfont"
                type="icon-bianji"
                :size="20"
                color="#777"
              ></uni-icons>
              <text class="text">编辑</text>
            </view>
          </uni-grid-item>
          <uni-grid-item>
            <view class="grid-item-box">
              <uni-icons
                custom-prefix="iconfont"
                type="icon-daochu"
                :size="20"
                color="#777"
              ></uni-icons>
              <text class="text">导出</text>
            </view>
          </uni-grid-item>
          <uni-grid-item>
            <view class="grid-item-box">
              <uni-icons
                custom-prefix="iconfont"
                type="icon-tixian1"
                :size="20"
                color="#777"
              ></uni-icons>
              <text class="text">提现</text>
            </view>
          </uni-grid-item>
          <uni-grid-item @tap="gotoSingupPage">
            <view class="grid-item-box">
              <uni-icons
                custom-prefix="iconfont"
                type="icon-sign"
                :size="20"
                color="#777"
              ></uni-icons>
              <text class="text">报名</text>
            </view>
          </uni-grid-item>
        </uni-grid>
      </view>
    </view>
    <uni-shard ref="shareRef"></uni-shard>
  </uni-container>
</template>
<script setup lang="ts">
import { ref, getCurrentInstance } from 'vue'
import type { ComponentInternalInstance } from 'vue'
import { onShareAppMessage } from '@dcloudio/uni-app'
import { useActivityDetail } from '@/hooks/useActivityDetail'
import type { Apply } from '@/typings/apply'

const { activity, organizationName, allApplyList, refresh } =
  useActivityDetail()
// 分享相关
const shareRef = ref()
const instance = getCurrentInstance() as ComponentInternalInstance
const shareToggle = () => {
  const { refs } = instance
  // @ts-ignore
  refs.shareRef.open()
}

const gotoSingupPage = () => {
  uni.navigateTo({
    url: `../singupPage/index?id=${activity.value.id}`,
    events: {
      onSingSuccess() {
        refresh()
      }
    }
  })
}

// 取消报名
const cancelApply = (apply: Apply) => {

}

onShareAppMessage((res) => {
  return {
    title: activity.value.title,
    path: `/pages/visitorActivityDetail/index?id=${activity.value.id}`
  }
})
</script>
<style scoped lang="scss">
.activity-detail {
  padding: 5px 0;
  padding-bottom: 75px;
}
.actions {
  position: fixed;
  width: 100%;
  bottom: 0;
  background-color: #fff;
  z-index: 5;
  border-top: 1px solid #d6d6d6;
}
</style>
