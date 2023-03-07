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
    <view v-for="item in scrollList">
      <slot :item="item"></slot>
    </view>
  </scroll-view>
</template>
<script setup lang="ts">
import { ref, computed } from 'vue'
import { onMounted } from 'vue'

export interface ScrollProps {
  height: Number
  getData: () => Promise<{ list: unknown[] }>
  pullUp: Boolean
  dropDown: Boolean
}
const props = withDefaults(defineProps<ScrollProps>(), {
  height: () => 300,
  getData: () => Promise.resolve({ list: [] }),
  pullUp: () => false,
  dropDown: () => false
})

const enabled = computed(() => props.dropDown)

const scrollList = ref<unknown[]>([])
// 是否正在刷新
const refresherTriggered = ref(false)
// 高度
const style = computed(() => ({ height: `${props.height}px` }))
// 上拉
const onScrolltoLower = () => {
  if (!props.pullUp) return

  if (refresherTriggered.value) return

  refresherTriggered.value = true
  uni.showLoading({ title: '加载中' })
  getDataHandel('append').finally(() => {
    refresherTriggered.value = false
    uni.hideLoading()
  })
}
// 下拉
const onRefresherRefresh = () => {
  if (refresherTriggered.value) return

  refresherTriggered.value = true
  getDataHandel().finally(() => {
    refresherTriggered.value = false
  })
}

type GetDataHandelType = 'init' | 'append'
const getDataHandel = async (type: GetDataHandelType = 'init') => {
  const { list } = await props.getData()
  if (type === 'init') {
    scrollList.value = list
  } else {
    scrollList.value = scrollList.value.concat(list)
  }
}
onMounted(() => {
  uni.showLoading({ title: '加载中' })
  getDataHandel().finally(() => uni.hideLoading())
})
</script>
