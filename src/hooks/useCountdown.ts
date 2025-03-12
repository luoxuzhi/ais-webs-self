// useCountdown.ts
import { ref, onUnmounted } from 'vue'

export function useCountdown(seconds: number) {
    const second = ref(seconds)
    // 是否正在倒计时
    const isCountingDown = ref(false)

    // 是否已经倒计时过完了一次
    const hasCountingDown = ref(false)

    // 开始倒计时前重置秒和倒计时状态
    const startCountdown = () => {
        if (!isCountingDown.value) {
            second.value = seconds
            isCountingDown.value = true
            countdown()
        }
    }
    // 倒计时
    const countdown = () => {
        if (second.value > 0) {
            setTimeout(() => {
                --second.value
                countdown()
            }, 1000)
        } else {
            hasCountingDown.value = true
            isCountingDown.value = false
        }
    }
    onUnmounted(() => {
        isCountingDown.value = false
    })

    return { second, startCountdown, isCountingDown, hasCountingDown }
}
