<template>
  <view style="padding: 5px;" class="forms-cls">
    <uni-forms :modelValue="formData" label-position="top" label-width="100" ref="formRef" :rules="{
      organizationName: { rules: [{ required: true, errorMessage: '组织机构名称不能为空' }] },
      userName: { rules: [{ required: true, errorMessage: '姓名不能为空' }] },
      mobile: { rules: [{ required: true, errorMessage: '手机号不能为空'} , { validateFunction: validateMobile }] }
    }">
      <uni-forms-item required label="组织机构名称" name="organizationName">
        <uni-easyinput type="text" v-model="formData.organizationName" placeholder="请输入组织机构名称" />
      </uni-forms-item>
      <uni-forms-item required label="姓名(用于提现校验)" name="userName">
        <uni-easyinput type="text" v-model="formData.userName" placeholder="请输入姓名" />
      </uni-forms-item>
      <uni-forms-item required label="手机号" name="mobile">
        <uni-easyinput type="text" v-model="formData.mobile" placeholder="请输入手机号" />
      </uni-forms-item>
    </uni-forms>
  </view>
  <view class="button-warpper">
    <button :loading="loading" @tap="submit">提 交</button>
  </view>
</template>
<script setup lang="ts">
import { reactive, ref } from 'vue'
import { bizAuth } from "@/apis/user";
import { getCurrentInstance } from 'vue'
import type { ComponentInternalInstance } from 'vue'
import { useEventChannel } from '@/hooks/useEventChannel'

const formData = reactive({
  organizationName: '',
  userName: '',
  mobile: ''
})
const loading = ref(false)
const instance = getCurrentInstance() as ComponentInternalInstance
let { eventChannel } = useEventChannel()
const submit = () => {
  const { refs } = instance
  // @ts-ignore
  refs.formRef?.validate().then(() => {
    loading.value = true
    bizAuth(formData).then(() => {
      uni.showToast({ title: '认证成功' })

      setTimeout(() => {
        uni.navigateBack()
        eventChannel.value.emit('onBizAuthSuccess', formData.organizationName);
      }, 300)
    }).catch(({ msg }) => {
      uni.showToast({ title: msg, icon: 'error' })
    }).finally(() => {
      loading.value = false
    })
  })
}
const validateMobile = (rule: any,value: string,data: any,callback: (msg: string) => void) => {
  if (!/0?(13|14|15|17|18|19)[0-9]{9}/.test(value)) {
    callback('请输入正确的手机号码')
  }
}
</script>
<style scoped lang="scss">
.button-warpper{
  position: fixed;
  bottom: 30px;
  width: 80%;
  left: 50%;
  transform: translateX(-50%);
}
</style>