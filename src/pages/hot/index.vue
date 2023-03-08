<template>
  <uni-search-bar
    @confirm="searchHandel"
    v-model="searchValue"
    placeholder="活动名称"
  >
  </uni-search-bar>

  <uni-scroll
    :list="activeList"
    :getData="getData"
    :height="height"
    pullUp
    @onPullUp="onPullUp"
    @onDropDown="onDropDown"
  >
    <template v-slot="{ item }">
      <view class="activity-card">
        <view class="uni-card uni-shadow uni-border">
          <view class="uni-card__header">
            <view class="uni-card__header-box">
              <view class="uni-card__header-avatar">
                <image
                  mode="aspectFill"
                  :src="() => getImgSrc(item.logoImgName)"
                  class="uni-card__header-avatar-image"
                ></image>
              </view>
              <view class="uni-card__header-content">
                <text class="uni-card__header-content-title">{{
                  item.name
                }}</text>
                <view class="uni-card__header-content-subtitle">
                  <uni-tag :text="item.activityStatus" :inverted="true" type="primary" />
                </view>
              </view>
            </view>
          </view>
          <view class="uni-card__content">
            <text class="org-name">{{ item.organizationName }}</text>
            <text class="org-link" @tap="onClick">Ta的主页</text>
          </view>
        </view>
      </view>
    </template>
  </uni-scroll>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import useSafeScrollHeight from '@/hooks/useSafeScrollHeight'
import { queryHotActivity } from '@/apis/activity'
import type { IHotActivity } from '@/apis/activity'
import { usePagination } from '@/hooks/usePagination'

// height 56是searchBar高度
const height = useSafeScrollHeight() - 56

// search
const searchValue = ref<string>('')
const searchHandel = (value: string) => {
  console.log(value)
}
// usePagination
const {
  next
} = usePagination({
  page: 1,
  pageSize: 10,
  onChange: ({ pageNo, pageSize }) => {
    queryHotActivity({ title: searchValue.value, pageNo, pageSize }).then(ret => {
      activeList.value = ret.data.pageInfo.list
    })
  }
})

const onPullUp = (close: () => void) => {
  queryHotActivity({ title: searchValue.value, pageNo: 1, pageSize: 10 }).then(ret => {
    activeList.value = activeList.value.concat(ret.data.pageInfo.list)
  }).finally(close)
}
const onDropDown = (close: () => void) => {
  queryHotActivity({ title: searchValue.value, pageNo: 1, pageSize: 10 }).then(ret => {
    activeList.value = ret.data.pageInfo.list
  }).finally(close)
}
// list
let activeList = ref<IHotActivity[]>([])
const getData = () => {
  queryHotActivity({
    title: '',
    pageNo: 1,
    pageSize: 10
  })
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        list: []
      })
    }, 1000)
  })
}
const url = import.meta.env.VITE_APP_URL
const getImgSrc = (logoImgName: string) => `${url}}${logoImgName}`
// click
const onClick = () => {}

onMounted(() => {
  queryHotActivity({ title: searchValue.value, pageNo: 1, pageSize: 10 }).then(ret => {
    activeList.value = ret.data.pageInfo.list
  })
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
    border-bottom: 1px #ebeef5 solid;
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
    background-color: #f2f2f2;
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
