<template>
  <uni-container>
    <view class="warpper">
      <image
        mode="aspectFit"
        v-if="bizInfo?.logoImgName"
        :src="URL + '/'+ bizInfo?.logoImgName"
        style="width: 100%; background-color: #fff;"
      ></image>

      <view class="biz-info" id="biz-info">
        <view>
          <text class="f-b">发布人：</text>
          <text>{{ bizInfo?.userName }}</text>
        </view>
        <view>
          <text class="f-b">手机号：</text>
          <text>{{ bizInfo?.mobile }}</text>
        </view>
      </view>

      <view
        class="activity-card"
        v-if="list.length"
        v-for="item of list"
        :key="item.id"
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
    <div class="actions" id="actions">
      <button type="mini" class="btn">首页</button>
      <button type="mini" class="btn">分享</button>
    </div>
  </uni-container>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { getStatusStyle } from '@/utils'
import type { BizInfo } from '@/typings/user'
import type { HotActivity } from '@/typings/activity'
import { queryActivityByBiz } from '@/apis/activity'
import { queryBizInfo } from '@/apis/user'
import { URL } from '@/const'
import { usePageScroll } from '@/hooks/usePageScroll'
import { onReachBottom } from '@dcloudio/uni-app'

const bizInfo = ref<BizInfo>()

const { refresh, next, status, list } = usePageScroll<HotActivity[]>({
  action({ pageNo, pageSize }) {
    return queryActivityByBiz({ pageNo, pageSize }).then((ret) => {
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

onLoad((option) => {
  if (option && option.creater) {
    queryBizInfo(option.creater).then((ret) => {
      const { data } = ret
      bizInfo.value = data
      uni.setNavigationBarTitle({
        title: `${data.userName}的主页`
      })
    })
    refresh()
  }
})
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
  bottom: 0;
  width: 100%;
  display: flex;
  padding: 5px;
  height: 40px;
  display: flex;
  align-items: center;
  background-color: #fff;
  .btn {
    height: 30px;
    line-height: 30px;
    font-size: 12px;
  }
}
</style>
