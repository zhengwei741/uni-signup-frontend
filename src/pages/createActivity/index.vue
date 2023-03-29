<template>
  <uni-container>
    <view class="create-activity forms-cls">
      <uni-forms
        ref="activityForm"
        :modelValue="activityFormData"
        label-position="top"
        label-width="100"
        :rules="{
          title: {
            rules: [{ required: true, errorMessage: '活动标题不能为空' }]
          },
          startTime: {
            rules: [
              { required: true, errorMessage: '开始时间不能为空' },
              { validateFunction: validateTime }
            ]
          },
          endTime: {
            rules: [
              { required: true, errorMessage: '结束时间不能为空' },
              { validateFunction: validateTime }
            ]
          },
          description: {
            rules: [{ required: true, errorMessage: '活动介绍不能为空' }]
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
          <uni-dateTimePicker v-model="activityFormData.startTime"></uni-dateTimePicker>
        </uni-forms-item>
        <uni-forms-item label="报名结束" required name="endTime">
          <uni-dateTimePicker v-model="activityFormData.endTime"></uni-dateTimePicker>
        </uni-forms-item>
        <uni-forms-item label="活动介绍" required name="description">
          <uni-editer
            v-model="activityFormData.description"
            ref="uniEditerRef"
          ></uni-editer>
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

        <text class="text">报名填写信息</text>

        <view class="uni-forms-item activity-field">
          <view class="label">
            <text style="font-weight: 500">组别</text>
          </view>
          <view class="switch">
            <button size="mini" @click="goToActivityGroup">编辑</button>
          </view>
        </view>
        <view class="uni-forms-item activity-field">
          <view class="label">
            <text style="font-weight: 500">昵称</text>
          </view>
        </view>
        <view class="uni-forms-item activity-field">
          <view class="label">
            <text style="font-weight: 500">手机号</text>
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
              :disabled="!isMockId(field.id)"
              :maxlength="10"
            />
          </view>
          <view class="activity-field__actions">
            <uni-switch
              v-model:value="activityFields[index].requiredFlag"
              activeText="必填"
              size="mini"
              activeValue="1"
              inactiValue="0"
              @chagne="(value: any) => {
                onSwitchChagne(value, field)
              }"
            />
            <button size="mini" type="warn" @click="delField(field.id, index)">
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
        <!-- <view class="uni-forms-item" @tap.capture="() => (isAgree[0] = 0)"> -->
        <view class="uni-forms-item user-agreement">
          <uni-data-checkbox
            multiple
            v-model="isAgree"
            :localdata="[{ text: '', value: 0 }]"
          ></uni-data-checkbox>
          <text @tap="openUserAgreement"
            >已阅读并同意
            <text style="color: #007aff">《用户服务协议》</text>
          </text>
        </view>
        <!-- 用户协议 end-->

        <button :disabled="!canSubmit" @tap="publishOrEdit">
          {{ isEdit ? '保存' : '发布活动' }}
        </button>
      </uni-forms>

      <uni-userAgreement ref="agRef"></uni-userAgreement>
    </view>
  </uni-container>
</template>

<script setup lang="ts">
import { ref, computed, getCurrentInstance } from 'vue'
import type { ComponentInternalInstance } from 'vue'
import dayjs from 'dayjs'
import type { Activity, ActivityField, ActivityGroup } from '@/typings/activity'
import {
  insertActivity,
  queryActivityDetail,
  queryActivityField,
  deleteField,
  modifyField,
  modifyActivity
} from '@/apis/activity'
import { useEventChannel } from '@/hooks/useEventChannel'
import { getMockID, formatTime, toBack, isMockId, toFront } from '@/utils'
import { onLoad } from '@dcloudio/uni-app'

// 活动字段
const activityFields = ref<ActivityField[]>([])
const addActivityField = () => {
  activityFields.value.push({
    id: getMockID(),
    fieldName: '',
    requiredFlag: '1'
  })
}
// 活动组别
let activityGroups = ref<ActivityGroup[]>([
  { id: getMockID(), groupName: '团体', money: 0, peopleNumber: 0 }
])
// 活动表单
const activityFormData = ref<Activity>({
  title: '',
  startTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
  endTime: dayjs().add(1, 'day').format('YYYY-MM-DD HH:mm:ss'),
  description: '',
  fieldList: activityFields.value,
  groupList: activityGroups.value,
  showFlag: '1'
})
const validateTime = (
  rule: any,
  value: string,
  data: Record<string, any>,
  callback: (msg: string) => void
) => {
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
    url: `../activityGroup/index?activityId=${activityId.value}`,
    events: {
      onGroupSave: function (data: ActivityGroup[] = []) {
        // 不限制人数重置peopleNumber为0
        const saveData = data.map((group) => ({
          ...group,
          peopleNumber: group.limit ? group.peopleNumber : 0,
          money: Number(group.money)
        }))
        activityGroups.value = saveData
        // 重新获取引用
        activityFormData.value.groupList = activityGroups.value
      }
    },
    success: function (res) {
      // 通过eventChannel向被打开页面传送数据
      res.eventChannel.emit(
        'onGroupOpen',
        JSON.parse(JSON.stringify(activityGroups.value))
      )
    }
  })
}
// 发布活动相关
const instance = getCurrentInstance() as ComponentInternalInstance
const { eventChannel } = useEventChannel()
const uniEditerRef = ref()
const removeMockId = () => {
  const remove = (item: any) => {
    if (isMockId(item.id)) {
      delete item.id
    }
  }
  activityFields.value.forEach(remove)
  activityGroups.value.forEach(remove)
}
const validateFields = async () => {
  const ret = activityFields.value.some((field) => field.fieldName === '')
  if (ret) {
    uni.showToast({ title: '自定义字段名称不能为空', icon: 'none' })
    throw new Error('自定义字段名称不能为空')
  }
}
const publish = async () => {
  try {
    const { refs } = instance
    await uniEditerRef.value.save()
    // @ts-ignore
    await refs.activityForm.validate()
    // 校验自定义字段
    await validateFields()
    // 移除前台构造id
    removeMockId()
    // 发布
    await insertActivity({
      ...activityFormData.value,
      startTime: formatTime(activityFormData.value.startTime),
      endTime: formatTime(activityFormData.value.endTime),
      // 金额转换
      groupList: activityFormData.value.groupList.map((group) => ({
        ...group,
        money: toBack(group.money)
      }))
    })
    uni.showToast({ title: '创建成功' })
    setTimeout(() => {
      uni.navigateBack()
      // 通知上层页面刷新
      if (eventChannel.value) {
        eventChannel.value.emit('onActiveSaveSuccess')
      }
    }, 300)
  } catch (e) {
    console.log(e)
  }
}

const publishOrEdit = () => {
  if (isEdit.value) {
    edit()
  } else {
    publish()
  }
}

// 用户协议相关
const agRef = ref()
const openUserAgreement = () => {
  const { refs } = instance
  // @ts-ignore
  refs.agRef.toggle()
}
// 编辑相关
const activityId = ref('')
const isEdit = computed(() => !!activityId.value)
// 回显活动数据
onLoad((option: any) => {
  activityId.value = option.activityId
  if (option.activityId) {
    Promise.all([
      queryActivityDetail(activityId.value),
      queryActivityField(activityId.value)
    ])
      .then((ret) => {
        const detailRet = ret[0]
        formatTimeField(detailRet.data.activity)
        activityFormData.value = detailRet.data.activity

        const fieldRet = ret[1]
        activityFields.value = fieldRet.data.fieldList
        activityGroups.value = fieldRet.data.groupList.map((group) => ({
          ...group,
          money: toFront(group.money)
        }))

        isAgree.value = [0]
      })
      .catch((e: any) => {
        console.log(e)
      })
  }
})
const formatTimeField = (activity: Activity) => {
  const { startTime, endTime } = activity
  activity.startTime = formatTime(startTime)
  activity.endTime = formatTime(endTime)
}
// 删除字段
const delField = (id: any, index: number) => {
  if (isEdit.value && !isMockId(id)) {
    uni.showModal({
      title: '确认',
      content: '删除立即生效，是否确认删除操作？',
      success: (res) => {
        if (res.confirm) {
          deleteField(id, activityId.value).then((ret) => {
            activityFields.value.splice(index, 1)
          })
        }
      }
    })
  } else {
    activityFields.value.splice(index, 1)
  }
}
// 修改必选
const onSwitchChagne = (requiredFlag: any, field: ActivityField) => {
  if (!isMockId(field.id)) {
    modifyField(field.id, activityId.value, requiredFlag)
  }
}
// 提交编辑
const edit = async () => {
  // 获取最新编辑内容
  await uniEditerRef.value.save()

  removeMockId()

  // 校验自定义字段
  await validateFields()

  const modifyAct: Activity = {
    id: activityFormData.value.id,
    title: activityFormData.value.title,
    startTime: formatTime(activityFormData.value.startTime),
    endTime: formatTime(activityFormData.value.endTime),
    showFlag: activityFormData.value.showFlag,
    description: activityFormData.value.description,
    groupList: activityGroups.value.filter((group) => !group.id).map((group) => ({
      ...group,
      money: toBack(group.money)
    })),
    // 只提交新增的字段
    fieldList: activityFields.value.filter((field) => !field.id)
  }

  modifyActivity(modifyAct).then(() => {
    uni.showToast({ title: '保存成功', icon: 'none' })
    setTimeout(() => {
      uni.navigateBack()
      // 通知上层页面刷新
      if (eventChannel.value) {
        eventChannel.value.emit('onActiveSaveSuccess')
      }
    }, 500)
  })
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
.text {
  margin-bottom: 22px;
  font-weight: bold;
  color: #3a3a3a;
  display: block;
  font-size: 14px;
}
</style>
