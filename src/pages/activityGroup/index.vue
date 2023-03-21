<template>
  <uni-container>
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
          <uni-easyinput v-model="group.groupName" placeholder="输入组别名称" />
        </uni-forms-item>
        <uni-forms-item label="金额(￥)" required name="money">
          <uni-easyinput v-model="group.money" placeholder="输入金额" />
        </uni-forms-item>
      </uni-forms>

      <view class="uni-forms-item">
        <view class="left">
          <uni-switch
            activeText="限制人数"
            size="mini"
            v-model:value="group.limit"
          ></uni-switch>
        </view>
        <view class="right">
          <uni-forms-item name="peopleNumber">
            <uni-easyinput
              :disabled="inputDisabled(group.limit)"
              v-model="group.peopleNumber"
              placeholder="请输入限制人数"
            />
          </uni-forms-item>
        </view>
      </view>

      <view style="text-align: center">
        <button type="warn" size="mini" @tap="delGroup(index)">删除</button>
      </view>
    </uni-card>
    <view style="text-align: center">
      <button @tap="addGroup" size="mini">添加组别</button>
    </view>
    <button @tap="saveGroupHandel">保存</button>
  </uni-container>
</template>
<script setup lang="ts">
import { getCurrentInstance, nextTick, ref, unref } from 'vue'
import type { ComponentInternalInstance } from 'vue'
import type { ActivityGroup } from '@/typings/activity'
import { onLoad } from '@dcloudio/uni-app'
import { useEventChannel } from '@/hooks/useEventChannel'
import { getMockID, toBack } from '@/utils'

const activityGroups = ref<ActivityGroup[]>([])

const instance = getCurrentInstance() as ComponentInternalInstance
let { eventChannel } = useEventChannel()

onLoad(async () => {
  await nextTick()
  // 打开页面传入的分组列表
  eventChannel.value.on('onGroupOpen', function (data: ActivityGroup[]) {
    activityGroups.value = data
  })
})

// 限制人数不可编辑
const inputDisabled = (limit: boolean | undefined) => !!!limit
// 添加组别
const addGroup = () => {
  activityGroups.value.push({
    id: getMockID(),
    groupName: '',
    money: 0,
    peopleNumber: 10,
    limit: false
  })
}
// 删除组别
const delGroup = (index: number) => {
  if (activityGroups.value.length === 1) {
    uni.showToast({
      title: '至少要有一个组别',
      icon: 'none'
    })
    return
  }
  activityGroups.value.splice(index, 1)
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
    if (eventChannel.value) {
      eventChannel.value.emit('onGroupSave', unref(activityGroups.value))
    }
    uni.navigateBack()
  } catch (e) {
    console.log(e)
    console.log('校验不通过')
  }
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
</style>
