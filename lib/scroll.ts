/**
 * 平滑滚动工具函数
 */

// 缓动函数 - 二次贝塞尔曲线
function easeInOutQuad(t: number, b: number, c: number, d: number): number {
  t /= d / 2
  if (t < 1) return c / 2 * t * t + b
  t--
  return -c / 2 * (t * (t - 2) - 1) + b
}

/**
 * 平滑滚动到指定位置
 * @param targetPosition 目标滚动位置
 * @param duration 滚动持续时间（毫秒）
 */
export function smoothScrollTo(targetPosition: number, duration: number = 600): void {
  const startPosition = window.pageYOffset
  const distance = targetPosition - startPosition
  let startTime: number | null = null

  function animation(currentTime: number) {
    if (startTime === null) startTime = currentTime
    const timeElapsed = currentTime - startTime
    const run = easeInOutQuad(timeElapsed, startPosition, distance, duration)
    window.scrollTo(0, run)
    if (timeElapsed < duration) requestAnimationFrame(animation)
  }

  requestAnimationFrame(animation)
}

/**
 * 滚动到指定元素
 * @param elementId 目标元素的 ID
 * @param headerOffset 头部偏移量（像素）
 * @param duration 滚动持续时间（毫秒）
 */
export function scrollToElement(elementId: string, headerOffset: number = 80, duration: number = 600): void {
  const element = document.getElementById(elementId)
  if (element) {
    const elementPosition = element.offsetTop - headerOffset
    smoothScrollTo(elementPosition, duration)
  }
}

/**
 * 更新 URL 锚点
 * @param anchorId 锚点 ID
 */
export function updateUrlAnchor(anchorId: string): void {
  const url = new URL(window.location.href)
  url.hash = anchorId
  window.history.replaceState(null, '', url.pathname + url.hash)
}

/**
 * 处理锚点点击事件
 * @param anchorId 锚点 ID
 * @param headerOffset 头部偏移量（像素）
 */
export function handleAnchorClick(anchorId: string, headerOffset: number = 80): void {
  scrollToElement(anchorId, headerOffset)
  updateUrlAnchor(anchorId)
}
