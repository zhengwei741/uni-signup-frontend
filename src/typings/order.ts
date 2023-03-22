export interface CashOut {
  adminFlag: "0" | "1"
  status: "0" | "1"
  balance: number
  totalAmount: number
  withdrawCashList: {amount: number, createTime: string}[]
}