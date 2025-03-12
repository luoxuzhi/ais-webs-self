<template>
    <a-menu
        v-model:selectedKeys="selectedKeys"
        :openKeys="openKeys"
        :inline-collapsed="collapsed"
        mode="inline"
        theme="dark"
        @openChange="onOpenChange"
        @click="onClick"
    >
        <Item v-for="route in menuList" :key="route.path" :item="route" :rootKeys="rootKeys" />
    </a-menu>
</template>

<script lang="ts" setup>
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Item from './Item.vue'
import { useKeepAliveStore } from '@/store/layout'

// 声明类型
interface Props {
    collapsed?: boolean // 菜单收起与展开状态
}

// 设置默认值
const props = withDefaults(defineProps<Props>(), {
    collapsed: false, // 菜单收起与展开状态
})

// 路由
const route = useRoute()
const router = useRouter()

// 菜单数组
const menuList = computed(() => router.options.routes)
console.log('🚀 ~ menuList:', menuList.value)

// 含有子菜单数组, 用于只展开当前父级菜单
const rootSubmenuKeys = computed(() => {
    return router.options.routes.map(item => {
        if (item.children) {
            return item.path
        }
    })
})

// 当前选中的菜单项数组且与NavBar联动, 默认为当前路由
const selectedKeys = ref<string[]>([route.fullPath])

// 当前展开的SubMenu菜单项key数组
const openKeys = ref<string[]>([])

// 选中的菜单的根路由, 用于显示图标的选中状态
const rootKeys = ref<string[]>([])

// 路由变化时, 设置rootKeys、openKeys、selectedKeys的值
watch(
    route,
    () => {
        const matched = route.matched || []
        if (!(route.meta && route.meta.hidden)) {
            rootKeys.value = matched.slice(0, matched.length - 1).map(el => el.path)
            // 菜单折叠时, 不设置openKeys
            openKeys.value = props.collapsed ? [] : matched.slice(0, matched.length - 1).map(el => el.path)
            selectedKeys.value = [route.fullPath]
        }
    },
    {
        immediate: true,
    }
)

// 菜单展开时, 设置openKeys的值
watch(
    () => props.collapsed,
    val => {
        if (!val) {
            //只记录非隐藏路由
            if (!(route.meta && route.meta.hidden)) {
                const matched = route.matched || []
                openKeys.value = matched.slice(0, matched.length - 1).map(el => el.path)
            }
        }
    }
)

// SubMenu展开/关闭的回调 - 用于只展开当前父级菜单
const onOpenChange = (keys: string[]) => {
    const latestOpenKey = keys.find(key => openKeys.value.indexOf(key) === -1)
    if (rootSubmenuKeys.value.indexOf(latestOpenKey) === -1) {
        openKeys.value = keys
    } else {
        openKeys.value = latestOpenKey ? [latestOpenKey] : []
    }
}

// 点击菜单清空缓存
const keepAliveStore = useKeepAliveStore()
function onClick() {
    keepAliveStore.removeAll()
}
</script>
