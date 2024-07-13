import { useCommonStore } from '@/store/common'
import { watchEffect } from 'vue'
import { GZH_OPENID_FLAG } from '@/const'

export const useAssociationGZH = () => {
  // 公众号关联
  const store = useCommonStore()
  watchEffect(() => {
    if (store.gzhOpenidFlag === GZH_OPENID_FLAG) {
      uni.navigateTo({
        url: '/pages/webview/index'
      })
    }
  })
}
