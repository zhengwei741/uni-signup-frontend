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
      <uni-dialog
        ref="dialogRef"
        title="报名信息"
        cancelText="关闭"
        confirmText="取消报名"
      >
        <view class="container">
          <view class="apply-list">
            <view class="apply-list_item">
              <view class="list-item_groupName">组别:</view>
              <view class="list-item_value">{{ applyInfo?.groupName }}</view>
            </view>
            <view class="apply-list_item">
              <view class="list-item_groupName">昵称:</view>
              <view class="list-item_value">{{ applyInfo?.name }}</view>
            </view>
            <view class="apply-list_item">
              <view class="list-item_groupName">手机:</view>
              <view class="list-item_value">{{ applyInfo?.mobile }}</view>
            </view>
            <view class="apply-list_item">
              <view class="list-item_groupName">报名费(￥):</view>
              <view class="list-item_value">{{ applyInfo?.money }}</view>
            </view>
            <view class="apply-list_item">
              <view class="list-item_groupName">操作时间:</view>
              <view class="list-item_value" style="white-space: nowrap">{{
                applyInfo?.updateTime.replace('T', ' ')
              }}</view>
            </view>

            <view
              class="apply-list_item"
              v-for="(apply, index) in applyInfo?.fieldList"
              :key="index"
            >
              <view class="list-item_groupName">{{ apply.fieldName }}:</view>
              <view class="list-item_value">{{ apply.fieldValue }}</view>
            </view>
          </view>
        </view>
        <template #buttonGroup>
          <view class="button-group">
            <view class="dialog-button" @tap="close">
              <text class="dialog-button-text">关闭</text>
            </view>
            <view class="dialog-button border-left" v-if="!isShowCancelApply">
              <text
                class="dialog-button-text button-color"
                style="width: 80%; text-align: center"
                @tap="cancelApplyAndRawback"
                >取消报名并退款</text
              >
            </view>
            <view
              class="dialog-button border-left"
              @tap="cancelApply"
              v-if="!isShowCancelApply"
            >
              <text class="dialog-button-text button-color">取消报名</text>
            </view>
          </view>
        </template>
      </uni-dialog>
    </uni-popup>
  </uni-container>
</template>
<script setup lang="ts">
import { ref, getCurrentInstance } from 'vue'
import type { ComponentInternalInstance } from 'vue'
import { onShareAppMessage } from '@dcloudio/uni-app'
import { useActivityDetail } from '@/hooks/useActivityDetail'
import type { Apply, ApplyInfo } from '@/typings/apply'
import { queryApplyDetail, delApply, delApplyRefund } from '@/apis/apply'
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

const popupRef = ref()
const dialogRef = ref()
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
const close = () => {
  // @ts-ignore
  instance.refs.dialogRef.close()
}
// 取消报名
const cancelApply = () => {
  uni.showModal({
    content: `确定要取消该报名？`,
    success({ confirm }) {
      if (confirm) {
        if (applyInfo.value) {
          delApply(applyInfo.value.id).then(() => {
            // @ts-ignore
            instance.refs.dialogRef.close()
            return refresh()
          })
        }
      }
    }
  })
}
// 取消报名并退款
const cancelApplyAndRawback = () => {
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
              // @ts-ignore
              instance.refs.dialogRef.close()
              return refresh()
            }
          )
        }
      }
    }
  })
}
// 导出相关
const exportXlsx = () => {
  uni.showLoading({ title: '下载中' })
  useDownloadFile(
    `/api/apply/mini/exportPersonXlsx/${activity.value.id}`,
    '导出人员.xlsx'
  )
    .then((filePath) => {
      uni.showModal({
        content: `文件已下载完成,是否直接打开`,
        success({ confirm }) {
          if (confirm) {
            uni.openDocument({ filePath })
          }
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
.container {
  height: 40vh;
  width: 80vw;
  overflow-y: scroll;
  .apply-list {
    width: 100%;
    .apply-list_item {
      display: flex;
      padding: 12px 15px;
      border-bottom: 1px solid #d6d6d6;
      .list-item_groupName,
      .list-item_value {
        flex: 1;
        font-size: 14px;
        color: #3b4144;
        display: flex;
        align-items: center;
      }
      .list-item_value {
        color: #999;
        font-size: 12px;
        justify-content: flex-end;
      }
    }
  }
}

.button-group {
  display: flex;
  flex-direction: row;
  border-top-color: #f5f5f5;
  border-top-style: solid;
  border-top-width: 1px;
  .dialog-button {
    display: flex;
    flex: 1;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    height: 45px;
  }
  .border-left {
    border-left-color: #f0f0f0;
    border-left-style: solid;
    border-left-width: 1px;
  }
  .dialog-button-text {
    font-size: 16px;
    color: #333;
  }
  .button-color {
    color: #007aff;
  }
}
</style>
<style lang="scss">
.hide-confirm {
  ::v-deep .uni-border-left {
    display: none !important;
  }
}
</style>
