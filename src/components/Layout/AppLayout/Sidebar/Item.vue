<template>
    <div class="menu-item" v-if="!(item.meta && item.meta.hidden)">
        <!-- 单个菜单 -->
        <template v-if="hasOneShowingChild(item.children)">
            <a-menu-item :key="item.path" @click="handleClick(item)">
                <template #icon>
                    <img :src="rootKeys.includes(item.path) ? item.meta?.activeIcon : item.meta?.normalIcon" v-if="item.meta?.normalIcon" />
                </template>
                <div :class="{ dot: showRedDot(item) }">{{ item.meta?.title }}</div>
            </a-menu-item>
        </template>

        <!-- 存在子菜单 -->
        <a-sub-menu :key="item.path" v-else>
            <template #icon>
                <img :src="rootKeys.includes(item.path) ? item.meta?.activeIcon : item.meta?.normalIcon" v-if="item.meta?.normalIcon" />
            </template>
            <template #title>
                {{ item.meta?.title }}
            </template>
            <!-- 递归 -->
            <Item v-for="child in item.children" :key="child.path" :item="child" :rootKeys="rootKeys" />
        </a-sub-menu>
    </div>
</template>

<script setup lang="ts">
import type { RouteRecordRaw } from 'vue-router'
import { useRouter } from 'vue-router'
import { useLayoutStore } from '@/store/layout'
import { computed } from 'vue'
const router = useRouter()
const store = useLayoutStore()
// 接收父组件传递的参数
withDefaults(
    defineProps<{
        item?: any
        rootKeys: any[] // 选中的菜单的根路由, 用于显示图标的选中状态
    }>(),
    {}
)

// 是否仅有1个要展示的子菜单
const hasOneShowingChild = (children: Array<RouteRecordRaw> = []) => {
    const showingChildren = children.filter((item: any) => {
        return !item.meta.hidden
    })
    // 没有要展示的子路由
    return !showingChildren.length
}

const handleClick = (item: any) => {
    store.addTab(item)
    console.log('🚀 ~ handleClick ~ item:', store)
    router.push(item.path)
}
const hasNotify = computed(() => {
    return store.hasInquiryNotify
})
const showRedDot = item => {
    return item.name === 'inquiry' && hasNotify.value
}
</script>
<style lang="less" scoped>
.menu-item {
    .dot {
        position: relative;

        &::before {
            position: absolute;
            top: 15px;
            left: -6px;
            display: block;
            width: 8px;
            height: 8px;
            background: 'red';
            background: red;
            border-radius: 50%;
            content: '';
        }
    }
}
</style>
