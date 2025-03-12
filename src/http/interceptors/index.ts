import { clearInfoToLogin } from '@/utils/service'
import { FSH5Http } from '@fs/http'
import { message } from 'ant-design-vue'
import { useUserStore } from '@/store/user'

export default function (http: FSH5Http) {
    if (!http) {
        console.error('no http instance, please push http!')
        return
    }

    http.registerInterceptor('request', {
        onFulfilled: (res: any) => {
            const userStore = useUserStore()
            const { token } = userStore
            if (token) {
                res.headers.Authorization = token
            }
            return res
        },
        onRejected: e => {
            return Promise.reject(e)
        },
        options: {},
    })

    http.registerInterceptor('response', {
        onFulfilled: (res: any) => {
            if (!res.headers['content-type'].includes('application/json')) return Promise.resolve(res)
            const { code, error } = res.data

            // 错误提示，默认展示
            if (code !== 0 && (res.config.showError || res.config.showError === undefined)) {
                message.error(res.data.message)
            }

            if(code === 401){
                clearInfoToLogin()
                return Promise.reject(res.data)
            }

            return Promise.resolve(res.data)
        },
        onRejected: (e: any) => {
            message.error("网络错误")
            return Promise.reject(e)
        },
        options: {},
    })
}
