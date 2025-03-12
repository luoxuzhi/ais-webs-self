import { defineComponent, createApp, h, CSSProperties, shallowRef } from 'vue'
import type { SpinApi, SpinConfig, SpinInstance } from './types.ts'
import { Spin } from 'ant-design-vue'
import { DebouncedFunc, debounce } from 'lodash'
import { LoadingOutlined } from '@ant-design/icons-vue'

/** @name 单例 **/
let singleInstance: SpinInstance | undefined = undefined

/** @name 创建Spin组件 **/
export function createSpinComponent(options: SpinConfig) {
    const delay = options.delay
    //delay参数由外部消费,不传递给ant的spin控件
    options.delay = undefined
    //设置spin默认指示器样式
    if (!options.indicator) {
        options.indicator = h(LoadingOutlined, {
            style: {
                fontSize: '24px',
            },
            spin: true,
        })
    }

    // 定义Spin组件的配置，defineComponent函数仅是在定义Vue组件时提供类型推导的辅助函数。
    const spinComponent = defineComponent({
        name: 'FSpin',
        setup(props, { expose }) {
            let debounceSpin: DebouncedFunc<any> | undefined
            const delayFlag = shouldDelay(delay)
            const sSpinning = shallowRef(!delayFlag)
            if (delayFlag) {
                debounceSpin = debounce(() => {
                    sSpinning.value = true
                }, delay)
                debounceSpin()
            }

            function cancelDebounceSpin() {
                debounceSpin?.cancel()
            }

            expose({
                cancelDebounceSpin,
            })

            // setup函数可以返回一个渲染函数
            return () => {
                const style = {
                    display: sSpinning.value ? 'flex' : 'none',
                }
                return h('div', { style }, h(Spin, { ...options }))
            }
        },
    })
    // 创建组件实例
    const spinInstance = createApp(spinComponent)
    // 将组件实例挂载在一个容器元素中，参数可以是一个实际的DOM元素或一个CSS选择器
    // 如果该组件有模板或定义了渲染函数，它将替换容器内所有现存的DOM节点。
    const vm = spinInstance.mount(document.createElement('div'))

    function close() {
        const vmAny = vm as any
        vmAny.cancelDebounceSpin()
        // 移除文档流的DOM节点
        vm.$el?.parentNode?.removeChild(vm.$el)
        // 销毁组件实例
        spinInstance.unmount()
        // 单例销毁
        singleInstance = undefined
    }

    return {
        close,
        get $el(): HTMLElement {
            return vm.$el
        },
    }
}

function shouldDelay(delay?: number): boolean {
    return !!delay && !isNaN(Number(delay)) && Number(delay) > 0
}

/** @name 入口函数 **/
function service(options: SpinConfig = {}): SpinInstance {
    if (singleInstance) return singleInstance
    const resolved = resolveOptions(options)
    const instance = createSpinComponent({
        ...resolved,
    })
    // Spin组件样式处理
    addStyle(instance, options)
    // 将Spin组件插入文档流中
    ;(resolved.target! as HTMLElement).appendChild(instance.$el)
    singleInstance = instance
    return instance
}

/** @name 配置预处理，主要处理额外扩展的target属性，target不传，则默认使用body作为挂载节点 **/
const resolveOptions = (options: SpinConfig): SpinConfig => {
    let target: HTMLElement
    const isString = (val: unknown): val is string => typeof val === 'string'
    if (isString(options.target)) {
        target = document.querySelector<HTMLElement>(options.target) ?? document.body
    } else {
        target = options.target || document.body
    }
    return {
        ...options,
        target,
    }
}

/** @name 处理样式 **/
const addStyle = (instance: SpinInstance, options: SpinConfig) => {
    //默认全屏展示
    const fullscreen = options.fullscreen ?? true
    const maskStyle: CSSProperties = {
        position: fullscreen ? 'fixed' : 'absolute',
        zIndex: 2000,
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
        // display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    }
    for (const [key, value] of Object.entries(maskStyle)) {
        // instance.$el.style的属性类型: https://github.com/frenic/csstype#what-should-i-do-when-i-get-type-errors
        instance.$el.style[key as unknown as number] = value
    }
}

const api: SpinApi = {
    show: function (options: SpinConfig = {}): void {
        service(options)
    },
    hide: function (): void {
        singleInstance?.close()
    },
}

export default api
