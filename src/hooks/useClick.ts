/**
 *
 * @param onClick 单击函数
 * @param onDoubleClick 双击函数
 * @returns
 */
export const useClick = ({ onClick, onDoubleClick }: { onClick: Function; onDoubleClick: Function }) => {
    const delayTime = 300
    let lastClickTime = 0
    let timer: any = null

    return (...args) => {
        const now = Date.now()
        const isOverShortTime = now - lastClickTime > delayTime
        if (isOverShortTime) {
            timer = setTimeout(() => {
                onClick(...args)
            }, delayTime)
            lastClickTime = now
        } else {
            onDoubleClick(...args)
            clearTimeout(timer)
            lastClickTime = 0
        }
    }
}
