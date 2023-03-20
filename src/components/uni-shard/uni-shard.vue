<template>
  <uni-popup ref="shareRef" type="share" safeArea backgroundColor="#fff">
    <view class="shard-popup">
      <view class="shard-popup-title">分享到</view>
      <view class="shard-popup-content">
        <uni-row>
          <uni-col :span="8">
            <view class="warpper">
              <button open-type="share" @tap="share" class="shareButton">
                <image src="../static/weixin-icon.png"></image>
              </button>
              <text>微信</text>
            </view>
          </uni-col>
        </uni-row>
      </view>
    </view>
  </uni-popup>
</template>

<script setup lang="ts">
import { ref, getCurrentInstance } from 'vue'
import type { ComponentInternalInstance } from 'vue'

// 分享相关
const share = () => uni.showShareMenu({})
const shareRef = ref()
const instance = getCurrentInstance() as ComponentInternalInstance
defineExpose({
  open() {
    const { refs } = instance
    // @ts-ignore
    refs.shareRef.open()
  }
})
</script>
<style scoped lang="scss">
.shard-popup {
  display: flex;
  flex-direction: column;
  .shard-popup-title {
    height: 50px;
    line-height: 50px;
    text-align: center;
  }
  .shard-popup-content {
    flex: 1;
  }
  .warpper {
    display: flex;
    justify-content: center;
    height: 70px;
    flex-direction: column;
    align-items: center;
  }
  .shareButton {
    height: 50px;
    width: 50px;
    background-color: transparent;
    padding: 0;
    margin: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    image {
      height: 100%;
      width: 100%;
    }
  }
  .shareButton::after {
    border-color: transparent;
  }
}
</style>