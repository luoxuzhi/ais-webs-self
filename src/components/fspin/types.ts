import type { SpinProps } from 'ant-design-vue'
import { createSpinComponent } from './index'

/** @name 通过交叉类型(&)扩展已有的类型声明 **/
export type SpinConfig = SpinProps & {
    /** Loading 需要覆盖的 DOM 节点。可传入一个 DOM 对象或字符串；若传入字符串，则会将其作为参数传入 document.querySelector以获取到对应 DOM 节点
     * 如果target不是根元素,position需要设置为relative或absolute */
    target?: HTMLElement | string
    /** 是否全屏展示 */
    fullscreen?: boolean
}

/** @name 获取createSpinComponent函数的返回值类型 **/
export type SpinInstance = ReturnType<typeof createSpinComponent>

export interface SpinApi {
    show(options?: SpinConfig): void
    hide(): void
}
