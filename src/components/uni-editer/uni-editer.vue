<template>
  <view class="editor_toolbox">
    <uni-icons type="undo" size="30"></uni-icons>
    <!-- <i class="iconfont icon-undo" data-method="undo" bindtap="edit" />
    <i class="iconfont icon-redo" data-method="redo" bindtap="edit" />
    <i class="iconfont icon-img" data-method="insertImg" bindtap="edit" />
    <i class="iconfont icon-video" data-method="insertVideo" bindtap="edit" />
    <i class="iconfont icon-link" data-method="insertLink" bindtap="edit" />
    <i class="iconfont icon-text" data-method="insertText" bindtap="edit" />
    <i class="iconfont icon-clear" bindtap="clear" />
    <i class="iconfont icon-save" bindtap="save" /> -->
  </view>
  <mp-html :content="html" />
</template>
<script setup lang="ts">
const html = `
  <section style="text-align: center; margin: 0px auto;">
    <section style="border-radius: 4px; border: 1px solid #757576; display: inline-block; padding: 5px 20px;">
      <span style="font-size: 18px; color: #595959;">表格</span>
    </section>
  </section>
`
</script>
