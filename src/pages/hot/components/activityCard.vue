<template>
  <view class="activity-card">
    <view class="uni-card uni-shadow uni-border">
      <view class="uni-card__header">
        <view class="uni-card__header-box">
          <view class="uni-card__header-avatar">
            <image
              src="https://web-assets.dcloud.net.cn/unidoc/zh/unicloudlogo.png"
              class="uni-card__header-avatar-image"
            ></image>
          </view>
          <view class="uni-card__header-content">
            <text class="uni-card__header-content-title uni-ellipsis"
              >活动那个活动那个活动那个活动那个活动那个</text
            >
            <view class="uni-card__header-content-subtitle">
              <uni-tag text="标签" type="primary" />
            </view>
          </view>
        </view>
      </view>
      <view class="uni-card__content">
        <text class="uni-body">幕间咖啡Ta的主页</text>
      </view>
    </view>
  </view>
</template>
<style lang="scss" scoped>
.activity-card {
  .uni-card {
    margin: 10px;
    padding: 0 8px;
    border-radius: 4px;
    overflow: hidden;
    font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB,
      Microsoft YaHei, SimSun, sans-serif;
    background-color: #fff;
    flex: 1;
  }
  .uni-shadow {
    position: relative;
    box-shadow: 0 0px 6px 1px rgba(165, 165, 165, 0.2);
  }
  .uni-border {
    border: 1px solid #ebeef5;
  }
  .uni-card__header {
    display: flex;
    border-bottom: 1px #ebeef5 solid;
    flex-direction: row;
    align-items: center;
    padding: 10px;
    overflow: hidden;
    .uni-card__header-box {
      display: flex;
      flex: 1;
      flex-direction: row;
      align-items: center;
      overflow: hidden;
      .uni-card__header-avatar {
        width: 70px;
        height: 70px;
        overflow: hidden;
        border-radius: 5px;
        margin-right: 10px;
        .uni-card__header-avatar-image {
          flex: 1;
          width: 70px;
          height: 70px;
        }
      }
      .uni-card__header-content {
        height: 70px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        flex: 1;
        overflow: hidden;
        .uni-card__header-content-title {
          flex: 1;
          font-size: 15px;
          color: #3a3a3a;
          display: flex;
          align-items: center;
        }
        .uni-card__header-content-subtitle {
          flex: 1;
        }
        .uni-ellipsis {
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
      }
    }
  }
  .uni-card__content {
    padding: 10px;
    font-size: 14px;
    color: #6a6a6a;
    line-height: 22px;
  }
}
</style>
