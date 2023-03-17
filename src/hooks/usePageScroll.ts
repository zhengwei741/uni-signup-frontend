import { ref, unref, computed } from 'vue'
import type { ComputedRef, Ref } from 'vue'
import { usePagination } from './usePagination'
import type { CallBackType } from './usePagination'

interface IusePageScroll {
  <T = any>(options: {
    action: (actionOptions: { pageNo: number; pageSize: number }) => Promise<{
      list: T
      total: number
      isLastPage: boolean
      isFristPage: boolean
    }>
  }): {
    next: CallBackType
    refresh: CallBackType
    list: Ref<T>
    status: ComputedRef<'noMore' | 'more' | 'loading'>
    loading: Ref<boolean>
  }
}

export const usePageScroll: IusePageScroll = (options) => {
  const interiorList = ref<any>([])

  const { action } = options

  const { next, refresh, isLastPage } = usePagination({
    pageNo: 1,
    pageSize: 10,
    onChange: ({ pageNo, pageSize, type }) => {
      uni.showLoading({ title: '加载中' })
      return action({ pageNo, pageSize })
        .then((ret) => {
          const { list } = ret
          if (type === 'next') {
            interiorList.value = interiorList.value.concat(list)
          } else {
            interiorList.value = list
          }
          return {
            ...ret
          }
        })
        .finally(uni.hideLoading)
    }
  })

  const loading = ref<boolean>(false)
  const status = computed(() => {
    if (unref(isLastPage)) return 'noMore'
    return loading.value ? 'more' : 'loading'
  })

  const _next = () => {
    loading.value = true
    next(() => (loading.value = false))
  }

  return {
    refresh,
    next: _next,
    list: interiorList,
    status,
    loading
  }
}
