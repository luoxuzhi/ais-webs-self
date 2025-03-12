// 移动html脚本
import fs from 'fs'
try {
    const dirNames = fs.readdirSync(`./dist/entry`)

    // copy
    for (let i = 0; i < dirNames.length; i++) {
        fs.copyFileSync(`./dist/entry/${dirNames[i]}`, `./dist/${dirNames[i]}`)
    }
    fs.rm('./dist/entry', { recursive: true }, () => {})
} catch (err) {
    console.log('move html failed', err)
}
