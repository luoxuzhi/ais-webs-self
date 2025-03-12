// import * as glob from 'glob'

import path from 'path'
import { resolve } from 'path'
import { globSync } from 'glob'
/**
 * 获取多页应用入口文件路径
 * @returns { Array }
 */
const getEntryPath = () => {
    const entries = globSync('./entry/*.html')
    const entryPoints = {}

    entries.forEach(entry => {
        const name = path.basename(entry, '.html')
        entryPoints[name] = resolve(__dirname, entry)
    })

    return entryPoints
}

export default {
    input: getEntryPath(),
}
