export interface Apply {
  id: string
  name: string
  groupName: string
}

export interface ApplyInfo {
  activityId: string
  createTime: string
  creater: string
  fieldList: { fieldName: string; fieldValue: string }[]
  groupId: string
  groupName: string
  id: string
  mobile: string
  money: number
  name: string
  status: string
  updateTime: string
  updater: string
  statusDesc?: string
  // 广告是否显示的字段（1-显示，0-不显示）
  applyCancelShowAD: '1' | '0'
}

export type PayRet = {
  appId: string
  nonceStr: string
  package?: string
  paySign: string
  signType: string
  timeStamp: string
}
