<template>
  <view class="editor_toolbox">
    <view class="editor_toolbox">
      <uni-icons type="contact" size="30" @tap="save"></uni-icons>
      <!-- <i class="iconfont icon-undo" data-method="undo" @tap="edit" />
      <i class="iconfont icon-redo" data-method="redo" @tap="edit" />
      <i class="iconfont icon-img" data-method="insertImg" @tap="edit" />
      <i class="iconfont icon-video" data-method="insertVideo" @tap="edit" />
      <i class="iconfont icon-link" data-method="insertLink" @tap="edit" />
      <i class="iconfont icon-text" data-method="insertText" @tap="edit" />
      <i class="iconfont icon-clear" @tap="clear" />
      <i class="iconfont icon-save" @tap="save" /> -->
    </view>
  </view>
  <mp-html
    ref="articleRef"
    container-style="padding:20px"
    :content="html"
    :editable="true"
    domain="https://v.qq.com"
    lazy-load
    scroll-table
    selectable
    use-anchor
    :tag-style="tagStyle"
  />
</template>
<script setup lang="ts">
//@ts-ignore
import mpHtml from '@/components/mp-html/components/mp-html/mp-html'
import { getCurrentInstance, ref } from 'vue'
import type { ComponentInternalInstance } from 'vue'

let html = `
  -----------
  <iframe src="https://v.qq.com/txp/iframe/player.html?vid=o0024gd0w91" allowFullScreen="true"></iframe>
  -----------
`

const tagStyle = {
  table:
    'box-sizing: border-box; border-top: 1px solid #dfe2e5; border-left: 1px solid #dfe2e5;',
  th: 'border-right: 1px solid #dfe2e5; border-bottom: 1px solid #dfe2e5;',
  td: 'border-right: 1px solid #dfe2e5; border-bottom: 1px solid #dfe2e5;',
  li: 'margin: 5px 0;'
}

const instance = getCurrentInstance() as ComponentInternalInstance
const articleRef = ref()

const edit = (e: any) => {
  const { refs } = instance
  // @ts-ignore
  refs[e.currentTarget.dataset.method]()
}

const clear = () => {
  uni.showModal({
    title: '确认',
    content: '确定清空内容吗？',
    success: (res) => {
      if (res.confirm) {
        articleRef.value.clear()
      }
    }
  })
}

const save = () => {
  debugger
  console.log(articleRef.value.getContent())
}
</script>
