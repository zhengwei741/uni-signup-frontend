declare namespace API {
  interface Result<T> {
    code: number
    msg: string
    data: T
  }
  interface ListResult<T> {
    code: number
    msg: string
    data: T[]
  }
  interface RowResult<T> {
    code: number
    msg: string
    total: number
    rows: T[]
  }
}
