<template>
  <uni-logoImage :src="logoImgName"></uni-logoImage>

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
      <view class="grid-item-box" @tap="shareToggle">
        <uni-icons
          custom-prefix="iconfont"
          type="icon-fenxiang3"
          :size="25"
          color="#777"
        ></uni-icons>
        <text class="text">分享</text>
      </view>
    </uni-grid-item>
    <uni-grid-item v-if="!organizationName">
      <view class="grid-item-box" @tap="goBizAuth">
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

  <view v-if="list.length" style="background-color: #f1f1f1; padding-top: 1px">
    <view
      class="activity-card"
      v-for="activity in list"
      :key="activity.id"
      @tap.stop="goToBizActivityDetail(activity.id)"
    >
      <view class="activity-card__content">
        <view :span="24">
          <view class="activity-card__content__title">{{
            activity.title
          }}</view>
        </view>
        <view class="activity-card__actions">
          <view class="tag">
            <text :style="getStatusStyle(activity.activityStatus)">{{
              activity.activityStatus
            }}</text>
          </view>
          <view class="del-btn">
            <button type="warn" size="mini" @tap.stop="deleteAct(activity.id)">
              删除
            </button>
          </view>
        </view>
      </view>
    </view>
    <uni-load-more v-if="list.length" iconType="circle" :status="status" />
  </view>
  <uni-empty v-else />
  <uni-shard ref="shareRef"></uni-shard>
</template>
<script setup lang="ts">
import { onMounted, ref, getCurrentInstance } from 'vue'
import type { ComponentInternalInstance } from 'vue'
import { queryActivityByBiz, deleteActivity } from '@/apis/activity'
import { queryPersonalInfo } from '@/apis/user'
import type { HotActivity } from '@/typings/activity'
import { getStatusStyle } from '@/utils'
import { usePageScroll } from '@/hooks/usePageScroll'
import { onReachBottom, onShareAppMessage } from '@dcloudio/uni-app'

// 组织机构名称 是否认证过
const organizationName = ref<string>('')
const logoImgName = ref<string>('')
const userName = ref<string>('')

const goCreateActivity = () => {
  uni.navigateTo({
    url: '../createActivity/index',
    events: {
      onActiveSaveSuccess() {
        refresh()
      }
    }
  })
}

const goBizAuth = () => {
  uni.navigateTo({
    url: '../bizAuth/index',
    events: {
      onBizAuthSuccess(orgName: string) {
        organizationName.value = orgName
      }
    }
  })
}

const goToBizActivityDetail = (id: string) => {
  uni.navigateTo({
    url: `../bizActivityDetail/index?id=${id}`
  })
}

const deleteAct = (id: string) => {
  uni.showModal({
    content: `确定要删除该活动？`,
    success({ confirm }) {
      if (confirm) {
        deleteActivity(id).then(() => {
          refresh()
        })
      }
    }
  })
}

const { refresh, next, status, list } = usePageScroll<HotActivity[]>({
  action({ pageNo, pageSize }) {
    return queryActivityByBiz({ pageNo, pageSize }).then((ret) => {
      const { pageInfo } = ret.data
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
// 初始化
onMounted(() => {
  refresh()
  queryPersonalInfo().then((ret) => {
    organizationName.value = ret.data.organizationName
    logoImgName.value = ret.data.logoImgName
    userName.value = ret.data.userName
  })
})

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
    title: `${userName.value}的主页`,
    // TODO
    path: `/pages/bizHomePage/index?creater=${232984780246827008}`
  }
})
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
    font-size: 13px;
    color: #3498db;
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
</style>
