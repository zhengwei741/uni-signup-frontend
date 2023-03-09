<template>
  <view class="uni-empty">
    <uni-icons
      custom-prefix="iconfont"
      type="icon-zanwushuju"
      :size="60"
      color="#777"
    ></uni-icons>
    <text>{{ props.description }}</text>
  </view>
</template>
<script setup lang="ts">
export type UniEmptyProps = {
  description: string
}
const props = withDefaults(defineProps<UniEmptyProps>(), {
  description: '暂无数据'
})
</script>
<style scoped lang="scss">
.uni-empty {
  width: 100%;
  height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
</style>
