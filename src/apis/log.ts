import { post } from '@/http'
import { getBaseUrl } from '@/utils/tools'
import { getEnvConfig } from '@/config/env'
import { LoginParams, LoginUser } from '@/types/user'
const { ais_api } = getEnvConfig()
const domain = getBaseUrl(ais_api)
const commonConfig = {
    origin: false,
}
// 合并请求参数
const mergeOptions = (data: any, config: any = {}) => {
    return Object.assign({}, commonConfig, { data }, config)
}

export const ReportLog = (data: LogParams, config = {}): RequestResPromise<{
    count: number
}> => {
    return post(`${domain}/ais-api/log/report`, mergeOptions(data, config))
}
