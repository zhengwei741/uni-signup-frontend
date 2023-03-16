<template>
  <view>
    <text v-if="props.activeText">{{ props.activeText }}</text>
    <switch
      :checked="checked"
      :size="props.size"
      :style="style"
      color="#007aff"
      @change="onChange"
    />
  </view>
  <text v-if="props.inactiveText">{{ props.inactiveText }}</text>
</template>

<script setup lang="ts">
import { computed } from 'vue'

export type SwitchProps = {
  /** 打开时的文字描述 */
  activeText: string
  /** 关闭时的文字描述 */
  inactiveText: string
  /** 打开时的背景色 */
  activeColor: string
  /** 关闭时的背景色 */
  inactiveColor: string
  /** 打开时的值 */
  activeValue: string | boolean | number
  /** 关闭时的值 */
  inactiValue: string | boolean | number
  /** 尺寸 */
  size: 'normal' | 'mini'
  /** 绑定值 */
  value: string | boolean | number
}

// props
const props = withDefaults(defineProps<SwitchProps>(), {
  activeText: '',
  inactiveText: '',
  activeColor: '#007aff',
  inactiveColor: '#C0CCDA',
  activeValue: true,
  inactiValue: false,
  size: 'normal',
  value: ''
})

const checked = computed(() => {
  if (props.value === props.activeValue) return true
  if (props.value === props.inactiValue) return false
  return false
})

const style = computed(() => {
  const scale = props.size === 'normal' ? 1 : 0.7
  return {
    transform: `scale(${scale})`
  }
})

// emits
const emits = defineEmits<{
  (e: 'chagne', value: any): void
  (e: 'update:value', value: any): void
}>()

const onChange = (e: any) => {
  const orgValue = e.detail.value as boolean
  const emitValue = orgValue ? props.activeValue : props.inactiValue
  emits('chagne', emitValue)
  emits('update:value', emitValue)
}
</script>
