<template>
  <uni-container>
    <image :src="cover" style="width: 100%"></image>

    <uni-grid :column="4" :show-border="false" :square="false">
      <uni-grid-item>
        <view class="grid-item-box">
          <uni-icons custom-prefix="iconfont" type="icon-fabuhuodong" :size="30" color="#777"></uni-icons>
          <text class="text">发布活动</text>
        </view>
      </uni-grid-item>
      <uni-grid-item>
        <view class="grid-item-box">
          <uni-icons custom-prefix="iconfont" type="icon-fenxiang3" :size="30" color="#777"></uni-icons>
          <text class="text">分享</text>
        </view>
      </uni-grid-item>
      <uni-grid-item>
        <view class="grid-item-box">
          <uni-icons custom-prefix="iconfont" type="icon-renzheng" :size="30" color="#777"></uni-icons>
          <text class="text">认证</text>
        </view>
      </uni-grid-item>
      <uni-grid-item>
        <view class="grid-item-box">
          <uni-icons custom-prefix="iconfont" type="icon-jiaocheng" :size="30" color="#777"></uni-icons>
          <text class="text">教程</text>
        </view>
      </uni-grid-item>
    </uni-grid>

    <view style="margin-bottom: 5px">
      <uni-card :isFull="true">
        <view>
          <uni-row>
            <uni-col :span="8">
              <view class="demo-uni-col dark"></view>
            </uni-col>
          </uni-row>
          <uni-row>
            <uni-col :span="12">
              <uni-tag>报名中</uni-tag>
            </uni-col>
            <uni-col :span="12">
              <view class="demo-uni-col dark"></view>
            </uni-col>
          </uni-row>
        </view>
      </uni-card>
    </view>

  </uni-container>
</template>
<script setup lang="ts">

const cover = 'https://web-assets.dcloud.net.cn/unidoc/zh/shuijiao.jpg'

const avatarList = [{
  url: 'https://web-assets.dcloud.net.cn/unidoc/zh/unicloudlogo.png'
}, {
  url: 'https://web-assets.dcloud.net.cn/unidoc/zh/unicloudlogo.png'
}, {
  url: 'https://web-assets.dcloud.net.cn/unidoc/zh/unicloudlogo.png'
}]

</script>
<style scoped lang="scss">
.grid-item-box {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 15px 0;
  .text{
    margin-top: 5px;
    font-size: 12px;
  }
}
.chat-custom-right {
	flex: 1;
	/* #ifndef APP-NVUE */
	display: flex;
	/* #endif */
	flex-direction: column;
	justify-content: space-between;
	align-items: flex-end;
}

.chat-custom-text {
	font-size: 12px;
	color: #999;
}

</style>
