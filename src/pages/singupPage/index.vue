<template>
  <uni-container>
    <view class="singup-page forms-cls">
      <uni-forms ref="singupForm" :rules="fieldRules" :modelValue="formData">
        <uni-forms-item label="组别" required name="groupId">
          <uni-data-select
            v-model="formData.groupId"
            :localdata="groupRange"
          ></uni-data-select>
        </uni-forms-item>

        <uni-forms-item label="费用(￥)">
          <uni-easyinput v-model="cost" disabled />
        </uni-forms-item>

        <uni-forms-item
          v-for="item in fieldList"
          :key="item.id"
          :label="item.fieldName"
          :required="item.requiredFlag === '1'"
          :rules="item.rules"
          :name="'domains[' + item.id + ']'"
        >
          <view>
            <uni-easyinput
              v-model="formData.domains[item.id]"
              :placeholder="`请输入${item.fieldName}`"
            />
          </view>
        </uni-forms-item>
      </uni-forms>
      <uni-row>
        <uni-col :span="12">
          <view style="text-align: center">
            <button size="mini" @tap="cancel">取消</button>
          </view>
        </uni-col>
        <uni-col :span="12">
          <view style="text-align: center">
            <button :loading="loading" size="mini" @tap="() => submit()">
              {{ cost == 0 ? '提交' : '支付' }}
            </button>
          </view>
        </uni-col>
      </uni-row>
    </view>
  </uni-container>
</template>
<script setup lang="ts">
import { reactive, computed, ref, getCurrentInstance } from 'vue'
import type { ComponentInternalInstance } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { queryActivityField } from '@/apis/activity'
import { insertApply } from '@/apis/apply'
import type { ActivityField, ActivityGroup } from '@/typings/activity'
import { toFront } from '@/utils'
import { useEventChannel } from '@/hooks/useEventChannel'
import { usePay } from '@/hooks/usePay'

// 表单
const formData = reactive<{
  groupId: string
  domains: Record<string, unknown>
}>({
  groupId: '',
  domains: {}
})
// 校验
const fieldRules = computed(() => ({
  groupId: {
    rules: [
      {
        required: true,
        errorMessage: '组别不能为空'
      }
    ]
  }
}))
// 原始字段
const orgFieldList = ref<ActivityField[]>([])
const fieldList = computed<ActivityField[]>(() => {
  return [
    {
      id: 'name',
      fieldName: '昵称',
      requiredFlag: '1',
      rules: [
        {
          required: true,
          errorMessage: `昵称不能为空`
        }
      ]
    },
    {
      id: 'mobile',
      fieldName: '手机号',
      requiredFlag: '1',
      rules: [
        {
          required: true,
          errorMessage: `手机号不能为空`
        },
        {
          validateFunction(
            rule: any,
            value: string,
            data: any,
            callback: (msg: string) => void
          ) {
            if (!/0?(13|14|15|17|18|19)[0-9]{9}/.test(value)) {
              callback('请输入正确的手机号码')
            }
            return true
          }
        }
      ]
    },
    ...orgFieldList.value.map((field) => {
      return {
        ...field,
        rules: [
          {
            required: field.requiredFlag === '1',
            errorMessage: `${field.fieldName}不能为空`
          }
        ]
      }
    })
  ]
})
// 原始组别
const orgGroupList = ref<ActivityGroup[]>([])
// 组别
const groupRange = computed<{ value: string; text: string }[]>(() =>
  orgGroupList.value.map((item) => ({
    value: item.id || '',
    text: item.groupName
  }))
)
// 费用
const cost = computed(() => {
  const find = orgGroupList.value.find((group) => group.id === formData.groupId)
  if (find) {
    return toFront(find.money)
  }
  return 0
})

// 新增报名
const loading = ref(false)
const instance = getCurrentInstance() as ComponentInternalInstance
const { eventChannel } = useEventChannel()
const submit = async (fromName: string = 'singupForm') => {
  try {
    // @ts-ignore
    await instance.refs[fromName].validate()
    const { domains, groupId } = formData
    const { name, mobile } = domains
    delete domains.name
    delete domains.mobile
    const finalParams = {
      activityId: activityId.value,
      groupId,
      name,
      mobile,
      fieldList: Object.keys(domains).map((key) => ({
        fieldId: key,
        fieldValue: domains[key]
      }))
    }

    loading.value = true

    const { data } = await insertApply(finalParams)
    // 支付
    if (data.package) {
      await usePay(data)
    }
    uni.showToast({ title: '报名成功' })
    eventChannel.value.emit('onSingSuccess')
    setTimeout(() => {
      uni.navigateBack()
    }, 1000)
  } catch (e: any) {
    const { errMsg, msg } = e
    let title = ''
    if (errMsg && errMsg === 'requestPayment:fail cancel') {
      title = '用户取消支付'
    }
    if (msg) {
      title = msg
    }
    uni.showToast({
      title,
      icon: 'error'
    })
  } finally {
    loading.value = false
  }
}

const cancel = () => uni.navigateBack()

const activityId = ref<string>()
onLoad((option: any) => {
  activityId.value = option.id
  queryActivityField(option.id).then((ret) => {
    const { data } = ret
    orgFieldList.value = data.fieldList
    orgGroupList.value = data.groupList
  })
})
</script>
<style scoped lang="scss">
.singup-page {
  padding: 10px;
}
</style>
