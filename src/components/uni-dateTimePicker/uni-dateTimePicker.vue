<template>
  <view class="uni-dateTimePicker">
    <view class="data">
      <view class="icon">
        <uni-icons type="calendar" size="25" color="#e5e5e5"></uni-icons>
      </view>
      <view class="picker">
        <picker mode="date" :value="data" :start="startDate" :end="endDate" @change="bindDateChange">
          <view class="uni-input">{{data}}</view>
        </picker>
      </view>
    </view>
    <view class="time">
      <view class="picker">
        <picker mode="time" :value="time" start="00:00" end="23:59" @change="bindTimeChange">
          <view class="uni-input">{{time}}</view>
        </picker>
      </view>
    </view>
  </view>
</template>
<script setup lang="ts">
import { ref, computed, watchEffect } from 'vue'
import dayjs from 'dayjs';
import { formatTime } from '@/utils'

type DateTimePickerProps = {
  modelValue: string
}
// props
const props = withDefaults(defineProps<DateTimePickerProps>(), {
  modelValue: formatTime(dayjs(), 'YYYY-MM-DD')
})
// emits
const emits = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const getValue = (format = 'YYYY-MM-DD') => {
  return dayjs(props.modelValue).format(format)
}

const data = ref('')

const time = ref('')

watchEffect(() => {
  data.value = getValue()
  time.value = getValue('HH:mm')
})

const fullTime = computed(() => `${data.value} ${time.value}`)

const startDate = computed(() => formatTime(dayjs().subtract(10, 'year'), 'YYYY-MM-DD'))
const endDate = computed(() => formatTime(dayjs().add(10, 'year'), 'YYYY-MM-DD'))

const bindDateChange = (e: any) => {
  data.value = e.detail.value
  emits('update:modelValue', fullTime.value)
}

const bindTimeChange = (e: any) => {
  time.value = e.detail.value
  emits('update:modelValue', fullTime.value)
}

</script>

<style scoped lang="scss">
.uni-dateTimePicker{
  display: flex;
  .data, .time{
    border: 1px solid #e5e5e5;
    border-radius: 3px;
    flex: 1;
    display: flex;
  }
  .time{
    margin-left: 5px;
  }
  .icon{
    width: 30px;
    padding: 6px;
  }
  .picker{
    display: flex;
    align-items: center;
    padding-left: 15px;
    flex: 1;
  }
}
</style>