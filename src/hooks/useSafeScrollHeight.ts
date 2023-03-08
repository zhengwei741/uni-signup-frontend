const useSafeScrollHeight = () => {
  const { safeAreaInsets, windowHeight } = uni.getSystemInfoSync()
  let bottom = 0
  if (safeAreaInsets) {
    bottom = safeAreaInsets.bottom
  }
  // TODO tabbar 高度获取不到
  return windowHeight - bottom - 48
}

export default useSafeScrollHeight
