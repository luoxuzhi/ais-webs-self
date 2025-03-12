/**
 * 获取当前目录下的环境变量文件
 * tips: 所有 import.meta.glob 的参数都必须以字面量传入。不可以在其中使用变量或表达式。
 * 所以通过函数传入获取的模块的路径
 * @returns
 */
export function getEnvData(globFunction: () => Record<string, any>) {
    // 这个路径不能传动态的
    const modulesFiles = globFunction()
    const envData: Record<string, any> = {}
    for (const key of Object.keys(modulesFiles)) {
        const name = key.replace(/\.\/(.+)\.ts/, (...args) => {
            return args[1]
        })
        envData[name] = modulesFiles[key].default
    }

    return envData
}
