import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useCommonStore = defineStore('common', () => {
  const token = ref<string>('')

  const setToken = (newToken: string) => (token.value = newToken)

  return {
    token,
    setToken
  }
})
