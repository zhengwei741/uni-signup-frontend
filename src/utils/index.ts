import currency from 'currency.js'
import dayjs from 'dayjs'

export { request } from './request'

/**
 * 生成uuid
 * @returns uuid
 */
export function uuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

export function getStatusStyle(status: string) {
  return {
    color: status === '报名中' ? '#42b983' : '#6a6a6a',
    'font-size': '13px'
  }
}

export function getMockID() {
  return `mock_${Math.random()}`
}

export function isMockId(id: any) {
  if (typeof id === 'string') {
    return id.startsWith('mock_')
  }
  return false
}

// 后台金额转前台
export function toFront(value: number = 0) {
  return currency(value).divide(100).value
}
// 前台金额转后台
export function toBack(value: number = 0) {
  return currency(value).multiply(100).value
}

export function formatTime(time: any, format: string = 'YYYY-MM-DD HH:mm:ss') {
  return dayjs(time).format(format)
}
