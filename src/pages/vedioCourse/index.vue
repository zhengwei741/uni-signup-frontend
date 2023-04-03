<template>
  <view>
    <uni-card
      v-for="video in vedioList"
      :is-shadow="false"
      :key="video.vedioVid"
      :title="video.vedioName"
    >
      <txv-video :playerid="video.vedioVid" :vid="video.vedioVid"></txv-video>
    </uni-card>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { queryVedioCourse } from '@/apis/user'

const vedioList = ref<{ vedioVid: string; vedioName: string }[]>([])

onMounted(() => {
  queryVedioCourse().then((ret) => {
    vedioList.value = ret.data
  })
})
</script>
