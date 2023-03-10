<template>
  <uni-container>
    <view class="create-activity">
      <uni-forms
        ref="baseForm"
        :modelValue="activityFormData"
        label-position="top"
        label-width="100"
      >
        <uni-forms-item label="活动标题" required>
          <uni-easyinput
            v-model="activityFormData.title"
            placeholder="请输入活动标题"
          />
        </uni-forms-item>
        <uni-forms-item label="报名开始" required>
          <uni-datetime-picker
            type="datetime"
            return-type="timestamp"
            v-model="activityFormData.startTime"
          />
        </uni-forms-item>
        <uni-forms-item label="报名结束" required>
          <uni-datetime-picker
            type="datetime"
            return-type="timestamp"
            v-model="activityFormData.endTime"
          />
        </uni-forms-item>
        <uni-forms-item label="活动介绍">
          <uni-easyinput
            type="textarea"
            v-model="activityFormData.description"
            placeholder="请输入活动介绍"
          />
        </uni-forms-item>

        <view class="uni-forms-item">
          <view class="label">
            <text>显示报名人员</text>
          </view>
          <view class="switch">
            <switch
              checked
              color="#007aff"
              @change="(event: any) => activityFormData.showFlag = `${event.detail.value}`"
            />
          </view>
        </view>

        <text style="margin-bottom: 20px">报名填写信息</text>
        <view class="uni-forms-item activity-field">
          <view class="label">
            <text>组别</text>
          </view>
          <view class="switch">
            <button size="mini" @click="goToActivityGroup">编辑</button>
          </view>
        </view>
        <view class="uni-forms-item activity-field">
          <view class="label">
            <text>昵称</text>
          </view>
        </view>
        <view class="uni-forms-item activity-field">
          <view class="label">
            <text>手机号</text>
          </view>
        </view>

        <!-- 动态字段 start -->
        <view
          class="uni-forms-item activity-field"
          v-for="(field, index) of activityFields"
          :key="field.id"
        >
          <view class="label">
            <input
              placeholder="请输入需要添加的字段"
              v-model="field.fieldName"
            />
          </view>
          <view class="activity-field__actions">
            <text>必填</text>
            <switch
              style="transform: scale(0.7)"
              :checked="field.requiredFlag === '1'"
              @change="(event: any) => activityFields[index].requiredFlag = event.detail.value ? '1' : '0'"
              color="#007aff"
            />
            <button size="mini" @click="() => activityFields.splice(index, 1)">
              删除
            </button>
          </view>
        </view>

        <view class="uni-forms-item">
          <view style="justify-content: center; display: flex; flex: 1">
            <button size="mini" @click="addActivityField">添加报名字段</button>
          </view>
        </view>
        <!-- 动态字段 end -->

        <!-- 用户协议 start-->
        <view class="uni-forms-item" @tap.capture="() => (isAgree[0] = 0)">
          <uni-data-checkbox
            multiple
            v-model="isAgree"
            :localdata="[{ text: '已阅读并同意《用户服务协议》', value: 0 }]"
          ></uni-data-checkbox>
        </view>
        <!-- 用户协议 end-->

        <button :disabled="!canSubmit">发布活动</button>
      </uni-forms>
    </view>
  </uni-container>
</template>

<script setup lang="ts">
import { reactive, ref, computed } from 'vue'
import type { Activity, ActivityField, ActivityGroup } from '@/typings/activity'

// 活动字段
const activityFields = reactive<ActivityField[]>([])
const addActivityField = () => {
  activityFields.push({
    id: `${Math.random()}`,
    fieldValue: '',
    fieldName: '',
    requiredFlag: '1'
  })
}
// 活动组别
const activityGroups = ref<ActivityGroup[]>([])
const goToActivityGroup = () => {
  uni.navigateTo({
    url: '../activityGroup/index'
  })
}
// 活动表单
const activityFormData = reactive<Activity>({
  title: '',
  startTime: '',
  endTime: '',
  description: '',
  fieldList: activityFields,
  groupList: [],
  showFlag: '0'
})
// 用户服务协议
const isAgree = ref<number[]>([])
const canSubmit = computed(() => isAgree.value[0] === 0)
</script>
<style scoped lang="scss">
.create-activity {
  padding: 10px;
}
.uni-forms-item {
  display: flex;
  margin-bottom: 22px;
  flex-direction: row;
  align-items: center;
  .label {
    font-size: 14px;
    color: #606266;
    height: 25px;
    display: block;
    flex: 1;
  }
  .switch {
    text-align: right;
    flex: 1;
  }
}
.activity-field {
  border-bottom: 1px solid #e5e5e5;
  .activity-field__actions {
    display: flex;
    align-items: center;
    > button {
      height: 30px;
    }
  }
}
</style>
