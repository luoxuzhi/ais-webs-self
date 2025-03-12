<template>
    <div class="nav-bar">
        <MenuUnfoldOutlined class="menu-arrow" v-if="collapsed" @click="toggleCollapsed" />
        <MenuFoldOutlined class="menu-arrow" v-else @click="toggleCollapsed" />
        <!-- 折叠与展开 -->
        <!-- <div  :class="{ collapsed: collapsed }" @click="toggleCollapsed">
            <img src="@/assets/svg/finloop/arrow.svg" />
        </div> -->
        <EnvironmentFilled :style="{ 'font-size': '16px' }"></EnvironmentFilled>
        <div class="crmb-title">{{ '当前位置：' }}</div>
        <Breadcrumb></Breadcrumb>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { MenuFoldOutlined, MenuUnfoldOutlined, EnvironmentFilled } from '@ant-design/icons-vue'
import { useLayoutStore } from '@/store/layout'
import Breadcrumb from './Breadcrumb.vue'

// 菜单收起与展开状态
const LayoutStore = useLayoutStore()
const collapsed = computed(() => LayoutStore.collapsed)

// 菜单收起与展开切换
const toggleCollapsed = () => {
    LayoutStore.updateCollapsed(!collapsed.value)
}
</script>

<style lang="less" scoped>
.nav-bar {
    display: flex;
    flex-direction: row;
    flex-shrink: 0;
    align-items: center;
    justify-content: flex-start;
    box-sizing: border-box;
    height: 60px;
    padding: 8px 24px;
    background: #fff;
    border-bottom: 1px solid #eee;
}

.crmb-title {
    margin-left: 2px;
    color: #1d2129;
    font-weight: normal;
    font-size: 14px;
}

.menu-arrow {
    position: relative;
    margin-right: 16px;
    color: #1d2129;
    font-weight: normal;
    font-size: 20px;
    cursor: pointer;
}
</style>
