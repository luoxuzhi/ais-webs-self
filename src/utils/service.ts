import { setCookie } from '@/utils/tools'
import { getQueryString } from '@fs/utils'
// import { logOutApi } from '@/projects/portal/apis/index.ts'
import { message } from 'ant-design-vue'
import { useUserStore } from '@/store/user'

export async function logout(needRedirect?: boolean) {
    // const res = await logOutApi({})
    // console.log('🚀 ~ logout ~ res:', res)
    // if (res.res_code === '0') {
    //     message.success('退出登录成功', 1, () => clearInfoToLogin(needRedirect))
    // }
    
    // 退出登录的提示信息已移至clearInfoToLogin中处理
    // 统一调用清除信息并跳转登录页的函数
    clearInfoToLogin(needRedirect)
}
/**
 * 清除登录信息跳转到登录页
 * @param needRedirect 是否需要跳转回上一个未退登的页面，判断是否是登录失效
 */
export function clearInfoToLogin(needRedirect = true) {
    // 获取用户状态，判断是否为访客模式
    const userStore = useUserStore()
    const isGuest = userStore.isGuest
    
    // 两次 encodeURIComponent 防止 url中参数有问号，跳到登录后第一次 encodeURIComponent url中的 %3F被自动显示成？
    const encodedRedirectUrl = encodeURIComponent(encodeURIComponent(location.href))
    const storageItem = ['user']
    storageItem.forEach(key => {
        localStorage.removeItem(key)
    })
    
    // 如果不是访客模式，才显示"退出登录成功"的提示
    if (!isGuest) {
        message.success('退出登录成功', 1)
    }
    
    // 重置Pinia中的用户状态
    userStore.$reset() // 重置store到其初始状态
    
    const callbackUrl = `${location.origin}/ais/portal.html#/login${needRedirect ? `?redirect=${encodedRedirectUrl}` : ''}`
    location.replace(callbackUrl)
}
// 登录
export function login() {
    const aggregationUrl = `${location.origin}/finloop/login/index.html#/aggregation`
    const redirectUrl = decodeURIComponent((getQueryString('redirect') || '') as string)
    const url = redirectUrl || aggregationUrl
    window.location.replace(url)
}