// 参考文档：https://router.vuejs.org/guide/
import { createRouter, createWebHashHistory } from 'vue-router'
import routes from './routes'

const router = createRouter({
    history: createWebHashHistory(),
    routes,
})

router.beforeEach((to, from, next) => {
    const title = to?.meta?.title
    document.title = [title, '前端智能平台'].filter(el=>!!el).join(' - ')
    next()
})

export default router
