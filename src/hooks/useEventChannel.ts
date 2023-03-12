import { ref, getCurrentInstance, nextTick } from 'vue'
import type { ComponentInternalInstance } from 'vue'
import { onLoad } from '@dcloudio/uni-app'

export const useEventChannel = () => {
  const instance = getCurrentInstance() as ComponentInternalInstance
  let eventChannel = ref<any>()
  onLoad(async () => {
    await nextTick();
    if (instance && instance.proxy) {
      // @ts-ignore
      eventChannel.value = instance.proxy.getOpenerEventChannel();
    }
  })

  return {
    eventChannel
  }
}

