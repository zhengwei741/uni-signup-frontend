<template>
  <scroll-view
    :scroll-y="true"
    :style="style"
    :refresher-enabled="enabled"
    :lower-threshold="200"
    :refresher-triggered="refresherTriggered"
    @refresherrefresh="onRefresherRefresh"
    @scrolltolower="onScrolltoLower"
  >
    <view v-for="(item, index) in scrollList" :key="index">
      <slot :item="item"></slot>
    </view>
  </scroll-view>
</template>
<script setup lang="ts">
import { ref, computed } from 'vue'

export interface ScrollProps {
  height: Number
  list: Array<unknown>
  pullUp: Boolean // 是否开启上拉加载
  dropDown: Boolean // 是否开启下拉刷新
}
// props
const props = withDefaults(defineProps<ScrollProps>(), {
  height: () => 300,
  list: () => [],
  pullUp: () => false,
  dropDown: () => false
})

// emits
const emits = defineEmits<{
  onPullUp: (close: () => void) => void,
  onDropDown: (close: () => void) => void,
}>()
// 是否开启下拉刷新
const enabled = computed(() => props.dropDown)

const scrollList = ref<unknown[]>(props.list)
// 是否正在刷新
const refresherTriggered = ref(false)
// 高度
const style = computed(() => ({
  height: `${props.height}px`,
  'background-color': '#f1f1f1'
}))
// 上拉
const onScrolltoLower = () => {
  if (!props.pullUp) return

  if (refresherTriggered.value) return

  refresherTriggered.value = true

  uni.showLoading({ title: '加载中' })
  emits.onPullUp(() => {
    refresherTriggered.value = false
    uni.hideLoading()
  })
}
// 下拉
const onRefresherRefresh = () => {
  if (refresherTriggered.value) return

  refresherTriggered.value = true

  emits.onDropDown(() => refresherTriggered.value = false)
}
</script>
