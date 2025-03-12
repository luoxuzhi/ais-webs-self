import { get, post } from '@/http'
import { getBaseUrl } from '@/utils/tools'
import { getEnvConfig } from '@/config/env'
const { ais_api } = getEnvConfig()
const domain = getBaseUrl(ais_api)
const commonConfig = {
    origin: false,
}
// 合并请求参数
const mergeOptions = (data: any, config: any = {}) => {
    return Object.assign({}, commonConfig, { data }, config)
}

export const CreateVscExt = (data: CreateVscExt, config = {}): RequestResPromise<string> => {
    return post(
        `${domain}/ais-api/vscExt/create`,
        mergeOptions(data, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            ...config,
        })
    )
}

export const GetVscExtList = (data: VscExtListParam, config = {}): RequestResPromise<VscExtListRecord> => {
    return get(
        `${domain}/ais-api/vscExt/list`,
        mergeOptions(data, {
            ...config,
        })
    )
}

export const GetVscExtDetail = (data: IdParam, config = {}): RequestResPromise<VscExtRecord> => {
    return get(
        `${domain}/ais-api/vscExt/detail`,
        mergeOptions(data, {
            ...config,
        })
    )
}

export const GetVscExtVersionList = (data: IdParam, config = {}): RequestResPromise<VscExtVersionListRecord> => {
    return get(
        `${domain}/ais-api/vscExt/versionList`,
        mergeOptions(data, {
            ...config,
        })
    )
}

export const UploadVscExtVersion = (data: VscExtVersion, config = {}): RequestResPromise<string> => {
    return post(
        `${domain}/ais-api/vscExt/uploadVersion`,
        mergeOptions(data, {
            // 上传文件请求头
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            ...config,
        })
    )
}

export const UpdateVscExtStatus = (data: VscExtStatus, config = {}): RequestResPromise<string> => {
    return post(
        `${domain}/ais-api/vscExt/updateStatus`,
        mergeOptions(data, {
            ...config,
        })
    )
}


export const DelVscExtVersion = (data: IdParam, config = {}): RequestResPromise<string> => {
    return post(
        `${domain}/ais-api/vscExt/delVersion`,
        mergeOptions(data, {
            ...config,
        })
    )
}


export const DelVscExt = (data: IdParam, config = {}): RequestResPromise<string> => {
    return post(
        `${domain}/ais-api/vscExt/del`,
        mergeOptions(data, {
            ...config,
        })
    )
}