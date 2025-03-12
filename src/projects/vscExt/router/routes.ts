import { RouteRecordRaw } from 'vue-router'
// 动态加载about组件
const routes: RouteRecordRaw[] = [
    {
        path: '/',
        name: 'role',
        redirect: '/list',
        component: ()=> import("@/components/Layout/HeaderLayout/index.vue"),
        children: [
            {
                path: '/list',
                name: 'list',
                component: () => import('@/projects/vscExt/pages/list/index.vue'),
                meta: {
                    title: 'VSCode插件',
                },
            },
            {
                path: '/detail',
                name: 'detail',
                component: () => import('@/projects/vscExt/pages/detail/index.vue'),
                meta: {
                    title: 'VSCode插件',
                },
            },
        ]
    },
]

export default routes
