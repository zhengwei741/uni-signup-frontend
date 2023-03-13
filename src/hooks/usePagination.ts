import { ref } from 'vue'
import type { Ref } from 'vue'

export type ChangeType = 'next' | 'prev' | 'refresh'

export type OnChangeType = (params: {
  pageNo: number
  pageSize: number
  type: ChangeType
}) => Promise<{
  total: number
  isLastPage: boolean
  isFristPage: boolean
}>

export type UsePaginationOption = {
  pageNo: number
  pageSize: number
  onChange: OnChangeType
}

export type CallBackType = (callback?: () => void) => void

export const usePagination = (
  options: UsePaginationOption
): {
  prev: CallBackType
  next: CallBackType
  refresh: CallBackType
  isLastPage: Ref<boolean>
  isFristPage: Ref<boolean>
} => {
  let { pageNo, pageSize, onChange } = options

  const currentPageNo = ref(pageNo)
  const currentPageSize = ref(pageSize)
  const totalSize = ref(0)
  // const isLastPage = computed(
  //   () => totalSize.value <= currentPageNo.value * currentPageSize.value
  // )
  const isLastPage = ref(false)
  const isFristPage = ref(true)

  const prev = async (callback?: () => void) => {
    let _pageNo = currentPageNo.value - 1
    if (_pageNo > 0) {
      await execute(_pageNo, pageSize, 'prev')
    }
    callback && callback()
  }

  const next = async (callback?: () => void) => {
    let _pageNo = currentPageNo.value + 1
    if (!isLastPage.value) {
      await execute(_pageNo, pageSize, 'next')
    }
    callback && callback()
  }

  const originalPageNo = pageNo
  const originalPageSize = pageSize
  const refresh = async (callback?: () => void) => {
    await execute(originalPageNo, originalPageSize, 'refresh')
    callback && callback()
  }

  const execute = async (
    pageNo: number,
    pageSize: number,
    type: ChangeType
  ) => {
    const {
      total,
      isFristPage: _isFristPage,
      isLastPage: _isLastPage
    } = await onChange({ pageNo, pageSize, type })
    currentPageNo.value = pageNo
    currentPageSize.value = pageSize
    totalSize.value = total
    isLastPage.value = _isLastPage
    isFristPage.value = _isFristPage
  }

  return {
    prev,
    next,
    refresh,
    isLastPage,
    isFristPage
  }
}
