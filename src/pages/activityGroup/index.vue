<template>
  <view class="bg">
    <uni-card v-for="(group, index) in activityGroups" :key="group.id">
      <uni-forms
        :modelValue="group"
        :label-width="130"
        :ref="`${index}_group`"
        :rules="{
          groupName: {
            rules: [{ required: true, errorMessage: '组别不能为空' }]
          },
          money: { rules: [{ required: true, errorMessage: '金额不能为空' }] }
        }"
      >
        <uni-forms-item label="组别名称" required name="groupName">
          <uni-easyinput
            type="text"
            v-model="group.groupName"
            placeholder="输入组别名称"
            @input="() => onGroupChange(group)"
            :disabled="group.applicantNumber !== 0 && !isMockId(group.id)"
          />
        </uni-forms-item>
        <uni-forms-item label="金额(￥)" required name="money">
          <uni-easyinput
            type="digit"
            v-model="group.money"
            placeholder="输入金额"
            @input="() => onGroupChange(group)"
            :disabled="group.applicantNumber !== 0 && !isMockId(group.id)"
          />
        </uni-forms-item>
      </uni-forms>

      <view class="uni-forms-item">
        <view
          class="left"
          :style="{ width: group.applicantNumber ? '200px' : '130px' }"
        >
          <uni-switch
            :activeText="getActiveText(group)"
            size="mini"
            v-model:value="group.limit"
            @chagne="() => onGroupChange(group)"
          ></uni-switch>
        </view>
        <view class="right">
          <uni-forms-item name="peopleNumber">
            <uni-easyinput
              :disabled="inputDisabled(group.limit)"
              v-model="group.peopleNumber"
              placeholder="请输入限制人数"
              @input="() => onGroupChange(group)"
              type="number"
            />
          </uni-forms-item>
        </view>
      </view>

      <view class="btn-wapper">
        <button
          v-if="isEdit && !isMockId(group.id)"
          size="mini"
          @tap="() => updateOneGroup(group)"
        >
          保存
        </button>
        <button
          v-if="group.applicantNumber === 0"
          type="warn"
          size="mini"
          @tap="() => delGroup(group, index)"
        >
          删除
        </button>
      </view>
    </uni-card>
    <view style="text-align: center">
      <button @tap="addGroup" size="mini">添加组别</button>
    </view>
    <button @tap="saveGroupHandel">保存</button>
  </view>
</template>
<script setup lang="ts">
import { getCurrentInstance, nextTick, ref } from 'vue'
import type { ComponentInternalInstance } from 'vue'
import type { ActivityGroup } from '@/typings/activity'
import { onLoad } from '@dcloudio/uni-app'
import { useEventChannel } from '@/hooks/useEventChannel'
import { getMockID, toBack, isMockId } from '@/utils'
import { deleteGroup, updateGroup } from '@/apis/activity'

const activityGroups = ref<ActivityGroup[]>([])

const instance = getCurrentInstance() as ComponentInternalInstance
let { eventChannel } = useEventChannel()

const activityId = ref('')
const isEdit = ref(false)

onLoad(async (option: any) => {
  activityId.value = option.activityId
  isEdit.value = option.activityId !== 'undefined'

  await nextTick()
  // 打开页面传入的分组列表
  eventChannel.value.on('onGroupOpen', function (data: ActivityGroup[]) {
    data.forEach((activityGroup) => {
      // 设置是否限制人数
      activityGroup.limit = activityGroup.peopleNumber !== 0
    })
    activityGroups.value = data
  })
})

const getActiveText = (group: ActivityGroup) => {
  const { applicantNumber = 0 } = group
  return applicantNumber ? `限制人数(${applicantNumber}人已报名)` : '限制人数'
}

// 限制人数不可编辑
const inputDisabled = (limit: boolean | undefined) => !!!limit
// 添加组别
const addGroup = () => {
  if (activityGroups.value.length >= 20) {
    uni.showToast({ title: '最多20个组别', icon: 'none' })
    return
  }
  activityGroups.value.push({
    id: getMockID(),
    groupName: '',
    money: 0,
    peopleNumber: 10,
    limit: false,
    applicantNumber: 0
  })
}
// 删除组别
const delGroup = (group: ActivityGroup, index: number) => {
  if (activityGroups.value.length === 1) {
    uni.showToast({
      title: '至少要有一个组别',
      icon: 'none'
    })
    return
  }
  if (isEdit.value && !isMockId(group.id || '')) {
    uni.showModal({
      title: '确认',
      content: '删除立即生效，是否确认删除操作？',
      success: (res) => {
        if (res.confirm) {
          deleteGroup(group.id || '', activityId.value).then(() => {
            activityGroups.value.splice(index, 1)
          })
        }
      }
    })
  } else {
    activityGroups.value.splice(index, 1)
  }
}

const validateFrom = async (
  froms: Record<string, unknown> = {}
): Promise<boolean> => {
  let promises: Promise<any>[] = []
  Object.keys(froms).forEach((key) => {
    const ref = froms[key] as Array<{ validate: () => Promise<any> }>
    promises.push(ref[0].validate())
  })
  return Promise.all(promises).then(() => true)
}
// 保存
const saveGroupHandel = async () => {
  try {
    const { refs } = instance
    await validateFrom(refs)

    if (isEdit.value) {
      await saveChangeGroup()
    }

    if (eventChannel.value) {
      eventChannel.value.emit(
        'onGroupSave',
        JSON.parse(JSON.stringify(activityGroups.value))
      )
    }
    uni.navigateBack()
  } catch (e) {
    console.log(e)
    console.log('校验不通过')
  }
}

// 更新组别
const updateOneGroup = (
  group: ActivityGroup,
  showTip = true
): Promise<unknown> => {
  const { peopleNumber, applicantNumber = 0, limit } = group
  if (limit && peopleNumber < applicantNumber) {
    const title = `已有${applicantNumber}人报名, 限制人数不能小于该人数`
    uni.showToast({
      title,
      icon: 'none'
    })
    return Promise.reject(title)
  }
  if (group.money > 5000) {
    const title = '最大金额不能超过5000'
    uni.showToast({ title, icon: 'none' })
    return Promise.reject(title)
  }

  const _group = {
    id: group.id,
    activityId: group.activityId,
    peopleNumber: limit ? group.peopleNumber : 0,
    groupName: group.groupName,
    money: toBack(group.money)
  }
  return updateGroup(_group).then(() => {
    chagneIds.delete(group.id)
    showTip && uni.showToast({ title: '保存成功' })
  })
}

// 保存所有修改过的id
const chagneIds = new Set()
const onGroupChange = (group: ActivityGroup) => {
  if (!isMockId(group.id)) {
    chagneIds.add(group.id)
  }
}
const saveChangeGroup = async () => {
  const promises: Promise<unknown>[] = []
  activityGroups.value.forEach((group) => {
    if (chagneIds.has(group.id)) {
      promises.push(updateOneGroup(group, false))
    }
  })
  return Promise.all(promises)
}
</script>
<style scoped lang="scss">
.uni-forms-item {
  display: flex;
  margin-bottom: 22px;
  flex-direction: row;
  align-items: center;
  .left {
    width: 130px;
  }
  .right {
    flex: 1;
    ::v-deep .uni-forms-item {
      margin-bottom: 0;
    }
  }
}
.btn-wapper {
  display: flex;
  button {
    width: 100px;
  }
}

.bg {
  background-color: #f1f1f1;
  position: absolute;
  top: 0;
  width: 100%;
}
</style>
