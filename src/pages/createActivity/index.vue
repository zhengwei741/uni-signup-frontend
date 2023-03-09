<template>
  <uni-container>
    <view class="create-activity">
    <uni-forms ref="baseForm" :modelValue="baseFormData" label-position="top" label-width="100">
      <uni-forms-item label="活动标题" required>
        <uni-easyinput v-model="baseFormData.name" placeholder="请输入活动标题" />
      </uni-forms-item>
      <uni-forms-item label="报名开始" required>
        <uni-datetime-picker type="datetime" return-type="timestamp" v-model="baseFormData.datetimesingle"/>
      </uni-forms-item>
      <uni-forms-item label="报名结束" required>
        <uni-datetime-picker type="datetime" return-type="timestamp" v-model="baseFormData.datetimesingle"/>
      </uni-forms-item>
      <uni-forms-item label="活动介绍">
        <uni-easyinput type="textarea" v-model="baseFormData.introduction" placeholder="请输入活动介绍" />
      </uni-forms-item>

      <view class="uni-forms-item">
        <view>
          <text class="label">显示报名人员</text>
        </view>
        <view class="switch">
          <switch checked />
        </view>
      </view>

      <text>报名填写信息</text>
      <view class="uni-forms-item" style="border-bottom: 1px solid #e5e5e5;">
        <view>
          <text class="label">组别</text>
        </view>
        <view class="switch">
          <button type="primary" size="mini" >编辑</button>
        </view>
      </view>
      <view class="uni-forms-item" style="border-bottom: 1px solid #e5e5e5;">
        <view>
          <text class="label">昵称</text>
        </view>
      </view>
      <view class="uni-forms-item" style="border-bottom: 1px solid #e5e5e5;">
        <view>
          <text class="label">手机号</text>
        </view>
      </view>

      <view class="uni-forms-item">
        <view style="justify-content: center;display: flex;">
          <button type="primary" size="mini" >添加报名字段</button>
        </view>
      </view>
      <!-- <button type="primary" style="background-color: #007aff;" >添加报名字段</button> -->

      <uni-data-checkbox multiple v-model="baseFormData.hobby" :localdata="[{ text: '已阅读并同意《用户服务协议》', value: 0 }]"></uni-data-checkbox>

      <button type="primary" disabled >发布活动</button>
    </uni-forms>
  </view>
  </uni-container>
</template>

<script setup lang="ts">
import { reactive } from 'vue'

const baseFormData = reactive({
  name: '',
  age: '',
  introduction: '',
  sex: 2,
  hobby: [5],
  datetimesingle: 1627529992399
})

</script>
<style scoped lang="scss">
.create-activity{
  padding: 10px;
}
.uni-forms-item{
  display: flex;
  margin-bottom: 22px;
  flex-direction: row;
  align-items: center;
  >view{
    flex: 1;
  }
  .label{
    font-size: 14px;
    color: #606266;
    height: 25px;
    display: block;
  }
  .switch{
    text-align: right;
  }
}
</style>