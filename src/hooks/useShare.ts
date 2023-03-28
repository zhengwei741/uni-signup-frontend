import type { Ref } from 'vue'
import { onShareAppMessage } from '@dcloudio/uni-app'

export interface UseShare {
  <T = any>(info: Ref<Record<string, string>>): void
}

export const useShare: UseShare = (info) => {
  onShareAppMessage(() => {
    return {
      ...info.value
    }
  })

  // onShareTimeline(() => {
  //   return {
  //     ...info.value
  //   }
  // })
}
