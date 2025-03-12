export * from '@fs/utils'
import NP from 'number-precision'

const loginTranslate = (t: any) => {
    return t
}

/**
 * 验证密码（登录+交易）
 * @param value
 * @returns
 */
export const validatePassword = (value: string, name = loginTranslate('password')) => {
    if (value.includes(' ')) {
        return `${name}${loginTranslate('notIncludeSpace')}`
    } else if (value.length < 6 || value.length > 16 || !validatePasswordFormat(value)) {
        return loginTranslate('errorLoginPwdFormat')
    }
    return true
}

export const validateTradePassword = (value: string, name = loginTranslate('tradePwd')) => {
    if (value.includes(' ')) {
        return `${name}${loginTranslate('notIncludeSpace')}`
    } else if (value.length !== 6) {
        return `${name}${loginTranslate('length6')}`
    } else if (isContinuityNum(value)) {
        return `${name}${loginTranslate('notContinuityNum')}`
    }
    return true
}

/**
 * 是否为连续数字
 * @param value
 * @returns
 */
export function isContinuityNum(value: string) {
    const arr = value.split('').map(el => +el)

    if (value.length === 1) return false

    let upNum = 0,
        downNum = 0

    for (let i = 1; i < arr.length; i++) {
        if (arr[i] - 1 === arr[i - 1]) {
            upNum++
        }

        if (arr[i] + 1 === arr[i - 1]) {
            downNum++
        }
    }

    return upNum === value.length - 1 || downNum === value.length - 1
}

/**
 * 校验密码格式, 至少包含数字\字母\特殊字符中的两个
 * @param value
 * @returns
 */
export const validatePasswordFormat = (value: string) => {
    let flag = true
    const passwordRegex1 = '0123456789'
    const passwordRegex2 = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
    const passwordRegex3 = ';./;"<>?:\'[]\\{}|~!@#$%^&*()-=+`_'
    let hasNum = 0
    let hasChar = 0
    let hasSpecialChar = 0

    for (let i = 0; i < value.length; i++) {
        if (passwordRegex1.indexOf(value.charAt(i)) > -1) {
            hasNum = 1
        } else if (passwordRegex2.indexOf(value.charAt(i)) > -1) {
            hasChar = 1
        } else if (passwordRegex3.indexOf(value.charAt(i)) > -1) {
            hasSpecialChar = 1
        } else {
            flag = false
        }
    }

    if (hasNum + hasChar + hasSpecialChar < 2) {
        flag = false
    }

    return flag
}

export function getCookie(cname: string) {
    const name = cname + '='
    const cookieArr = document.cookie.split(';')
    for (let i = 0; i < cookieArr.length; i++) {
        const cookieStr = cookieArr[i]
        if (cookieStr.indexOf(name) !== -1) return cookieStr.substring(name.length + 1, cookieStr.length)
    }
    return ''
}

export function downloadFile(data: any, fileType: any, filename: any) {
    const blob = new Blob([data], {
        type: fileType || 'application/pdf',
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename || '文件名称'
    a.click()
    URL.revokeObjectURL(url)
}

export const IS_PRODUCTION = process.env.NODE_ENV === 'production'

export const getBaseUrl = (baseUrl = '') => {
    return IS_PRODUCTION ? baseUrl : ''
}

/**
 * 将文本转换关键词高亮数组
 * @param str 文本
 * @param keyword 关键词
 * @returns
 */
export function highlightKeyword(str: string, keyword: string) {
    const res: {
        type: string
        text: string
    }[] = []
    let _str = str

    while (_str.length) {
        const index = _str.indexOf(keyword)
        if (index === -1) break
        res.push({
            type: 'normal',
            text: _str.slice(0, index),
        })

        res.push({
            type: 'highlight',
            text: keyword,
        })

        _str = _str.slice(index + keyword.length)
    }

    if (_str.length) {
        res.push({
            type: 'normal',
            text: _str,
        })
    }

    return res
}

export function transformFile2Blob(file: File) {
    return new Promise(resolve => {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = function () {
            const obj = binaryFun(reader.result)
            const blob = new Blob([obj.u8arr], { type: obj.mime })
            resolve(blob)
        }

        const binaryFun = (binary: any) => {
            const arr = binary.split(','),
                mime = arr[0].match(/:(.*?);/)[1],
                bstr = atob(arr[1])
            let n = bstr.length
            const u8arr = new Uint8Array(n)
            while (n--) {
                u8arr[n] = bstr.charCodeAt(n)
            }
            return { u8arr, mime }
        }
    })
}

/**
 * 设置coookie,传0可删除
 * @param name
 * @param value
 * @param days
 */
export function setCookie(name: string, value: string, days: number) {
    const expires = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toUTCString()
    document.cookie = `${name}=${value}; expires=${expires}; path=/`
}

export const generateMap = (arr: any[]) => {
    const options: any = [] // { label, value }
    const labelValueOptions: any = [] // { label, value }
    const keyValueMap: any = {} // 键 - 值
    const valueKeyMap: any = {} // 值 - 键
    const keysMap: any = {} // 内部使用 方便追溯 example: ALL -> 0/all
    const interalKeyMap: any = {} // key -> interalKey

    arr.forEach(([key, label, interalKey]) => {
        options.push({ key, value: label })
        labelValueOptions.push({ label, value: key })
        keyValueMap[key] = label
        valueKeyMap[label] = key
        interalKey && (keysMap[interalKey] = key)
        interalKeyMap[key] = interalKey
    })
    return {
        options,
        labelValueOptions,
        optionsWithAll: [{ key: '', value: '全部' }, ...options],
        keyValueMap,
        valueKeyMap,
        keysMap,
        interalKeyMap,
    }
}

export const getSystem = () => {
    const paths: string[] = location.pathname.split('/')
    let systemName = ''
    if (paths.length > 2) {
        systemName = `${paths[1]}-${paths[2]}`
    }
    return systemName
}

/**
 * 删除千位分隔符
 * @param num
 */
export const delMilliFormat = function (num: string): string {
    if (!num) return num
    num = num.toString()
    num = num.replace(/,/gi, '')
    return num
}

/**
 * @name 四舍五入
 * @param Number val 数字
 * @param Number places 保留位数
 * @return String
 */
export const keepDecimals = (val: string | number, places = 2) => {
    let num: string = val + ''
    if (places > 0) {
        num = NP.round(val, places) + ''
        const numStart = num.split('.')[0]
        const numEnd = num.split('.')[1] || ''
        num = `${numStart}.${numEnd.padEnd(places, '0')}`
    } else {
        num = Math.round(Number(num)) + ''
    }
    return num
}

/**
 * @name 浮点数转百分比
 * @param Number num
 * @param Object option
 */
export const floatToRatio = (num, options: any = {}) => {
    const {
        rate = true, // 是否展示百分比
        toFixed = true, // 是否保留小数
        base = 2, // 保留小数位数
        sign = true, // 正数是否带符号
        pow = 0, // 放大 10的指数幂
    } = options
    if (num === '' || Object.prototype.toString.call(+num).slice(8, -1) !== 'Number' || isNaN(+num)) return '--'
    if (toFixed) {
        num = +num * Math.pow(10, pow)
        num = keepDecimals(num, base)
    }
    return `${sign && num > 0 ? '+' : ''}${num}${rate ? '%' : ''}`
}

/**
 * @name 金额输入
 * @param {String} value
 * @param {Object} options
 * @returns string
 */
// eslint-disable-next-line max-params
export const amountInput = (value, options = { base: 3 }, maxIntegerDigits = 10, maxDecimalDigits = 2) => {
    value = value + ''
    const reg = new RegExp(`\\.{${options.base},}`, 'g')
    let val = value.replace(/[^0-9.]/g, '').replace(reg, '.')
    // 去除小数点开头
    const pointReg = new RegExp(/^\.[0-9.]*/, 'g')
    if (pointReg.test(val)) {
        val = '0' + val
    }
    // 去除0开头的整数部分(如01, 023, 0002) 但不包含小数这样的数据(如：0.12)
    const zeroReg = new RegExp(/^[0][0-9][0-9.]*/, 'g')
    if (zeroReg.test(val)) {
        val = val.substring(1, val.length)
    }
    let newValue = value.replace(/[^\d.]/g, '') // 移除非数字和点号以外的字符
    newValue = newValue.replace(/\.(\d*)\.(?!\d)/, '.$1') // 确保小数点只出现一次
    const regex = new RegExp(`^-?\\d{0,${maxIntegerDigits}}(\\.\\d{0,${maxDecimalDigits}})?$`)
    const parts = newValue.split('.')

    if (parts.length > 1 && parts[1].length > maxDecimalDigits) {
        newValue = maxDecimalDigits > 0 ? parts[0] + '.' + parts[1].slice(0, maxDecimalDigits) : parts[0]
    }
    if (!regex.test(newValue)) {
        const [int, float] = newValue.split('.')
        const intStr = int.substr(0, maxIntegerDigits)
        const floatStr = float ? float.substr(0, maxDecimalDigits) : ''
        newValue = maxDecimalDigits > 0 ? [intStr, floatStr].filter(el => !!el).join('.') : intStr
    }
    // 非数字 和负数返回0
    if (+newValue < 0) newValue = '0'
    const result = newValue.indexOf('.') > 0 ? newValue.split('.')[0] + '.' + newValue.split('.')[1].substring(0, maxDecimalDigits) : newValue
    return result
}
