<template>
  <uni-container>
    <view class="visitor-activity-detail">
      <uni-activityDetail
        :activity="activity"
        :organizationName="organizationName"
        :is-shadow="false"
        :is-full="true"
        @onTapHomeLink="onTapHomeLink"
      >
        <template #myApply>
          <view class="section" v-if="myApplyList.length">
            <text class="g-title list-title">我的报名</text>
            <uni-list>
              <uni-list-item
                @tap="showApply(apply)"
                v-for="(apply, index) in myApplyList"
                :title="`${index + 1}、${apply.name}`"
                :rightText="apply.groupName"
                :index="apply.id"
              />
            </uni-list>
          </view>
        </template>
        <template #allApplyList>
          <view class="section" v-if="allApplyList.length">
            <text class="g-title list-title">所有报名</text>
            <uni-list>
              <uni-list-item
                v-for="(apply, index) in allApplyList"
                :title="`${index + 1}、${apply.name}`"
                :rightText="apply.groupName"
                :index="apply.id"
              />
            </uni-list>
          </view>
        </template>
      </uni-activityDetail>
      <view class="actions">
        <view class="sign-up">
          <view class="cell" @tap="goToHome">
            <view>
              <uni-icons
                custom-prefix="iconfont"
                type="icon-shouye"
                :size="18"
                color="#777"
              ></uni-icons
            ></view>
            <view>首页</view>
          </view>
          <view class="cell" @tap="shareToggle">
            <view>
              <uni-icons
                custom-prefix="iconfont"
                type="icon-fenxiang3"
                :size="18"
                color="#777"
              ></uni-icons
            ></view>
            <view>分享</view>
          </view>
          <view class="btn">
            <button
              class="signUp-button"
              @tap="gotoSingupPage"
              :disabled="isClose"
            >
              {{ isClose ? '报名已结束' : '立即报名' }}
            </button>
          </view>
        </view>
      </view>
    </view>
    <uni-shard ref="shareRef"></uni-shard>

    <uni-popup ref="popupRef" type="dialog">
      <uni-apply-dialog :applyInfo="applyInfo"></uni-apply-dialog>
    </uni-popup>
  </uni-container>
</template>
<script setup lang="ts">
import { ref, getCurrentInstance, computed } from 'vue'
import type { ComponentInternalInstance } from 'vue'
import { onShareAppMessage } from '@dcloudio/uni-app'
import { useActivityDetail } from '@/hooks/useActivityDetail'
import { queryApplyDetail } from '@/apis/apply'
import type { Apply, ApplyInfo } from '@/typings/apply'
import { toFront } from '@/utils'

const { activity, organizationName, allApplyList, myApplyList, refresh } =
  useActivityDetail({ allApply: true, myApply: true })
// 报名是否关闭
const isClose = computed(() => activity.value.status === '1')
// 分享相关
const shareRef = ref()
const instance = getCurrentInstance() as ComponentInternalInstance
const shareToggle = () => {
  const { refs } = instance
  // @ts-ignore
  refs.shareRef.open()
}
onShareAppMessage((res) => {
  return {
    title: activity.value.title,
    path: `/pages/visitorActivityDetail/index?id=${activity.value.id}`
  }
})

const goToHome = () => {
  uni.switchTab({
    url: '/pages/hot/index'
  })
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

// 跳转TA的主页
const onTapHomeLink = () => {
  uni.navigateTo({
    url: `/pages/bizHomePage/index?creater=${activity.value.creater}`
  })
}

// 报名信息相关
const applyInfo = ref<ApplyInfo>()
const showApply = (apply: Apply) => {
  queryApplyDetail(apply.id).then((ret) => {
    applyInfo.value = {
      ...ret.data,
      money: toFront(ret.data.money)
    }
    // @ts-ignore
    instance.refs.popupRef.open('center')
  })
}
</script>
<style scoped lang="scss">
.visitor-activity-detail {
  padding: 5px 0;
  padding-bottom: 50px;
}
.actions {
  position: fixed;
  width: 100%;
  bottom: 0;
  background-color: #fff;
  z-index: 5;
  border-top: 1px solid #d6d6d6;

  .sign-up {
    display: flex;
    .cell {
      width: 60px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      font-size: 12px;
      color: #3498db;
    }
    .btn {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      .signUp-button {
        width: 80%;
        height: 80%;
        margin: auto;
        border-radius: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
  }
}
.list-title {
  margin-bottom: 5px;
  display: inline-block;
}
</style>
