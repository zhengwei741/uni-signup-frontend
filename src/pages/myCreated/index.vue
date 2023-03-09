<template>
  <uni-container>
    <image mode="aspectFit" :src="cover" style="width: 100%"></image>

    <uni-grid :column="4" :show-border="false" :square="false">
      <uni-grid-item>
        <view class="grid-item-box">
          <uni-icons
            custom-prefix="iconfont"
            type="icon-fabuhuodong"
            :size="30"
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
            :size="30"
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
            :size="30"
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
            :size="30"
            color="#777"
          ></uni-icons>
          <text class="text">教程</text>
        </view>
      </uni-grid-item>
    </uni-grid>

    <view class="activity-card">
      <view class="activity-card__content">
        <view :span="24">
          <view
            >七夕交友联谊活动火热报名中（欢迎有兴趣的朋友报名啊。。。）</view
          >
        </view>
        <view class="activity-card__actions">
          <view class="tag">
            <uni-tag :inverted="true" text="报名中" type="primary" />
          </view>
          <view class="del-btn">
            <button type="warn" size="mini">删除</button>
          </view>
        </view>
      </view>
    </view>
  </uni-container>
</template>
<script setup lang="ts">
const cover = 'https://web-assets.dcloud.net.cn/unidoc/zh/shuijiao.jpg'
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
  box-shadow: 0px 0px 3px 1px rgba(0, 0, 0, 0.08);
  margin-bottom: 5px;
  .activity-card__content {
    padding: 10px;
    font-size: 14px;
    color: #6a6a6a;
    line-height: 22px;
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
