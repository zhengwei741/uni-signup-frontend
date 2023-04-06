<template>
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
        <view class="apply-list_item">
          <view class="list-item_groupName">状态:</view>
          <view class="list-item_value">{{ applyInfo?.statusDesc }}</view>
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
        <view class="dialog-button border-left" v-if="!showCancelApply">
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
          v-if="!showCancelApply"
        >
          <text class="dialog-button-text button-color">取消报名</text>
        </view>
      </view>
    </template>
  </uni-dialog>
</template>

<script setup lang="ts">
import { computed, getCurrentInstance } from 'vue'
import type { ComponentInternalInstance } from 'vue'
import type { ApplyInfo } from '@/typings/apply'

// props
const props = withDefaults(
  defineProps<{ applyInfo: ApplyInfo; showCancelApply: boolean }>(),
  {
    showCancelApply: true
  }
)

const applyInfo = computed(() => props.applyInfo)

// emits
const emits = defineEmits<{
  (e: 'cancelApplyAndRawback', close: () => void): void
  (e: 'cancelApply', close: () => void): void
}>()

const instance = getCurrentInstance() as ComponentInternalInstance
const close = () => {
  // @ts-ignore
  instance.refs.dialogRef.close()
}
const cancelApplyAndRawback = () => emits('cancelApplyAndRawback', close)
const cancelApply = () => emits('cancelApply', close)
</script>
<style lang="scss" scoped>
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
