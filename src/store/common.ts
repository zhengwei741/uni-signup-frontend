import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useCommonStore = defineStore('common', () => {
  // token
  const token = ref<string>('')
  const setToken = (newToken: string) => {
    token.value = newToken
    // 设置token时启一个定时器 50分钟后清楚token
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      token.value = ''
    }, 3000000)
  }

  // 选择菜单
  const selected = ref<number>(0)
  let timer: any = null
  const setSelected = (index: number) => {
    selected.value = index
  }

  // userId
  const userId = ref('')
  const setUserId = (id: string) => {
    userId.value = id
  }

  // gzhOpenidFlag
  const gzhOpenidFlag = ref('1')
  const setgzhOpenidFlag = (id: string) => {
    gzhOpenidFlag.value = id
  }

  return {
    token,
    setToken,

    selected,
    setSelected,

    userId,
    setUserId,

    gzhOpenidFlag,
    setgzhOpenidFlag
  }
})
