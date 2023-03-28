<template>
  <view class="uni-popup-dialog">
    <view class="uni-dialog-title">
      <text class="uni-dialog-title-text uni-popup__info">{{ titleText }}</text>
    </view>
    <view class="uni-dialog-content">
      <slot> </slot>
    </view>
    <slot name="buttonGroup">
      <view class="uni-dialog-button-group">
        <view class="uni-dialog-button" @click="closeDialog">
          <text class="uni-dialog-button-text">{{ closeText }}</text>
        </view>
        <view class="uni-dialog-button uni-border-left" @click="onOk">
          <text class="uni-dialog-button-text uni-button-color">{{
            okText
          }}</text>
        </view>
      </view>
    </slot>
  </view>
</template>

<script lang="ts">
// @ts-ignore
import popup from '@dcloudio/uni-ui/lib/uni-popup/popup.js'
// @ts-ignore
import messages from '@dcloudio/uni-ui/lib/uni-popup/i18n/index.js'
import { initVueI18n } from '@dcloudio/uni-i18n'
const { t } = initVueI18n(messages)

export default {
  mixins: [popup],
  emits: ['confirm', 'close'],
  props: {
    title: {
      type: String,
      default: ''
    },
    beforeClose: {
      type: Boolean,
      default: false
    },
    cancelText: {
      type: String,
      default: ''
    },
    confirmText: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      focus: false,
      val: ''
    }
  },
  computed: {
    okText() {
      return this.confirmText || t('uni-popup.ok')
    },
    closeText() {
      return this.cancelText || t('uni-popup.cancel')
    },
    placeholderText() {
      return this.placeholder || t('uni-popup.placeholder')
    },
    titleText() {
      return this.title || t('uni-popup.title')
    }
  },
  created() {
    // 对话框遮罩不可点击
    // @ts-ignore
    this.popup.disableMask()
  },
  mounted() {
    this.focus = true
  },
  methods: {
    /**
     * 点击确认按钮
     */
    onOk() {
      if (this.mode === 'input') {
        this.$emit('confirm', this.val)
      } else {
        this.$emit('confirm')
      }
      if (this.beforeClose) return
      // @ts-ignore
      this.popup.close()
    },
    /**
     * 点击取消按钮
     */
    closeDialog() {
      this.$emit('close')
      if (this.beforeClose) return
      // @ts-ignore
      this.popup.close()
    },
    close() {
      // @ts-ignore
      this.popup.close()
    }
  }
}
</script>
<style lang="scss" scoped>
$uni-primary: #007aff !default;
$uni-success: #4cd964 !default;
$uni-warning: #f0ad4e !default;
$uni-error: #dd524d !default;

.uni-popup-dialog {
  width: 300px;
  border-radius: 11px;
  background-color: #fff;
}

.uni-dialog-title {
  /* #ifndef APP-NVUE */
  display: flex;
  /* #endif */
  flex-direction: row;
  justify-content: center;
  padding-top: 25px;
}

.uni-dialog-title-text {
  font-size: 16px;
  font-weight: 500;
}

.uni-dialog-content {
  /* #ifndef APP-NVUE */
  display: flex;
  /* #endif */
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 20px;
}

.uni-dialog-content-text {
  font-size: 14px;
  color: #6c6c6c;
}

.uni-dialog-button-group {
  /* #ifndef APP-NVUE */
  display: flex;
  /* #endif */
  flex-direction: row;
  border-top-color: #f5f5f5;
  border-top-style: solid;
  border-top-width: 1px;
}

.uni-dialog-button {
  /* #ifndef APP-NVUE */
  display: flex;
  /* #endif */

  flex: 1;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  height: 45px;
}

.uni-border-left {
  border-left-color: #f0f0f0;
  border-left-style: solid;
  border-left-width: 1px;
}

.uni-dialog-button-text {
  font-size: 16px;
  color: #333;
}

.uni-button-color {
  color: $uni-primary;
}

.uni-popup__info {
  color: #909399;
}
</style>
