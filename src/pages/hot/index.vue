<template>
  <uni-search-bar
    @blur="searchHandel"
    @cancel="onCancelHandel"
    v-model="searchValue"
    placeholder="活动名称"
  >
  </uni-search-bar>

  <uni-scroll
    v-if="activeList.length"
    :list="activeList"
    :height="scrollHeight"
    :isNoMore="isLastPage"
    pullUp
    @onPullUp="onPullUp"
  >
    <template #default="{ item }">
      <view class="activity-card">
        <view class="uni-card uni-shadow uni-border">
          <view class="uni-card__header">
            <view class="uni-card__header-box">
              <view class="uni-card__header-avatar">
                <image
                  mode="aspectFill"
                  :src="URL + '/' + item.logoImgName"
                  :lazy-load="true"
                  class="uni-card__header-avatar-image"
                ></image>
              </view>
              <view class="uni-card__header-content">
                <text class="uni-card__header-content-title">{{
                  item.title
                }}</text>
                <view class="uni-card__header-content-subtitle">
                  <text :style="getStatusStyle(item.activityStatus)">{{
                    item.activityStatus
                  }}</text>
                </view>
              </view>
            </view>
          </view>
          <view class="uni-card__content" @tap="gotoHonePage(item)">
            <text class="org-name">{{ item.organizationName }}</text>
            <text class="org-link">Ta的主页</text>
          </view>
        </view>
      </view>
    </template>
  </uni-scroll>

  <uni-empty v-else></uni-empty>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import useSafeScrollHeight from '@/hooks/useSafeScrollHeight'
import { queryHotActivity } from '@/apis/activity'
import type { HotActivity } from '@/typings/activity'
import { usePagination } from '@/hooks/usePagination'
import { getStatusStyle } from '@/utils'
import { URL } from "@/const";

// height 56是searchBar高度
const scrollHeight = useSafeScrollHeight() - 56

// 搜索相关
const searchValue = ref<string>('')
const searchHandel = (param: Record<string, string>) => {
  const { value } = param
  searchValue.value = value
  refresh()
}
const onCancelHandel = () => {
  searchValue.value = ''
  refresh()
}

// 分页相关
const { next, refresh, isLastPage } = usePagination({
  pageNo: 1,
  pageSize: 10,
  onChange({ pageNo, pageSize, type }) {
    const _type = type === 'next' ? 'append' : 'init'
    return getHotActivityList(_type, pageNo, pageSize)
  }
})
// 列表相关
let activeList = ref<HotActivity[]>([])
// 上拉加载
const onPullUp = (close: () => void) => next(close)
const getHotActivityList = (type: string = 'init', pageNo = 1, pageSize = 30) =>
  queryHotActivity({
    title: searchValue.value,
    pageNo,
    pageSize
  }).then((ret) => {
    const pageInfo = ret.data.pageInfo
    if (type === 'init') {
      activeList.value = pageInfo.list
    } else {
      activeList.value = activeList.value.concat(pageInfo.list)
    }
    return {
      total: pageInfo.total,
      isLastPage: pageInfo.isLastPage,
      isFristPage: pageInfo.isFirstPage
    }
  })

// 跳转
const gotoHonePage = (item: HotActivity) => {
  uni.navigateTo({
    url: `../bizHomePage/index?creater=${item.creater}`
  })
}

// 初始化
onMounted(() => {
  refresh()
})
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
    flex-direction: row;
    align-items: center;
    padding: 10px 10px 10px 0;
    overflow: hidden;
    .uni-card__header-box {
      display: flex;
      flex: 1;
      flex-direction: row;
      align-items: center;
      overflow: hidden;
      .uni-card__header-avatar {
        width: 105px;
        height: 70px;
        overflow: hidden;
        border-radius: 5px;
        margin-right: 10px;
        .uni-card__header-avatar-image {
          flex: 1;
          width: 105px;
          height: 70px;
        }
      }
      .uni-card__header-content {
        display: flex;
        flex-direction: column;
        justify-content: center;
        flex: 1;
        overflow: hidden;
        .uni-card__header-content-title {
          flex: 1;
          font-size: 15px;
          color: #3a3a3a;
          font-weight: bold;
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
    background-color: #e4fafc;
    border-radius: 5px;
    margin-bottom: 10px;
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
