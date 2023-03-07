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
      <uni-card :title="item.name" sub-title="副标题" thumbnail="https://web-assets.dcloud.net.cn/unidoc/zh/unicloudlogo.png" @click="onClick">
				<text class="uni-body">这是一个带头像和双标题的基础卡片，此示例展示了一个完整的卡片。</text>
			</uni-card>
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
          { name: '活动1活动1活动1活动1活动1活动1活动1活动1活动1活动1活动1活动1活动1活动1活动1活动1活动1活动1活动1活动1活动1活动1活动1活动1活动1活动1活动1活动1活动1活动1活动1活动1' },
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
