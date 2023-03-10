<template>
  <uni-container> 123 </uni-container>
</template>
<script setup lang="ts">
import { reactive } from 'vue'
import type { ActivityGroup } from '@/typings/activity'

const activityGroups = reactive<ActivityGroup[]>([])
</script>
