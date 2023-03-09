import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useCommonStore = defineStore('common', () => {
  const token = ref<string>('')
  // 选择菜单
  const selected = ref<number>(0)
  let timer: any = null

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

  const setSelected = (index: number) => {
    selected.value = index
  }

  return {
    token,
    setToken,
    selected,
    setSelected
  }
})
