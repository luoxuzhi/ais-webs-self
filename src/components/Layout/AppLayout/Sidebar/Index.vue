<template>
    <div class="app-menu" :style="{ width: collapsed ? '72px' : '226px' }">
        <!-- Logo -->
        <div class="menu-head" :class="{ collapsed: collapsed }">
            <img class="logo" src="@/assets/svg/finloop/logo.svg" />
            <img class="title" src="@/assets/svg/finloop/title.svg" />
        </div>

        <!-- 菜单 -->
        <div class="menu-main">
            <AppMenu :collapsed="collapsed" />
        </div>

        <!-- 用户信息-退出登录 -->
        <AppUser />
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useLayoutStore } from '@/store/layout'
import AppMenu from './Menu.vue'
import AppUser from './User.vue'

// 菜单收起与展开状态
const LayoutStore = useLayoutStore()
const collapsed = computed(() => LayoutStore.collapsed)
</script>

<style lang="less" scoped>
@import '@/assets/css/mixin';

.menu-head {
    display: flex;
    align-items: center;
    padding: 20px 0 32px;

    &.collapsed {
        justify-content: center;

        .title {
            display: none;
        }
    }

    .icon {
        width: 40px;
        height: 40px;
    }

    .title {
        width: 55px;
        height: 40px;
        margin-left: 10px;
    }
}

.menu-main {
    flex: 1 1 0%;
    overflow: hidden auto;

    // 滚动条样式
    .scrollbar();
}
</style>
