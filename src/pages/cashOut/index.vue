<template>
  <view class="container">
    <view class="body">
      <view class="inner">
        <view class="section">
          <text class="title">{{ title }}</text>
        </view>

        <view class="section">
          <text class="g-title">总金额(￥)</text>
          <text class="unit">{{ cashOut.totalAmount }}</text>
        </view>

        <view class="section">
          <text class="g-title">可提现金额(￥)</text>
          <text class="unit">{{ cashOut.balance }}</text>
        </view>

        <view class="section">
          <text class="g-title" style="color: red; margin-bottom: 5px;">*此次提现(￥)</text>
          <uni-easyinput
            v-model="cash"
            placeholder="输入金额"
            type="digit"
          ></uni-easyinput>
        </view>

        <view class="tip">
          <view>提示：</view>
          <view>1、提现及时到账；</view>
          <view>2、单次提现最少0.3元，最多500元；</view>
          <view>3、同一个微信账号，一天最多提现10次，最多提现5000元；</view>
        </view>

        <view class="section">
          <text class="g-title">提现记录</text>

          <text class="record" v-for="(record, index) in cashOut.withdrawCashList" :key="index">
            {{ index + 1 }}、{{ formatRecord(record) }}
          </text>
        </view>

        <view class="section" v-if="cashOut.adminFlag === '1'">
          <uni-forms ref="form" :modelValue="formData" label-width="100px">
            <uni-forms-item label="时间" name="createTime">
              <uni-datetime-picker type="datetime" v-model="formData.createTime" />
            </uni-forms-item>
            <uni-forms-item label="提现金额(￥)" name="amount">
              <uni-easyinput v-model="formData.amount" />
            </uni-forms-item>
            <uni-forms-item label="服务费(￥)" name="platformServiceFee">
              <uni-easyinput v-model="formData.platformServiceFee" />
            </uni-forms-item>
          </uni-forms>
          <button @tap="addRecord">增加提现记录</button>
        </view>
      </view>
    </view>
    <view class="foot">
      <button size="mini" @tap="cancel">取消</button>
      <button size="mini" @tap="confirm" :loading="loading">确认提现</button>
    </view>
  </view>
</template>
<script setup lang="ts">
import { ref, reactive } from 'vue'
import { queryActivityAmount, withdraw, insertWithdrawalRecord } from '@/apis/order'
import { onLoad } from '@dcloudio/uni-app'
import type { CashOut } from '@/typings/order'
import { toBack, toFront, formatTime } from '@/utils'
import { useLoading } from '@/hooks/useLoading'
import dayjs from 'dayjs'

const cash = ref(0)
const cashOut = ref<CashOut>({
  adminFlag: "0",
  status: "0",
  balance: 0,
  totalAmount: 0,
  withdrawCashList: []
})
const title = ref('')
const activityId = ref('')

const cancel = () => uni.navigateBack()

const { run, loading } = useLoading(withdraw)
const confirm = () => {
  if (cash.value < 0.3) {
    uni.showToast({ title: '单次提现最少0.3元', icon: 'none' })
    return
  }
  if (cash.value > cashOut.value.balance) {
    uni.showToast({ title: '不能超过可提现金额', icon: 'none' })
    return
  }
  run({
    activityId: activityId.value,
    amount: toBack(cash.value)
  }).then(getActivityAmount).catch((e: any) => {
    uni.showToast({
      title: e.msg,
      icon: 'none'
    })
  })
}

const getActivityAmount = () => {
  uni.showLoading({})
  queryActivityAmount(activityId.value || '426423103583870976').then(ret => {
    cashOut.value = {
      ...ret.data,
      balance: toFront(ret.data.balance),
      totalAmount: toFront(ret.data.totalAmount)
    }
  }).finally(uni.hideLoading)
}

const formData = reactive({
  createTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
  amount: 0,
  platformServiceFee: 0,
})
const addRecord = () => {
  insertWithdrawalRecord({
    amount: toBack(formData.amount),
    platformServiceFee: toBack(formData.platformServiceFee),
    createTime: formatTime(formData.createTime),
    activityId: activityId.value,
  }).then(getActivityAmount).catch((e: any) => {
    uni.showToast({
      title: e.msg,
      icon: 'none'
    })
  })
}
const formatRecord = (record: any) => {
  const { amount, createTime } = record
  return `${createTime.replaceAll('T', '')} 提现 ${toFront(amount)} 元`
}

onLoad((option: any) => {
  title.value = option.title
  activityId.value = option.id
  getActivityAmount()
})
</script>
<style scoped lang="scss">
.container{
  height: calc(100vh - env(safe-area-inset-bottom));
  display: flex;
  flex-direction: column;
  background-color: #f1f1f1;
  .body {
    flex: 1 1 50px;
    width: 100%;
    display: flex;
    overflow: scroll;
    .inner{
      width: 100%;
      margin: 5px;
      padding: 5px 10px;
      box-shadow: 0px 0px 3px 1px rgba(0, 0, 0, 0.08);
      border-radius: 4px;
      background-color: #fff;
      overflow-y: scroll;
    }
    .section{
      margin-bottom: 20px;
      text{
        display: block;
      }
      .unit{
        margin-top: 5px;
        font-size: 14px;
        color: #7f7f7f;
      }
      .record{
        color: #7f7f7f;
        font-size: 14px;
        margin: 3px 0;
      }
    }
    .tip{
      color: #ffb400;
      margin-bottom: 20px;
    }
  }
  .title{
    font-size: 20px;
    font-weight: bold;
  }
  .foot{
    height: 30px;
    width: 100%;
    display: flex;
    background-color: #fff;
    padding: 5px 0;
    button {
      width: 100px;
    }
  }
}
</style>