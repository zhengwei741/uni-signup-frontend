<template>
  <view class="uni-logoImage">
    <view v-if="fullSrc" class="logoImage-warpper">
      <view class="clear">
        <uni-icons type="clear" size="30" @tap="clear"></uni-icons>
      </view>
      <image mode="aspectFit" :src="fullSrc" style="width: 100%"></image>
    </view>
    <button size="mini" plain="true" v-else @click="uploadLogo">
      点击上传Logo
    </button>
  </view>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useUpdateImage } from '@/hooks/useUpdateImage'
import { URL } from '@/const'

const props = withDefaults(defineProps<{ src: string }>(), { src: '' })

const fullSrc = computed(() => {
  if (uploadSrc.value || isClear.value) {
    return uploadSrc.value
  }
  if (props.src) {
    return `${URL}/${props.src}`
  }
  return ''
})

const { updateImage } = useUpdateImage('/api/activity/mini/uploadLogo')

const uploadSrc = ref<string>('')
const uploadLogo = () => updateImage().then((src) => (uploadSrc.value = src))

const isClear = ref(false)
const clear = () => {
  uploadSrc.value = ''
  isClear.value = true
}
</script>

<style scoped lang="scss">
.uni-logoImage {
  width: 100%;
  height: 240px;
  display: flex;
  justify-content: center;
  align-items: center;
  .logoImage-warpper {
    width: 100%;
    position: relative;
    .clear {
      position: absolute;
      top: 5px;
      right: 5px;
    }
  }
}
</style>
