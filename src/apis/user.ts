import { get, post } from '@/http'
import { getBaseUrl } from '@/utils/tools'
import { getEnvConfig } from '@/config/env'
import { LoginParams, LoginUser, User, CreateUserParams } from '@/types/user'
const { ais_api } = getEnvConfig()
const domain = getBaseUrl(ais_api)
const commonConfig = {
    origin: false,
}
// 合并请求参数
const mergeOptions = (data: any, config: any = {}) => {
    return Object.assign({}, commonConfig, { data }, config)
}

export const Login = (data: LoginParams, config = {}): RequestResPromise<LoginUser> => {
    return post(`${domain}/ais-api/user/login`, mergeOptions(data, config))
}

export const GetUserList = (data: Pagination, config = {}): RequestResPromise<ListRes<User>> => {
    return get(
        `${domain}/ais-api/user/list`,
        mergeOptions(data, {
            ...config,
        })
    )
}

export const CreateUser = (data: CreateUserParams, config = {}): RequestResPromise<string> => {
    return post(`${domain}/ais-api/user/create`, mergeOptions(data, config))
}
