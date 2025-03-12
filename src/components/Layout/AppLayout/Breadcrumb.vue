<template>
    <a-breadcrumb>
        <a-breadcrumb-item v-for="(route, index) in routes" :key="index">{{ route.meta?.title || route.name }}</a-breadcrumb-item>
    </a-breadcrumb>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
// 路由
const router = useRouter()
// 路由数组
const selectRoutes = ref<RouteRecordRaw[]>([])

// 路由数组
const routes = computed(() => {
    return getNewRoutes()
})

function getNewRoutes(): RouteRecordRaw[] {
    if (selectRoutes.value.length === 0) {
        selectRoutes.value = router.options.routes.map(item => {
            return item
        })
    }
    return selectRoutes.value
}

// const canJump = (route: any): boolean => {
//     return route.meta && route.meta.hidden && route.path
// }

// const jumpPath = (route: any): void => {
//     if (canJump(route)) {
//         const index = selectRoutes.value.indexOf(route)
//         if (index && index > 0) {
//             const removeCount = selectRoutes.value.length - index - 1
//             //选中清除，会在beforeEach里重新添加新的路由
//             selectRoutes.value.splice(index, removeCount + 1)
//             // sessionStorage.setItem(RouteKey, JSON.stringify(selectRoutes.value))
//             router.go(-removeCount)
//         }
//     }
// }

//监听路由变化
onMounted(() => {
    router.beforeEach((to, from, next) => {
        const toMatched = to.matched || []
        const fromMatched = from.matched || []
        const count = fromMatched.length
        if (
            count > 1 &&
            selectRoutes.value.length > 1 &&
            fromMatched.length === toMatched.length &&
            fromMatched[count - 2].path === toMatched[count - 2].path &&
            to.meta.hidden &&
            to.meta.hidden === true
        ) {
            //同一个children下, 不在侧边栏显示的页面
            const toPath = toMatched[count - 1].path
            const lastPath = selectRoutes.value[selectRoutes.value.length - 2].path
            if (toPath !== lastPath) {
                const match = toMatched[count - 1]
                selectRoutes.value.push(match)
            } else {
                selectRoutes.value.pop()
            }
        } else {
            const matched = toMatched
            selectRoutes.value = matched.map((item: any) => {
                return item
            })
        }
        next()
    })
})

// 路由变化时
// watch(
//     route,
//     () => {
//         const matched = route.matched || []
//         selectRoutes.value = matched.map(item => {
//             if (item.children) {
//                 item.children = []
//             }
//             return item
//         })
//     },
//     {
//         immediate: true,
//         deep: true,
//     }
// )
</script>
