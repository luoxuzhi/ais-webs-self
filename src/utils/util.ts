export const generateMap = (arr: any[]) => {
    const options: any = [] // { label, value }
    const keyValueMap: any = {} // 键 - 值
    const valueKeyMap: any = {} // 值 - 键
    const keysMap: any = {} // 内部使用 方便追溯 example: ALL -> 0/all

    arr.forEach(([key, label, interalKey]) => {
        options.push({ key, value: label })
        keyValueMap[key] = label
        valueKeyMap[label] = key
        interalKey && (keysMap[interalKey] = key)
    })

    return {
        options,
        optionsWithAll: [{ key: '', value: '全部' }, ...options],
        keyValueMap,
        valueKeyMap,
        keysMap,
    }
}

/**
 * 根据header生成文件名
 */
export const getFilenameFromHeaders = (headers: any = {}, defaultName = '') => {
    const headerKey = 'content-disposition'
    console.log('getFilenameFromHeaders headers', headers)
    const headerValue = headers[headerKey] || ''
    const filenameReg = /filename=(.+)/
    const result = headerValue.match(filenameReg)
    if (result) {
        const [, value] = result
        const filename = value.replace(/"/g, '').replace(/;/g, '')
        return filename
    }
    return defaultName
}

/**
 * 下载文件
 */
export const downloadFile = (blob: any, name: string) => {
    // 解码文件名
    let fileName = decodeURIComponent(name) || ''
    console.log('downloadFile fileName', fileName)
    if (!fileName.includes('%')) {
        fileName = decodeURIComponent(fileName)
    }

    const url = URL.createObjectURL(blob)
    downloadUrl(url, fileName)
    URL.revokeObjectURL(url) // 销毁url对象
}

/**
 * 根据url下载
 * @param {String} url
 * @param {String} name
 */
export const downloadUrl = (url: string, name = '') => {
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', name)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
}

/**
 * 检查 非空数组、undefined、null 或空字符串
 */
export function isValid(value: any): boolean {
    if (Array.isArray(value)) {
        return value.length > 0 // 确保数组不为空
    }
    return value !== undefined && value !== null && value !== ''
}
