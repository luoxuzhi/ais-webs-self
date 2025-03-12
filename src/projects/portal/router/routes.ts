import { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
    {
        path: '/',
        redirect: '/login',
    },
    {
        path: '/login',
        name: 'login',
        component: () => import('../pages/login.vue'),
        meta: {
            title: '登录',
        },
    },
    {
        path: '/aggregation',
        name: 'aggregation',
        component: () => import('../pages/aggregation.vue'),
        meta: {
            title: '聚合页',
        },
    },
]

export default routes
