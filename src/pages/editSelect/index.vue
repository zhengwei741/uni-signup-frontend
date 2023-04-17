<template>
  <view class="bg">
    <view class="row" v-for="(item, index) in activityFields">
      <view class="input">
        <uni-easyinput
          v-model="dynamicFormData.domains[`${item.id}`]"
          required
          :rules="[{ required: true, errorMessage: '选项名称必填' }]"
          placeholder="请输入选项名称"
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
      <button @tap="addSelectItem" size="mini">添加组别</button>
    </view>
    <button @tap="saveSelectHandel">保存</button>
  </view>
</template>
<script setup lang="ts">
import { ref, nextTick } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { useEventChannel } from '@/hooks/useEventChannel'
import type { ActivityField } from '@/typings/activity'
import { getMockID, isMockId } from '@/utils'
import { deleteField } from '@/apis/activity'

const activityFields = ref<ActivityField[]>([])

const activityId = ref('')
const isEdit = ref(false)
let { eventChannel } = useEventChannel()

onLoad(async (option: any) => {
  activityId.value = option.activityId
  isEdit.value = option.activityId !== 'undefined'

  await nextTick()

  // eventChannel.value.on('onSelectOpen', function (data: ActivityField[]) {
  //   activityFields.value = data
  // })
})

const dynamicFormData = ref<{ domains: Record<string, any> }>({
  // domains 字段下会有多个结果
  domains: {}
})

const addSelectItem = () => {
  activityFields.value.push({
    id: getMockID(),
    fieldName: '',
    requiredFlag: '1',
    type: '1'
  })
}

const saveSelectHandel = () => {}

const delSelectItem = (id: string, index: number) => {
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
