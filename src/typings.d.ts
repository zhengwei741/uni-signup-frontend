declare namespace API {
  interface Result<T> {
    code: number
    msg: string
    data: T
  }

  interface PaginationResult<T> {
    code: number
    msg: string
    data: {
      pageInfo: {
        total: number
        list: T[]
        pageNum: number
        pageSize: number
        isFirstPage: boolean
        isLastPage: boolean
        hasNextPage: boolean
      }
    }
  }

  type Pagination<T> = {
    [Key in keyof T]: T[Key]
  } & {
    pageNo: number
    pageSize: number
  }
}
