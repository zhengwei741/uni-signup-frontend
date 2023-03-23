<template>
  <uni-container>
    <view class="warpper">
      <image
        mode="aspectFit"
        v-if="bizInfo?.logoImgName"
        :src="URL + '/' + bizInfo?.logoImgName"
        style="width: 100%; background-color: #fff"
      ></image>

      <view class="biz-info" id="biz-info">
        <view>
          <text class="f-b">发布人：</text>
          <text>{{ bizInfo?.userName || '未认证' }}</text>
        </view>
        <view>
          <text class="f-b">手机号：</text>
          <text>{{ bizInfo?.mobile || '未认证' }}</text>
        </view>
      </view>

      <view
        class="activity-card"
        v-if="list.length"
        v-for="item of list"
        :key="item.id"
        @tap.stop="gotoActivityDetail(item.id)"
      >
        <view class="activity-card__content">
          <view :span="24">
            <view class="activity-card__content__title">{{ item.title }}</view>
          </view>
          <view class="activity-card__actions">
            <view class="tag">
              <text :style="getStatusStyle(item.activityStatus)">{{
                item.activityStatus
              }}</text>
            </view>
          </view>
        </view>
      </view>
      <uni-empty v-else></uni-empty>
      <uni-load-more v-if="list.length" iconType="circle" :status="status" />
    </view>
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
      </view>
    </view>
    <uni-shard ref="shareRef"></uni-shard>
  </uni-container>
</template>
<script setup lang="ts">
import { ref, getCurrentInstance } from 'vue'
import type { ComponentInternalInstance } from 'vue'
import { onLoad, onShareAppMessage } from '@dcloudio/uni-app'
import { getStatusStyle } from '@/utils'
import type { BizInfo } from '@/typings/user'
import type { HotActivity } from '@/typings/activity'
import { queryActivityByCreater } from '@/apis/activity'
import { queryBizInfo } from '@/apis/user'
import { URL } from '@/const'
import { usePageScroll } from '@/hooks/usePageScroll'
import { onReachBottom } from '@dcloudio/uni-app'

const bizInfo = ref<BizInfo>()
const creater = ref('')

const { refresh, next, status, list } = usePageScroll<HotActivity[]>({
  action({ pageNo, pageSize }) {
    return queryActivityByCreater({ creater: creater.value, pageNo, pageSize }).then((ret) => {
      const pageInfo = ret.data.pageInfo
      return {
        list: pageInfo.list,
        total: pageInfo.total,
        isLastPage: pageInfo.isLastPage,
        isFristPage: pageInfo.isFirstPage
      }
    })
  }
})

// 上拉加载
onReachBottom(next)
onLoad((option: any) => {
  creater.value = option.creater
  queryBizInfo(option.creater).then((ret) => {
    const { data } = ret
    bizInfo.value = data
  })
  refresh()
})

const goToHome = () => {
  uni.navigateBack({
    fail(result) {
      uni.switchTab({
        url: '/pages/hot/index'
      })
    }
  })
}
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
    title: `${bizInfo.value?.userName}的主页`,
    path: `/pages/bizHomePage/index?creater=${creater.value}`
  }
})
// 跳转详情
const gotoActivityDetail = (id: string) => {
  uni.navigateTo({
    url: `/pages/visitorActivityDetail/index?id=${id}`,
    fail() {
      uni.reLaunch({
        url: `/pages/visitorActivityDetail/index?id=${id}`
      })
    }
  })
}
</script>
<style scoped lang="scss">
.warpper {
  position: relative;
  padding-bottom: 50px;
  background-color: #f1f1f1;
}
.biz-info {
  background-color: #fff;
  padding: 10px;
  height: 60px;
  > view {
    padding: 5px 0;
  }
  .f-b {
    font-weight: bold;
  }
}
.activity-card {
  padding: 0 10px;
  position: relative;
  box-shadow: 0 0px 6px 1px rgb(165 165 165 / 40%);
  margin: 10px;
  padding: 0 8px;
  border-radius: 4px;
  overflow: hidden;
  font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB,
    Microsoft YaHei, SimSun, sans-serif;
  background-color: #fff;
  flex: 1;
  margin-bottom: 5px;
  .activity-card__content {
    padding: 10px;
    font-size: 14px;
    color: #6a6a6a;
    line-height: 22px;
    .activity-card__content__title {
      font-weight: bold;
      color: #3a3a3a;
    }
  }
  .activity-card__actions {
    display: flex;
    height: 40px;
    .tag {
      flex: 1;
    }
    .tag,
    .del-btn {
      display: flex;
      align-items: center;
    }
    .del-btn {
      width: 70px;
    }
  }
}
.actions {
  position: fixed;
  width: 100%;
  bottom: 0;
  background-color: #fff;
  z-index: 5;
  border-top: 1px solid #d6d6d6;
  height: 60px;
  .sign-up {
    display: flex;
    height: 100%;
    .cell {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      font-size: 12px;
      color: #3498db;
    }
  }
}
</style>
