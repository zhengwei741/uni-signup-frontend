<template>
  <view class="uni-container">
    <slot></slot>
  </view>
</template>
<style scoped lang="scss">
.uni-container {
  width: 100%;
  padding-bottom: env(safe-area-inset-bottom);
}
</style>
