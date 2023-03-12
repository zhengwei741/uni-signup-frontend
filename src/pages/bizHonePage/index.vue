<template>
  <image
    mode="aspectFit"
    :src="URL + bizInfo?.logoImgName"
    style="width: 100%"
    ref="imageRef"
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
        <view class="activity-card__content">
          <view :span="24">
            <view class="activity-card__content__title">{{
              item.title
            }}</view>
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
    </template>
  </uni-scroll>
  <uni-empty v-else></uni-empty>

  <div class="actions" id="actions">
    <button type="mini" class="btn">首页</button>
    <button type="mini" class="btn">分享</button>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { getStatusStyle } from '@/utils'
import type { BizInfo } from '@/typings/user'
import type { HotActivity } from '@/typings/activity'
import { queryActivityByBiz } from '@/apis/activity'
import { queryBizInfo } from '@/apis/user'
import { usePagination } from '@/hooks/usePagination'
import useSafeScrollHeight from '@/hooks/useSafeScrollHeight'
import { URL } from '@/const'

const bizInfo = ref<BizInfo>()
const activeList = ref<HotActivity[]>([])
// 240是图片
const scrollHeight = ref<number>(useSafeScrollHeight() - 240)
// 分页相关
const { next, refresh, isLastPage } = usePagination({
  pageNo: 1,
  pageSize: 10,
  onChange({ pageNo, pageSize, type }) {
    const _type = type === 'next' ? 'append' : 'init'
    return getBizActivityList(_type, pageNo, pageSize)
  }
})
// 上拉加载
const onPullUp = (close: () => void) => next(close)
const getBizActivityList = (type: string = 'init', pageNo = 1, pageSize = 30) =>
  queryActivityByBiz({
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

onLoad((option) => {
  if (option && option.creater) {
    queryBizInfo(option.creater).then(ret => {
      const { data } = ret
      bizInfo.value = data
    })
    refresh()
  }
})

const getElRect = async (cls: string): Promise<UniApp.NodeInfo> => {
  return new Promise((resolve) => {
    uni.createSelectorQuery().select(cls).boundingClientRect((data) => {
      resolve(data as UniApp.NodeInfo)
    }).exec()
  })
}

onMounted(async () => {
  uni.showLoading({})
  const info = await getElRect('#biz-info')
  const actions = await getElRect('#actions')
  if (info.height && actions.height) {
    scrollHeight.value = scrollHeight.value - info.height - actions.height
  }
  uni.hideLoading()
})

</script>
<style scoped lang="scss">
.biz-info{
  padding: 10px;
  height: 60px;
  >view {
    padding: 5px 0;
  }
  .f-b{
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
.actions{
  display: flex;
  padding: 5px;
  height: 40px;
  display: flex;
  align-items: center;
  .btn{
    height: 30px;
    line-height: 30px;
    font-size: 12px;
  }
}
</style>