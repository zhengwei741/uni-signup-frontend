declare namespace API {
  interface Result<T = any> {
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
      adminFlag?: '1' | '0'
    }
  }

  type Pagination<T> = {
    [Key in keyof T]: T[Key]
  } & {
    pageNo: number
    pageSize: number
  }
}
