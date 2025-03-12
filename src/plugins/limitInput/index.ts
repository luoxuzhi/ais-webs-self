import { milliFormat } from '@/utils/tools'

export default () => ({
    mounted(el, binding) {
        const bindingValue = binding.value
        // console.log(`limitinput: bindingValue=`, bindingValue)
        const decimalCount = bindingValue?.decimalCount ?? 2 //保留小数位
        const maxIntegerCount = bindingValue?.maxIntegerCount //最多整数位数
        const isMilliFormat = bindingValue?.isMilliFormat //千分位格式化
        const noNegative = bindingValue?.noNegative ?? true //禁止输入负数
        let lock = false
        const filterInput = e => {
            const value = e.target.value + ''
            let temp = ''
            let val = value.trim() // 去除前后空格
            val = value.replace(/[^\d.-]/g, '') // 只保留数字和小数点
            val = val.replace(/^\./g, '') // 开头不能是小数点
            val = val.replace(/\.{2,}/g, '.') // 多个小数点合并成一个
            val = val.replace('.', '$#$').replace(/\./g, '').replace('$#$', '.') // 只允许一个小数点
            val = val.replace(/^0\d+/g, '0') // 开头不能是多个0
            if (noNegative) {
                val = val.replace(/[-]/g, '') //禁止输入负号
                if (+val < 0) val = '0' //只允许输入0以上的正数
            } else {
                val = val.replace(/^-/, '$#$').replace(/-/g, '').replace('$#$', '-') //只有开头允许负号
            }
            if (val.indexOf('.') > 0) {
                let [integer, decimal] = val.split('.')
                if (maxIntegerCount) {
                    integer = integer.substring(0, maxIntegerCount)
                }
                decimal = decimal.substring(0, decimalCount)
                temp = integer + '.' + decimal
            } else {
                if (maxIntegerCount) {
                    temp = val.substring(0, maxIntegerCount)
                } else {
                    temp = val
                }
            }
            const startReg = /^0[0-9]\.*/g
            // 为整数不允许输入小数点
            if (decimalCount === 0) {
                temp = temp.split('.')[0]
            }
            if (startReg.test(temp)) {
                // 规范开头写入的错误数字格式  (如： 001， 01)
                temp = Number(temp).toString()
            }

            // 千分位展示
            if (isMilliFormat) {
                temp = milliFormat(temp).toString()
            }
            e.target.value = temp
            e.target.dispatchEvent(new Event('input')) // 更新v-model绑定的值
        }
        el.addEventListener('compositionstart', () => (lock = true))
        el.addEventListener('compositionend', e => {
            lock = false
            filterInput(e)
        })
        el.addEventListener('input', e => {
            if (!lock) filterInput(e)
        })
    },
})
