<template>
  <view class="bg">
    <view class="row" v-for="(item, index) in selectItems">
      <view class="input">
        <uni-easyinput
          :errorMessage="errorMessageMap[`${item.id}`]"
          v-model="item.value"
          required
          :rules="[{ required: true, errorMessage: '选项名称必填' }]"
          placeholder="请输入选项名称"
          @blur="() => validateInput(item.id, item.value)"
        />
      </view>
      <view class="btn">
        <button
          class="button"
          size="mini"
          type="warn"
          @click="delSelectItem(`${item.id}`, index)"
        >
          删除
        </button>
      </view>
    </view>

    <view style="text-align: center">
      <button @tap="addSelectItem" size="mini">添加选项</button>
    </view>
    <button @tap="saveSelectHandel">保存</button>
  </view>
</template>
<script setup lang="ts">
import { ref, nextTick, reactive, computed } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { useEventChannel } from '@/hooks/useEventChannel'
import type { ActivityField } from '@/typings/activity'
import { getMockID } from '@/utils'
import { modifyField } from '@/apis/activity'

const activityField = ref<ActivityField>()

const selectItems = ref<{ value: string; id: string }[]>([
  {
    value: '',
    id: getMockID()
  }
])

const activityId = ref('')
const isEdit = ref(false)
let { eventChannel } = useEventChannel()

const errorMessageMap = reactive<Record<string, boolean>>({})

onLoad(async (option: any) => {
  activityId.value = option.activityId
  isEdit.value = option.activityId !== 'undefined'

  await nextTick()

  eventChannel.value.on('onSelectOpen', function (data: ActivityField) {
    activityField.value = data
    if (data.valueRange) {
      selectItems.value = data.valueRange.split('#@').map((item) => ({
        value: item,
        id: getMockID()
      }))
    }
  })
})

const addSelectItem = () => {
  selectItems.value.push({
    value: '',
    id: getMockID()
  })
}

const validateInput = (id: string, value: string) =>
  (errorMessageMap[id] = !value)

const validate = () => {
  selectItems.value.forEach((item) => validateInput(item.id, item.value))
  if (Object.values(errorMessageMap).some((value) => value)) {
    throw new Error('校验不通过')
  }
}

const saveSelectHandel = async () => {
  try {
    // 校验
    validate()

    if (!activityField.value) return

    const valueRange = selectItems.value.reduce(
      (previousValue, currentValue) => {
        if (previousValue === '') {
          previousValue = currentValue.value
        } else {
          previousValue += `#@${currentValue.value}`
        }
        return previousValue
      },
      ''
    )

    activityField.value.valueRange = valueRange

    // 编辑调用编辑接口
    if (isEdit.value) {
      modifyField({
        id: activityField.value.id,
        activityId: activityId.value,
        requiredFlag: activityField.value.requiredFlag,
        fieldType: activityField.value.fieldType,
        valueRange: activityField.value.valueRange,
        fieldName: activityField.value.fieldName
      })
    }
    // 返回上一个页面
    if (eventChannel.value) {
      eventChannel.value.emit('onSelectSave', activityField.value)
    }
    uni.navigateBack()
  } catch (e) {
    console.error(e)
  }
}

const delSelectItem = (id: string, index: number) => {
  if (selectItems.value.length === 1) {
    uni.showToast({
      title: '至少保留一个选项',
      icon: 'none'
    })
    return
  }
  selectItems.value.splice(index, 1)
}
</script>

<style scoped lang="scss">
.bg {
  background-color: #f1f1f1;
  position: absolute;
  top: 0;
  width: 100%;
}
.row {
  display: flex;
  padding: 5px;
  background-color: white;
  margin-bottom: 5px;
  .input {
    flex: 1;
  }
  .btn {
    width: 100px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
