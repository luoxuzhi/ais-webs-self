<template>
    <div class="detail-container">
        <div class="header">
            <a-button @click="goBack">返回</a-button>
            <slot name="header-slot"></slot>
        </div>

        <slot name="tab"></slot>

        <div class="content">
            <slot></slot>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

// 返回上一页
function goBack() {
    router.back()
}
</script>

<style lang="less" scoped>
.detail-container {
    .header {
        display: flex;
        justify-content: space-between;
        padding: 16px 0;
    }

    :deep(.ant-tabs) {
        background: #fff;
    }

    .content {
        padding: 24px;
        background: #fff;

        & > :deep(.table-wrapper) {
            padding: 0;
        }
    }
}
</style>
