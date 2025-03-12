import { merge } from 'lodash'
import { getEnvData } from '@/utils/buils-tool'

const envData = getEnvData(() => import.meta.glob('./**.ts', { eager: true }))
export function getEnvConfig(): any {
    try {
        const mode = import.meta.env.MODE
        return merge(envData.base || {}, envData[mode] || envData.dev)
    } catch (error) {
        console.log(`Feng.chen:: 19:26:54 error ===> `, error)
    }
}

export const channelEnv = getEnvConfig()
console.log('🚀 channelEnv:', channelEnv)
