<template>
  <view
    class="light-background-color activity-detail"
  >
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
          <view class="g-title">南京G捷号</view>
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

      <view class="section">
        <text class="g-title">所有报名</text>

        <uni-list v-if="allApplyList.length">
          <uni-list-item
            showArrow
            v-for="(apply, index) in allApplyList"
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
import { ref, computed, getCurrentInstance } from 'vue'
import type { ComponentInternalInstance } from 'vue'
import type { Activity } from '@/typings/activity'
import { queryActivityDetail } from '@/apis/activity'
import { queryAllApply } from '@/apis/apply'
import type { Apply } from '@/typings/apply'
import { onLoad, onShareAppMessage } from '@dcloudio/uni-app'

const activity = ref<Activity>({
  title: '',
  startTime: '',
  endTime: '',
  description: '',
  fieldList: [],
  groupList: [],
  showFlag: '1', // 1 显示 0 不显示
  id: ''
})
// 活动详情
const pageActivity = computed<Activity>(() => {
  return {
    ...activity.value,
    startTime: activity.value.startTime.replace('T', ' '),
    endTime: activity.value.endTime.replace('T', ' ')
  }
})
// 组织机构
const organizationName = ref<string>('')
// 所有报名
const allApplyList = ref<Apply[]>([])
const isShare = ref<boolean>(true)
// 分享相关
const shareRef = ref()
const instance = getCurrentInstance() as ComponentInternalInstance
const shareToggle = () => {
  const { refs } = instance
  // @ts-ignore
  refs.shareRef.open()
}
onShareAppMessage((res) => {
  if (res.from === 'button') {
    // 来自页面内分享按钮
    console.log(res.target)
  }
  return {
    title: activity.value.title,
    path: `/pages/bizActivityDetail/index?id=${activity.value.id}&isShare=1`
  }
})
const goToHome = () => uni.redirectTo({ url: '../hot/index' })

// 初始化
onLoad((option: any) => {
  isShare.value = option.isShare === '1'

  queryActivityDetail(option.id).then((ret) => {
    const { data } = ret
    activity.value = data.activity
    organizationName.value = data.organizationName
  })
  queryAllApply(option.id).then((ret) => {
    const { data } = ret
    allApplyList.value = data.allApplyList
  })
})
</script>
<style scoped lang="scss">
.activity-detail {
  padding: 5px 0;
  padding-bottom: 75px;
}
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
.actions {
  position: fixed;
  width: 100%;
  bottom: 0;
  background-color: #fff;
  z-index: 5;
}

.sign-up {
  display: flex;
  .home {
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
.isShare {
  padding-bottom: 50px !important;
}

</style>
