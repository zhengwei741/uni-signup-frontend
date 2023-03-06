<template>
  <view>
    <view v-for="item in list">
      <slot :item="item"></slot>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
  list: Array<unknown>
})

const list = computed(() => props.list)

</script>