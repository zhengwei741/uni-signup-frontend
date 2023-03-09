const useSafeScrollHeight = () => {
  const { safeAreaInsets, windowHeight } = uni.getSystemInfoSync()
  let bottom = 0
  if (safeAreaInsets) {
    bottom = safeAreaInsets.bottom
  }
  return windowHeight - bottom
}

export default useSafeScrollHeight
