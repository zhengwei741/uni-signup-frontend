<template>
  <uni-search-bar
    @confirm="searchHandel"
    v-model="searchValue"
    placeholder="活动名称"
  >
  </uni-search-bar>

  <uni-scroll :getData="getData" :height="height">
    <template v-slot="{ item }">
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
                <text class="uni-card__header-content-title uni-ellipsis">{{
                  item.name
                }}</text>
                <view class="uni-card__header-content-subtitle">
                  <uni-tag text="标签" type="primary" />
                </view>
              </view>
            </view>
          </view>
          <view class="uni-card__content">
            <text class="org-name">幕间咖啡</text>
            <text class="org-link" @tap="onClick">Ta的主页</text>
          </view>
        </view>
      </view>
    </template>
  </uni-scroll>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import useSafeScrollHeight from '@/hooks/useSafeScrollHeight'
import { login } from '@/apis'

// height 56是searchBar高度
const height = useSafeScrollHeight() - 56

// search
const searchValue = ref('')
const searchHandel = (value: string) => {
  console.log(value)
}
// data
const getData = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        list: [
          {
            name: '活动1活动1活动1活动1活动1活动1活动1活动1活动1活动1活动1活动1活动1活动1活动1活动1活动1活动1活动1活动1活动1活动1活动1活动1活动1活动1活动1活动1活动1活动1活动1活动1'
          }
        ]
      })
    }, 1000)
  })
}
// click
const onClick = () => {
  login()
}
</script>
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
          line-height: 36px;
        }
        .uni-card__header-content-subtitle {
          flex: 1;
          line-height: 36px;
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
    display: flex;
    justify-content: space-between;
    align-items: center;
    .org-name {
      flex: 2;
    }
    .org-link {
      color: #3498db;
      flex: 1;
      text-align: right;
    }
  }
}
</style>
