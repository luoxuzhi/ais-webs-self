import { FSH5Http } from '@fs/http'

export const baseGet = (http: FSH5Http) => (url: string, paramet?: any) => {
    const config = Object.assign({}, paramet)
    config.params = config.data
    return http.request({ url, method: 'get', withCredentials: true, ...config })
}

export const basePost =
    (http: FSH5Http, _postConfig: any = {}) =>
    (url: string, paramet?: any) => {
        const postConfig = {
            jsonRpc: true, // post 默认开启 jsonRpc 2.0
            ..._postConfig,
        }
        const params = Object.assign({}, postConfig, paramet)
        console.log('🚀 ~ basePost ~ params:', { url, method: 'post', withCredentials: true, ...params })
        return http.request({ url, method: 'post', withCredentials: true, ...params })
    }
