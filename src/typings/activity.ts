/** 活动 */
export interface Activity {
  id?: string
  /**活动标题*/
  title: string
  /**活动开始时间*/
  startTime: string
  /**活动结束时间*/
  endTime: string
  /**活动介绍*/
  description: string
  /**活动编辑字段*/
  fieldList: ActivityField[]
  /**活动组别*/
  groupList: ActivityGroup[]
  /**显示报名人员*/
  showFlag: string // 1 显示 0 不显示
  //
  status?: string
  //
  creater?: string

  hotFlag: '0' | '1' // 显示到热门活动页 0关1开
}

export interface ActivityField {
  /** 字段ID */
  id?: string
  /** 字段名 */
  fieldName: string
  /** 是否必填 */
  requiredFlag: '1' | '0'

  activityId?: string

  creater?: string

  rules?: any[] // 前台校验用

  // 前台用
  type: '0' | '1' // 0单行文本 1 下拉框
}

export interface ActivityGroup {
  id?: string
  /** 组别名称 */
  groupName: string
  /** 组别付费 */
  money: number
  /** 组别限制人数 */
  peopleNumber: number
  /** 是否限制人数 */
  limit?: boolean
  /** 报名人数 */
  applicantNumber?: number

  activityId?: string

  creater?: string
}

/** 热门活动 */
export interface HotActivity {
  organizationName: string
  logoImgName: string
  activityStatus: string
  creater: string
  id: string
  title: string
}
