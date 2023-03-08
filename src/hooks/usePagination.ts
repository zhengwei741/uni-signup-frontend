import { ref } from 'vue'

export type UsePaginationOption = {
  page: number,
  pageSize: number,
  onChange: (params: { pageNo: number, pageSize: number }) => void,
}

export const usePagination = (options: UsePaginationOption): {
  prev: () => void,
  next: () => void,
  reset: () => void
} => {
  const {
    page,
    pageSize,
    onChange,
  } = options

  const _page = ref(page)
  const _pageSize = ref(pageSize)

  const prev = () => {}

  const next = () => {}

  const reset = () => {}

  return {
    prev,
    next,
    reset
  }
}