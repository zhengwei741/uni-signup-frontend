<template>
  <uni-container>
    <view class="activity-detail">
      <uni-activityDetail
        :activity="activity"
        :organizationName="organizationName"
        :is-shadow="false"
        :is-full="true"
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
                @tap="() => cancelApply(apply)"
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
      <uni-popup-dialog
        ref="dialogRef"
        title="报名信息"
        type="info"
        confirmText="取消报名"
        :before-close="true"
        @close="close"
        @confirm="confirm"
      >
        <view class="container">
          <uni-list>
            <uni-list-item title="组别:" :rightText="applyInfo?.groupName" />
            <uni-list-item title="昵称:" :rightText="applyInfo?.name" />
            <uni-list-item title="手机:" :rightText="applyInfo?.mobile" />
            <uni-list-item
              title="报名费用(元):"
              :rightText="`${applyInfo?.money}`"
            />
            <uni-list-item
              v-for="(apply, index) in applyInfo?.fieldList"
              :title="`${apply.fieldName}:`"
              :rightText="apply.fieldValue"
              :key="index"
            />
          </uni-list>
        </view>
      </uni-popup-dialog>
    </uni-popup>
  </uni-container>
</template>
<script setup lang="ts">
import { ref, getCurrentInstance } from 'vue'
import type { ComponentInternalInstance } from 'vue'
import { onShareAppMessage } from '@dcloudio/uni-app'
import { useActivityDetail } from '@/hooks/useActivityDetail'
import type { Apply, ApplyInfo } from '@/typings/apply'
import { queryApplyDetail, delApply } from '@/apis/apply'
import { useDownloadFile } from '@/hooks/useDownloadFile'
import { toFront } from '@/utils'

const { activity, organizationName, allApplyList, cancelApplyList, refresh } =
  useActivityDetail({ allApply: true, cancelApply: true })
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

const popupRef = ref()
const dialogRef = ref()
const applyInfo = ref<ApplyInfo>()
// 取消报名
const cancelApply = (apply: Apply) => {
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
const confirm = () => {
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
// 导出相关
const exportXlsx = () => {
  uni.showLoading({ title: '下载中' })
  useDownloadFile(
    `/api/apply/mini/exportPersonXlsx/${activity.value.id}`,
    '导出人员.xlsx'
  )
    .then((filePath) => {
      uni.showModal({
        // content: `文件已保存至:${filePath},是否直接打开`,
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
}
</style>
