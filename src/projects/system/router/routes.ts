import { RouteRecordRaw } from 'vue-router'
import AppLayout from '@/components/Layout/AppLayout/Index.vue'
import Home from '@/assets/svg/finloop/home.svg'
import HomeActive from '@/assets/svg/finloop/home_active.svg'

const routes: RouteRecordRaw[] = [
    {
        path: "/",
        redirect: '/user',
        meta: {
            hidden: true,
        }
    },

    {
        path: '/user',
        name: 'User',
        redirect: '/user/list',
        component: AppLayout,
        meta: {
            title: '用户管理',
            normalIcon: Home,
            activeIcon: HomeActive,
        },
        children: [
            {
                path: '/user/list',
                name: 'UserList',
                component: () => import('@/projects/system/pages/user/list/index.vue'),
                meta: {
                    title: '用户列表',
                },
            },
        ],
    },
]

export default routes
