import * as glob from 'glob'
import path from 'path'

function createHtmlEntryProxy() {
    // 使用 glob.sync 查找所有符合条件的目录
    const dirs = glob.sync('./entry/*') || [];
    const entryModule = {};
    console.log(dirs,'*************')

    // 遍历每个匹配到的目录
    dirs.forEach((dir) => {
        // 获取当前目录相对于 ./entry 的路径
        const relativePath = path.relative('./entry', dir);
        
        // 获取路径中的最后一部分作为 module
        const module = path.basename(relativePath);
        // console.log(relativePath,'********************999999')
        if (module) {
            entryModule[`/ais/${module}`] = {
                target: 'http://127.0.0.1:5800/ais/entry',
                changeOrigin: true,
                rewrite: (path) => path.replace('/ais', ''),
            };
        }
    });

    return entryModule;
}

// 导出处理后的代理配置
export const htmlEntryProxy = createHtmlEntryProxy();