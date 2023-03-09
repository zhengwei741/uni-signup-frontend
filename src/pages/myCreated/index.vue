<template>
  <image mode="aspectFit" src="https://web-assets.dcloud.net.cn/unidoc/zh/shuijiao.jpg" style="width: 100%"></image>

  <uni-grid :column="4" :show-border="false" :square="false">
  <uni-grid-item>
  <view class="grid-item-box" @tap="goCreateActivity">
    <uni-icons
      custom-prefix="iconfont"
      type="icon-fabuhuodong"
      :size="25"
      color="#777"
    ></uni-icons>
    <text class="text">发布活动</text>
  </view>
  </uni-grid-item>
  <uni-grid-item>
  <view class="grid-item-box">
    <uni-icons
      custom-prefix="iconfont"
      type="icon-fenxiang3"
      :size="25"
      color="#777"
    ></uni-icons>
    <text class="text">分享</text>
  </view>
  </uni-grid-item>
  <uni-grid-item>
  <view class="grid-item-box">
    <uni-icons
      custom-prefix="iconfont"
      type="icon-renzheng"
      :size="25"
      color="#777"
    ></uni-icons>
    <text class="text">认证</text>
  </view>
  </uni-grid-item>
  <uni-grid-item>
  <view class="grid-item-box">
    <uni-icons
      custom-prefix="iconfont"
      type="icon-jiaocheng"
      :size="25"
      color="#777"
    ></uni-icons>
    <text class="text">教程</text>
  </view>
  </uni-grid-item>
  </uni-grid>

  <view class="activity-card" v-for="activity in activityList" :key="activity.id">
    <view class="activity-card__content">
      <view :span="24">
        <view class="activity-card__content__title"
          >{{ activity.title }}</view
        >
      </view>
      <view class="activity-card__actions">
        <view class="tag">
          <text :style="getStatusStyle(activity.activityStatus)">{{ activity.activityStatus }}</text>
        </view>
        <view class="del-btn">
          <button type="warn" size="mini">删除</button>
        </view>
      </view>
    </view>
  </view>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import type { IHotActivity } from '@/typings/activity'
import { getStatusStyle } from '@/utils'

const activityList = ref<IHotActivity[]>([
  {
    organizationName: '',
    logoImgName: '',
    activityStatus: '报名中',
    creater: '',
    id: '1',
    title: '七夕交友联谊活动火热报名中（欢迎有兴趣的朋友报名啊。。。）',
  },
  {
    organizationName: '',
    logoImgName: '',
    activityStatus: '报名中',
    creater: '',
    id: '2',
    title: '七夕交友联谊活动火热报名中（欢迎有兴趣的朋友报名啊。。。）',
  },
  {
    organizationName: '',
    logoImgName: '',
    activityStatus: '报名中',
    creater: '',
    id: '3',
    title: '七夕交友联谊活动火热报名中（欢迎有兴趣的朋友报名啊。。。）',
  }
])

const goCreateActivity = () => {
  uni.navigateTo({
    url: '../createActivity/index'
  })
}

</script>
<style scoped lang="scss">
.grid-item-box {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 15px 0;
  .text {
    margin-top: 5px;
    font-size: 12px;
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
  font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB, Microsoft YaHei, SimSun, sans-serif;
  background-color: #fff;
  flex: 1;
  margin-bottom: 5px;
  .activity-card__content {
    padding: 10px;
    font-size: 14px;
    color: #6a6a6a;
    line-height: 22px;
    .activity-card__content__title{
      font-weight: bold;
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
</style>
