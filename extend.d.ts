import { ComponentCustomProperties } from 'vue'

declare module 'vue' {
    interface ComponentCustomProperties {
        $env: any
    }
}

// 必须导出，才能在其他文件中使用
export default ComponentCustomProperties
