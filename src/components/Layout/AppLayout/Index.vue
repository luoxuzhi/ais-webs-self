<template>
    <div class="app-container">
        <!-- 侧边栏 -->
        <Sidebar />
        <div
            class="app-main"
            :class="{
                collapsed,
            }"
        >
            <!-- 顶部导航栏 -->
            <NavBar />
            <!-- 导航tabs -->
            <NavTabs></NavTabs>
            <!-- 内容区 -->
            <div class="app-content" ref="appContentRef" id="app-content">
                <AppMain>
                    <router-view v-slot="{ Component }">
                        <keep-alive :include="alivePages">
                            <component :is="Component" />
                        </keep-alive>
                    </router-view>
                </AppMain>
                <Footer></Footer>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useLayoutStore, useKeepAliveStore } from '@/store/layout'
import AppMain from './AppMain.vue'
import NavBar from './NavBar.vue'
import Sidebar from './Sidebar/Index.vue'
import Footer from '../Footer.vue'
import NavTabs from './NavTabs.vue'
const router = useRouter()

// 菜单收起与展开状态
const layoutStore = useLayoutStore()
const collapsed = computed(() => layoutStore.collapsed)
onMounted(() => {
    layoutStore.appContentRef = appContentRef.value
})

// 每次切换路由都滚回至顶部
const appContentRef = ref()
const keepAliveStore = useKeepAliveStore()
const alivePages = computed(() => {
    return Object.keys(keepAliveStore.alivePages)
})
router.beforeEach((to, from, next) => {
    if (from.meta.keepAlive) {
        keepAliveStore.setItem(from.name as string, {
            scrollTop: appContentRef.value.scrollTop,
        })
    }
    next()
})

router.afterEach((to, from) => {
    if (keepAliveStore.alivePages[to.name as string]) {
        const { scrollTop } = keepAliveStore.alivePages[to.name as string]
        appContentRef.value?.scrollTo(0, scrollTop || 0)
    } else {
        appContentRef.value?.scrollTo(0, 0)
    }
})
</script>

<style lang="less" scoped>
.app-container {
    display: flex;
    width: 100%;
    height: 100%;
}

.app-menu {
    z-index: 100;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    width: 226px;
    height: 100%;
    padding: 0 12px;
    background: #13274a;
    transition: width 0.28s;
}

.app-main {
    display: flex;
    flex-direction: column;
    flex-shrink: 1;
    width: calc(100% - 226px);
    background: #f6f6f6;
    transition: width 0.28s;

    &.collapsed {
        width: calc(100% - 72px);
    }
}

.app-content {
    position: relative;
    display: flex;
    flex: 1;
    flex-direction: column;
    flex-shrink: 1;
    box-sizing: border-box;
    overflow: auto;
}
</style>
