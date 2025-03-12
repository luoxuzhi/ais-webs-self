// directives/limitAmount.js
// 整数位：默认限制不超 10 个字符
// 小数位：默认限制 不超2字符
export default {
    mounted(el, binding, vnode) {
        const maxIntegerDigits = binding?.value?.integer || 10 // 获取整数部分最大位数
        const maxDecimalDigits = binding?.value?.decimal || 2 // 获取小数部分最大位数，默认为2
        const maxVal = binding?.value?.maxVal || null // 获取最大值，默认空
        let isCommaProcessing = false // 添加一个标志，避免输入过程中反复触发格式化
        const formatNumber = val => {
            // 格式化数字为千分位格式
            return val.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',')
        }
        const handler = event => {
            const value = event.target.value
            let newValue = value.replace(/[^\d.-]/g, '') // 移除非数字和点号以外的字符
            newValue = newValue.replace(/\.(\d*)\.(?!\d)/, '.$1') // 确保小数点只出现一次
            // eslint-disable-next-line no-useless-escape
            newValue = newValue.replace(/^(?=-)|-(?!\A)/g, '') // 确保负号只出现一次
            const regex = new RegExp(`^-?\\d{0,${maxIntegerDigits}}(\\.\\d{0,${maxDecimalDigits}})?$`)
            const parts = newValue.split('.')

            if (parts.length > 1 && parts[1].length > maxDecimalDigits) {
                newValue = parts[0] + '.' + parts[1].slice(0, maxDecimalDigits)
            }

            if (!regex.test(newValue)) {
                if (newValue.includes('.')) {
                    newValue = newValue.substr(0, maxIntegerDigits) + '.' + newValue.split('.')[1]
                } else {
                    newValue = newValue.slice(0, maxIntegerDigits)
                }
            }
            // 最大值为1的处理逻辑
            if (maxVal && newValue > maxVal) {
                newValue = maxVal
            }
            if (!isCommaProcessing) {
                setTimeout(() => {
                    isCommaProcessing = true
                    event.target.value = formatNumber(newValue)
                    isCommaProcessing = false
                }, 0)
            }

            console.log('newValue=>', newValue)
        }
        el.addEventListener('input', handler)

        // 在unmount时移除事件监听器
        vnode.unmount = () => {
            el.removeEventListener('input', handler)
        }
    },
}
