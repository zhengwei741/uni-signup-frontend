<template>
  <view class="editor_toolbox" v-if="props.editable">
    <i class="iconfont icon-undo" data-method="undo" @tap="edit" />
    <i class="iconfont icon-redo" data-method="redo" @tap="edit" />
    <i class="iconfont icon-img" data-method="insertImg" @tap="edit" />
    <i class="iconfont icon-video" data-method="insertVideo" @tap="edit" />
    <i class="iconfont icon-link" data-method="insertLink" @tap="edit" />
    <i class="iconfont icon-text" data-method="insertText" @tap="edit" />
    <i class="iconfont icon-clear" @tap="clear" />
    <!-- <i class="iconfont icon-save" @tap="save" /> -->
  </view>
  <mp-html
    ref="articleRef"
    container-style="padding:10px"
    :content="content"
    :editable="props.editable"
    :domain="URL"
    lazy-load
    scroll-table
    selectable
    use-anchor
    :tag-style="tagStyle"
    @remove="onRemove"
  />
</template>
<script setup lang="ts">
//@ts-ignore
import mpHtml from '@/components/mp-html/components/mp-html/mp-html'
import { getCurrentInstance, ref, onMounted, computed } from 'vue'
import type { ComponentInternalInstance } from 'vue'
import { useUpdateImage } from '@/hooks/useUpdateImage'
import { URL } from '@/const'

type EditerProps = {
  modelValue: string
  editable: boolean
}

// props
const props = withDefaults(defineProps<EditerProps>(), {
  modelValue: '',
  editable: true
})

// emits
const emits = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const content = computed(() => props.modelValue.replaceAll('video', 'iframe'))

const tagStyle = {
  table:
    'box-sizing: border-box; border-top: 1px solid #dfe2e5; border-left: 1px solid #dfe2e5;',
  th: 'border-right: 1px solid #dfe2e5; border-bottom: 1px solid #dfe2e5;',
  td: 'border-right: 1px solid #dfe2e5; border-bottom: 1px solid #dfe2e5;',
  li: 'margin: 5px 0;'
}

const instance = getCurrentInstance() as ComponentInternalInstance
const articleRef = ref()

const { updateImage } = useUpdateImage('/api/activity/mini/uploadImg')

type SrcType = 'img' | 'video' | 'audio' | 'link'
onMounted(() => {
  // type img/video/audio/link
  // value 修改链接时，这里会传入旧值
  // type 为音视频时可以返回一个数组作为源地址
  // type 为 audio 时，可以返回一个 object，包含 author、name、poster、src 等字段
  articleRef.value.getSrc = (type: SrcType, value: string) => {
    return new Promise((resolve, reject) => {
      if (type === 'img') {
        uni.showActionSheet({
          itemList: ['本地选取', '远程连接'],
          success(res) {
            if (res.tapIndex === 0) {
              updateImage().then(resolve).catch(reject)
            } else {
              // 打开弹窗
              uni.showModal({
                editable: true,
                title: '请输入链接地址',
                content: '',
                success: function (res) {
                  if (res.confirm) {
                    resolve(res.content)
                  } else if (res.cancel) {
                    reject()
                  }
                }
              })
            }
          }
        })
        return
      }
      const title = {
        video: '视频链接',
        audio: '音频链接',
        link: '链接地址'
      }
      uni.showModal({
        editable: true,
        // @ts-ignore
        title: `请输入${title[type]}`,
        content: value || '',
        success: function (res) {
          if (res.confirm) {
            resolve(res.content || '')
          } else if (res.cancel) {
            reject()
          }
        }
      })
    })
  }
})

const edit = (e: any) => {
  const { refs } = instance
  // @ts-ignore
  refs['articleRef'][e.currentTarget.dataset.method]()
}

const getImageList = () =>
  articleRef.value.nodes
    .filter((node: any) => node.name === 'img')
    .map((node: any) => node.attrs.src)

const clear = () => {
  uni.showModal({
    title: '确认',
    content: '确定清空内容吗？',
    success: (res) => {
      if (res.confirm) {
        const imageList = getImageList()
        articleRef.value.clear()
      }
    }
  })
}

const replaceVid = (content: string) => {
  const videoBaseUrl = `https://v.qq.com/txp/iframe/player.html?`
  const regex = / (\w+)=["']?((?:.(?!["']?\s+(?:\S+)=|\s*\/?[>"']))+.)["']?/g

  let m
  let finalContent = content
  while ((m = regex.exec(content)) !== null) {
    if (m.index === regex.lastIndex) {
      regex.lastIndex++
    }
    if (m[1] === 'vid') {
      const vidProps = m[0]
      finalContent = finalContent.replace(
        vidProps,
        ` src=${videoBaseUrl}${m[1]}=${m[2]}`
      )
    }
  }
  return finalContent
}

const save = () => {
  // https://v.qq.com/txp/iframe/player.html?vid=i3506xg09ew
  let content = articleRef.value.getContent() || ''

  if (content.indexOf('txv-video') !== -1) {
    content = content.replaceAll('txv-video', 'iframe')
    content = replaceVid(content)
  } else {
    content = content
      .replaceAll('<video', '<iframe')
      .replaceAll('</video>', '</iframe>')
  }
  emits('update:modelValue', content)
}

const onRemove = (removeNode: { type: string; src: string }) => {
  const { type, src } = removeNode
  if (type === 'img') {
    console.log(type)
    console.log(src)
  }
}

defineExpose({
  save
})
</script>

<style scoped lang="scss">
.editor_toolbox {
  width: 100%;
  background-color: #ededed;
  display: flex;
  padding: 5px;
  box-sizing: border-box;
  line-height: 1.6;
}

@font-face {
  font-family: 'iconfont';
  src: url('data:application/x-font-woff2;charset=utf-8;base64,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')
    format('woff2');
}

.iconfont {
  flex: 1;
  text-align: center;
  font-family: 'iconfont' !important;
  font-size: 22px;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.icon-undo:before {
  content: '\e607';
}

.icon-redo:before {
  content: '\e606';
}

.icon-img:before {
  content: '\e6e2';
}

.icon-video:before {
  content: '\e798';
}

.icon-link:before {
  content: '\e60d';
}

.icon-text:before {
  content: '\e6ce';
}

.icon-clear:before {
  content: '\e637';
}

.icon-save:before {
  content: '\e501';
}
</style>
