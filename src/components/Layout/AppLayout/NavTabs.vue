<template>
    <div class="nav-tabs-container">
        <a-tag
            :class="['nav-tab', { isActive: item.active }]"
            v-for="item in tabs"
            :key="item.path"
            :closable="true"
            @close="handleClose(item)"
            @click="handleClick(item)"
        >
            {{ item.meta.title }}
        </a-tag>
    </div>
</template>

<script setup lang="ts">
import { useKeepAliveStore, useLayoutStore } from '@/store/layout'
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { getSystem } from '@/utils/tools'
const store = useLayoutStore()
const keepAliveStore = useKeepAliveStore()
const router = useRouter()
const tabs = computed(() => {
    return store.tabsMap[getSystem()]
})
const handleClick = (item: any) => {
    router.push(item.fullPath || item.path)
    keepAliveStore.removeAll()
    store.setActiveTab(item)
}
const handleClose = (item: any) => {
    store.removeTab(item, router)
}
</script>

<style lang="less" scoped>
:deep(.ant-wave) {
    display: none;
}

:deep(.anticon-close) {
    &:hover {
        transform: scale(1.4);
    }
}

.nav-tabs-container {
    box-sizing: border-box;
    width: 100%;
    min-width: 960px;
    height: 44px;
    padding: 6px 0 6px 24px;

    .nav-tab {
        box-sizing: border-box;
        height: 32px;
        padding: 4px 8px;
        color: #808695;
        font-size: 14px;
        background: white;
        border: none;
        cursor: pointer;

        &.isActive {
            color: #1b83f8;
        }
    }
}
</style>
