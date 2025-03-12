// 参考文档：https://router.vuejs.org/guide/
import { createRouter, createWebHashHistory } from 'vue-router'
import routes from './routes'
import { useUserStore } from '@/store/user'

const router = createRouter({
    history: createWebHashHistory(),
    routes,
})

router.beforeEach((to, from, next) => {
    const userStore = useUserStore()
    const title = to?.meta?.title
    document.title = [title, '前端智能平台'].filter(el=>!!el).join(' - ')
    
    // 检查用户是否已登录或者是访客模式
    const isAuthenticated = !!userStore.token
    const isGuestMode = userStore.isGuest
    
    // 如果目标是登录页
    if (to.name === 'login') {
        if (isAuthenticated || isGuestMode) {
            // 已登录或访客模式则重定向到聚合页
            next({ name: 'aggregation' })
        } else {
            next()
        }
    } 
    // 如果目标是聚合页
    else if (to.name === 'aggregation') {
        if (isAuthenticated || isGuestMode) {
            // 已登录或访客模式可访问聚合页
            next()
        } else {
            // 未登录且非访客模式重定向到登录页
            next({ name: 'login' })
        }
    }
    // 其他页面需要验证身份
    else if (isAuthenticated) {
        next()
    } else {
        next({ name: 'login', query: { redirect: to.fullPath } })
    }
})

export default router