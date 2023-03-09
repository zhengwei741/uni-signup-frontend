<template>
  <scroll-view
    class="uni-scroll"
    :scroll-y="true"
    :style="style"
    :refresher-enabled="enabled"
    :lower-threshold="200"
    :refresher-triggered="refresherTriggered"
    @refresherrefresh="onRefresherRefresh"
    @scrolltolower="onScrolltoLower"
  >
    <view>
      <view
        v-for="(item, index) in scrollList"
        :key="item[props.idField] || index"
      >
        <slot :item="item" :index="index"></slot>
      </view>
      <uni-load-more iconType="circle" :status="status" />
    </view>
  </scroll-view>
</template>
<script setup lang="ts">
import { ref, computed, unref } from 'vue'

export interface ScrollProps {
  height: Number
  list: Array<any>
  pullUp: boolean // 是否开启上拉加载
  dropDown: boolean // 是否开启下拉刷新
  idField: string
  isNoMore: boolean
}
// props
const props = withDefaults(defineProps<ScrollProps>(), {
  height: () => 300,
  list: () => [],
  pullUp: () => false,
  dropDown: () => false,
  idField: 'id'
})

// emits
const emits = defineEmits<{
  (e: 'onPullUp', close: () => void): void
  (e: 'onDropDown', close: () => void): void
}>()

// 是否开启下拉刷新
const enabled = computed(() => props.dropDown)
// 加载提示状态
const status = computed(() => {
  if (unref(props.isNoMore)) {
    return 'noMore'
  }
  return refresherTriggered.value ? 'more' : 'loading'
})

const scrollList = computed(() => props.list)
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

  emits('onPullUp', () => {
    refresherTriggered.value = false
  })
}
// 下拉
const onRefresherRefresh = () => {
  if (refresherTriggered.value) return

  refresherTriggered.value = true

  emits('onDropDown', () => (refresherTriggered.value = false))
}
</script>
