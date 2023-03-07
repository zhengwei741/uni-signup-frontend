<template>
  <uni-search-bar
    @confirm="searchHandel"
    v-model="searchValue"
    placeholder="活动名称"
  >
  </uni-search-bar>

  <uni-scroll :getData="getData" :height="height">
    <template v-slot="{ item }">
      <activity-card></activity-card>
    </template>
  </uni-scroll>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import useSafeScrollHeight from '@/hooks/useSafeScrollHeight'
import ActivityCard from './components/activityCard.vue'

// height 56是searchBar高度
const height = useSafeScrollHeight() - 56

// search
const searchValue = ref('')
const searchHandel = (value: string) => {
  console.log(value)
}
// data
const getData = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        list: [
          { name: '活动1活动1活动1活动1活动1活动1活动1活动1' },
          { name: '活动2' },
          { name: '活动3' },
          { name: '活动4' },
          { name: '活动5' },
          { name: '活动6' },
          { name: '活动7' },
          { name: '活动8' },
          { name: '活动9' }
        ]
      })
    }, 1000)
  })
}
// click
const onClick = () => {
  debugger
}
</script>
