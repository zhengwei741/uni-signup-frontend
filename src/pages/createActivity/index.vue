<template>
  <uni-container>
    <view class="create-activity forms-cls">
      <uni-forms
        ref="activityForm"
        :modelValue="activityFormData"
        label-position="top"
        label-width="100"
        :rules="{
          title: { rules: [
            { required: true, errorMessage: '活动标题不能为空' },
          ] },
          startTime: { rules: [
            { required: true, errorMessage: '开始时间不能为空' },
            { validateFunction: validateTime }
          ] },
          endTime: {
            rules: [
              { required: true, errorMessage: '结束时间不能为空' },
              { validateFunction: validateTime }
            ],
          },
          description: {
            rules: [{ required: true, errorMessage: '结束时间不能为空' }]
          }
        }"
      >
        <uni-forms-item label="活动标题" required name="title">
          <uni-easyinput
            v-model="activityFormData.title"
            maxlength="32"
            placeholder="请输入活动标题"
          />
        </uni-forms-item>
        <uni-forms-item label="报名开始" required name="startTime">
          <uni-datetime-picker
            type="datetime"
            return-type="timestamp"
            v-model="activityFormData.startTime"
          />
        </uni-forms-item>
        <uni-forms-item label="报名结束" required name="endTime">
          <uni-datetime-picker
            type="datetime"
            return-type="timestamp"
            v-model="activityFormData.endTime"
          />
        </uni-forms-item>
        <uni-forms-item label="活动介绍" required name="description">
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
            <uni-switch
              v-model:value="activityFormData.showFlag"
              size="mini"
              activeValue="1"
              inactiValue="0"
            />
          </view>
        </view>

        <text style="margin-bottom: 22px;font-weight: bold;color: #3a3a3a;display: block;font-size: 14px;">报名填写信息</text>

        <view class="uni-forms-item activity-field">
          <view class="label">
            <text style="font-weight: 500;">组别</text>
          </view>
          <view class="switch">
            <button size="mini" @click="goToActivityGroup">编辑</button>
          </view>
        </view>
        <view class="uni-forms-item activity-field">
          <view class="label">
            <text style="font-weight: 500;">昵称</text>
          </view>
        </view>
        <view class="uni-forms-item activity-field">
          <view class="label">
            <text style="font-weight: 500;">手机号</text>
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
            <uni-switch
              v-model:value="activityFields[index].requiredFlag"
              activeText="必填"
              size="mini"
              activeValue="1"
              inactiValue="0"
            />
            <button size="mini" type="warn" @click="() => activityFields.splice(index, 1)">
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

        <button :disabled="!canSubmit" @tap="publish">发布活动</button>
      </uni-forms>
    </view>
  </uni-container>
</template>

<script setup lang="ts">
import { reactive, ref, computed, unref, getCurrentInstance } from 'vue'
import type { ComponentInternalInstance } from 'vue'
import dayjs from 'dayjs'
import type { Activity, ActivityField, ActivityGroup } from '@/typings/activity'
import { insertActivity } from '@/apis/activity'
import { useEventChannel } from '@/hooks/useEventChannel'
import { getMockID } from '@/utils'

// 活动字段
const activityFields = reactive<ActivityField[]>([])
const addActivityField = () => {
  activityFields.push({
    id: getMockID(),
    fieldName: '',
    requiredFlag: '1'
  })
}
// 活动组别
let activityGroups = reactive<ActivityGroup[]>([
  { id: getMockID(), groupName: '团体', money: 0, peopleNumber: 0 }
])
// 活动表单
const activityFormData = reactive<Activity>({
  title: '',
  startTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
  endTime: dayjs().add(1, 'day').format('YYYY-MM-DD HH:mm:ss'),
  description: '',
  fieldList: activityFields,
  groupList: activityGroups,
  showFlag: '1'
})
const validateTime = (rule: any, value: string, data: Record<string, any>, callback: (msg: string) => void) => {
  const { startTime, endTime } = data
  if (dayjs(startTime).diff(dayjs(endTime)) > 0) {
    callback('开始时间不能小于结束时间')
  }
}
// 用户服务协议
const isAgree = ref<number[]>([])
const canSubmit = computed(() => isAgree.value[0] === 0)
// 跳转编辑组编
const goToActivityGroup = () => {
  uni.navigateTo({
    url: '../activityGroup/index',
    events: {
      onGroupSave: function(data: ActivityGroup[] = []) {
        // 不限制人数重置peopleNumber为0
        const saveData = data.map((group) => ({
          ...group,
          peopleNumber: group.limit ? group.peopleNumber : 0
        }))
        activityGroups = saveData
        // 重新获取引用
        activityFormData.groupList = activityGroups
      },
    },
    success: function(res) {
      // 通过eventChannel向被打开页面传送数据
      res.eventChannel.emit('onGroupOpen', unref(activityGroups))
    }
  })
}
// 发布活动相关
const instance = getCurrentInstance() as ComponentInternalInstance
let { eventChannel } = useEventChannel()
const removeMockId = () => {
  const remove = (item: any) => {
    if (item.id?.startsWith('mock_')) {
      delete item.id
    }
  }
  activityFields.forEach(remove)
  activityGroups.forEach(remove)
}
const publish = async () => {
  uni.showLoading({})
  try {
    const { refs } = instance
    // @ts-ignore
    await refs.activityForm.validate()
    // 移除前台构造id
    removeMockId()
    await insertActivity(activityFormData)
    uni.showToast({ title: '创建成功' })
    setTimeout(() => {
      uni.navigateBack()
      // 通知上层页面刷新
      if (eventChannel.value) {
        eventChannel.value.emit('onActiveSaveSuccess');
      }
    }, 300);
  } catch(e) {
    console.log(e)
  } finally {
    uni.hideLoading()
  }
}
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
