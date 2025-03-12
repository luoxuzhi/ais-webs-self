import { onMounted, onUnmounted, ref } from 'vue'

export function useFullScreen() {
    // 是否处于全屏状态
    const isFullScreen = ref<boolean>(false)
    // 全屏函数
    const fullScreenFn = (element: string | HTMLElement | null) => {
        let ele: HTMLElement = document.body

        if (typeof element === 'string' && document.querySelector(element)) {
            ele = document.querySelector(element) as HTMLElement
        }
        if (element instanceof HTMLElement) {
            ele = element
        }
        ele && ele.requestFullscreen()
    }
    const exitfullScreenFn = () => {
        if (document.exitFullscreen) {
            document.exitFullscreen()
        }
    }
    // 全屏事件监听函数
    const fullScreenListen = () => {
        if (document.fullscreenElement) {
            isFullScreen.value = true
        } else {
            isFullScreen.value = false
        }
    }
    onMounted(() => {
        document.addEventListener('fullscreenchange', fullScreenListen)
    })
    // 离开全屏移除监听
    onUnmounted(() => {
        document.removeEventListener('fullscreenchange', fullScreenListen)
    })
    return { isFullScreen, fullScreenFn, exitfullScreenFn }
}
