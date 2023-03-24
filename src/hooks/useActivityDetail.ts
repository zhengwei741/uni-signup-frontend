import { ref, nextTick } from 'vue'
import type { Apply } from '@/typings/apply'
import type { Activity } from '@/typings/activity'
import { onLoad } from '@dcloudio/uni-app'
import { queryActivityDetail } from '@/apis/activity'
import { queryAllApply, queryCancelApply, queryMyApply } from '@/apis/apply'

interface optionsProps {
  allApply?: boolean
  cancelApply?: boolean
  myApply?: boolean
}

export const useActivityDetail = (
  options: optionsProps = {
    allApply: true,
    cancelApply: false,
    myApply: false
  }
) => {
  const activity = ref<Activity>({
    title: '',
    startTime: '',
    endTime: '',
    description: '',
    fieldList: [],
    groupList: [],
    showFlag: '1', // 1 显示 0 不显示
    id: '',
    creater: ''
  })
  // 组织机构
  const organizationName = ref<string>('')
  // 所有报名
  const allApplyList = ref<Apply[]>([])
  // 所有取消报名
  const cancelApplyList = ref<Apply[]>([])
  // 我的报名
  const myApplyList = ref<Apply[]>([])

  const id = ref('')
  // 初始化
  onLoad((option: any) => {
    id.value = option.id
    refresh()
  })

  const refresh = async () => {
    const { allApply, cancelApply, myApply } = options
    await queryActivityDetail(id.value).then((ret) => {
      const { data } = ret
      activity.value = data.activity
      organizationName.value = data.organizationName
    })

    await nextTick()

    // 是否显示报名
    if (allApply) {
      await queryAllApply(id.value).then((ret) => {
        const { data } = ret
        if (activity.value.showFlag === '1') {
          allApplyList.value = data.allApplyList
        }
      })
    }
    if (cancelApply) {
      await queryCancelApply(id.value).then((ret) => {
        const { data } = ret
        cancelApplyList.value = data.cancelList
      })
    }
    if (myApply) {
      await queryMyApply(id.value).then((ret) => {
        const { data } = ret
        myApplyList.value = data.myApplyList
      })
    }
  }

  return {
    activity,
    organizationName,
    allApplyList,
    cancelApplyList,
    myApplyList,
    refresh
  }
}
