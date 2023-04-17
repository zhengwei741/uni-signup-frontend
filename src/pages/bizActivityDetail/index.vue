<template>
  <uni-container>
    <view class="activity-detail">
      <uni-activityDetail
        :activity="activity"
        :organizationName="organizationName"
        :is-shadow="false"
        :is-full="true"
        @onTapHomeLink="onTapHomeLink"
      >
        <template #cancelApply>
          <view class="section">
            <text class="g-title list-title">取消的报名</text>
            <uni-list v-if="cancelApplyList.length">
              <uni-list-item
                showArrow
                v-for="(apply, index) in cancelApplyList"
                :title="`${index + 1}、${apply.name}`"
                :rightText="apply.groupName"
                :index="apply.id"
                @tap="showApply(apply, true)"
              />
            </uni-list>
            <uni-empty v-else></uni-empty>
          </view>
        </template>

        <template #allApplyList>
          <view class="section">
            <text class="g-title list-title">所有报名</text>
            <uni-list v-if="allApplyList.length">
              <uni-list-item
                showArrow
                v-for="(apply, index) in allApplyList"
                :title="`${index + 1}、${apply.name}`"
                :rightText="apply.groupName"
                :index="apply.id"
                @tap="() => showApply(apply)"
              />
            </uni-list>
            <uni-empty v-else></uni-empty>
          </view>
        </template>
      </uni-activityDetail>
      <view class="actions">
        <uni-grid :column="5" :show-border="false" :square="false">
          <uni-grid-item @tap="shareToggle">
            <view class="grid-item-box">
              <uni-icons
                custom-prefix="iconfont"
                type="icon-fenxiang3"
                :size="20"
                color="#777"
              ></uni-icons>
              <text class="text">分享</text>
            </view>
          </uni-grid-item>
          <uni-grid-item @tap="gotoEdit">
            <view class="grid-item-box">
              <uni-icons
                custom-prefix="iconfont"
                type="icon-bianji"
                :size="20"
                color="#777"
              ></uni-icons>
              <text class="text">编辑</text>
            </view>
          </uni-grid-item>
          <uni-grid-item @tap="exportXlsx">
            <view class="grid-item-box">
              <uni-icons
                custom-prefix="iconfont"
                type="icon-daochu"
                :size="20"
                color="#777"
              ></uni-icons>
              <text class="text">导出</text>
            </view>
          </uni-grid-item>
          <uni-grid-item @tap="gotoCashOut">
            <view class="grid-item-box">
              <uni-icons
                custom-prefix="iconfont"
                type="icon-tixian1"
                :size="20"
                color="#777"
              ></uni-icons>
              <text class="text">提现</text>
            </view>
          </uni-grid-item>
          <uni-grid-item @tap="gotoSingupPage">
            <view class="grid-item-box">
              <uni-icons
                custom-prefix="iconfont"
                type="icon-sign"
                :size="20"
                color="#777"
              ></uni-icons>
              <text class="text">报名</text>
            </view>
          </uni-grid-item>
        </uni-grid>
      </view>
    </view>
    <uni-shard ref="shareRef"></uni-shard>

    <uni-popup ref="popupRef" type="dialog">
      <uni-apply-dialog
        :applyInfo="applyInfo"
        :showCancelApply="isShowCancelApply"
        @cancelApplyAndRawback="cancelApplyAndRawback"
        @cancelApply="cancelApply"
      ></uni-apply-dialog>
    </uni-popup>
  </uni-container>
</template>
<script setup lang="ts">
import { ref, getCurrentInstance } from 'vue'
import type { ComponentInternalInstance } from 'vue'
import { onShareAppMessage } from '@dcloudio/uni-app'
import { useActivityDetail } from '@/hooks/useActivityDetail'
import type { Apply, ApplyInfo } from '@/typings/apply'
import {
  queryApplyDetail,
  delApply,
  delApplyRefund,
  exportPersonXlsx
} from '@/apis/apply'
import { useDownloadFile } from '@/hooks/useDownloadFile'
import { toFront } from '@/utils'

const { activity, organizationName, allApplyList, cancelApplyList, refresh } =
  useActivityDetail({ allApply: true, cancelApply: true, showAlway: true })
// 分享相关
const shareRef = ref()
const instance = getCurrentInstance() as ComponentInternalInstance
const shareToggle = () => {
  // @ts-ignore
  instance.refs.shareRef.open()
}
onShareAppMessage((res) => {
  return {
    title: activity.value.title,
    path: `/pages/visitorActivityDetail/index?id=${activity.value.id}`
  }
})

const gotoSingupPage = () => {
  if (activity.value.status === '1') {
    uni.showToast({
      title: '报名已结束',
      icon: 'none'
    })
    return
  }
  uni.navigateTo({
    url: `../singupPage/index?id=${activity.value.id}`,
    events: {
      onSingSuccess() {
        refresh()
      }
    }
  })
}

const gotoCashOut = () => {
  uni.navigateTo({
    url: `/pages/cashOut/index?id=${activity.value.id}&title=${activity.value.title}`
  })
}

const gotoEdit = () => {
  uni.navigateTo({
    url: `/pages/createActivity/index?activityId=${activity.value.id}`,
    events: {
      onActiveSaveSuccess() {
        refresh()
      }
    }
  })
}

const onTapHomeLink = () => {
  uni.navigateTo({
    url: `/pages/bizHomePage/index?creater=${activity.value.creater}`
  })
}

const applyInfo = ref<ApplyInfo>()
const isShowCancelApply = ref(false)
// 显示信息
const showApply = (apply: Apply, isCancelApply = false) => {
  isShowCancelApply.value = isCancelApply
  queryApplyDetail(apply.id).then((ret) => {
    applyInfo.value = {
      ...ret.data,
      money: toFront(ret.data.money)
    }
    // @ts-ignore
    instance.refs.popupRef.open('center')
  })
}
// 取消报名
const cancelApply = (close: () => void) => {
  uni.showModal({
    content: `确定要取消该报名？`,
    success({ confirm }) {
      if (confirm) {
        if (applyInfo.value) {
          delApply(applyInfo.value.id).then(() => {
            close()
            return refresh()
          })
        }
      }
    }
  })
}
// 取消报名并退款
const cancelApplyAndRawback = (close: () => void) => {
  if (applyInfo.value?.money === 0) {
    uni.showToast({
      title: '费用为0不可退款',
      icon: 'none'
    })
    return
  }
  uni.showModal({
    content: `确定要取消该报名并退款？`,
    success({ confirm }) {
      if (confirm) {
        if (applyInfo.value) {
          delApplyRefund(applyInfo.value.id, applyInfo.value.activityId).then(
            () => {
              close()
              return refresh()
            }
          )
        }
      }
    }
  })
}
// 导出相关
const exportXlsx = async () => {
  uni.showLoading({ title: '下载中' })

  const { data } = await exportPersonXlsx(activity.value.id || '')

  useDownloadFile(data, '导出人员.xlsx')
    .then(({ savedFilePath, fileUrl }) => {
      uni.setClipboardData({
        data: fileUrl,
        success() {
          uni.showModal({
            content: `文件下载地址已复制，可以通过第三方浏览器下载！确认立即打开吗？`,
            success({ confirm }) {
              if (confirm) {
                uni.openDocument({ filePath: savedFilePath })
              }
            }
          })
        }
      })
    })
    .catch(() => {
      uni.showToast({ title: '下载失败', icon: 'error' })
    })
    .finally(uni.hideLoading)
}
</script>
<style scoped lang="scss">
.activity-detail {
  padding: 5px 0;
  padding-bottom: 75px;
}
.actions {
  position: fixed;
  width: 100%;
  bottom: 0;
  background-color: #fff;
  z-index: 5;
  border-top: 1px solid #d6d6d6;
}
</style>
