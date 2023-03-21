import { ref } from 'vue'

export const useLoading = (fn: Function) => {
  const loading = ref(false)

  const run = async (...args: any[]) => {
    loading.value = true
    try {
      await fn(...args)
    } catch (e) {
      throw e
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    run
  }
}
