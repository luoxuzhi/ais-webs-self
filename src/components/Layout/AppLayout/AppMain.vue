<template>
    <div class="main-container">
        <a-config-provider :theme="THEME" :locale="local">
            <slot></slot>
        </a-config-provider>
    </div>
</template>

<script setup lang="ts">
import { THEME } from '@/utils/antd'
import zhCN from 'ant-design-vue/es/locale/zh_CN'
import 'dayjs/locale/zh-cn'
const local = zhCN
</script>

<style lang="less" scoped>
.main-container {
    flex: 1;
    box-sizing: border-box;
    width: 100%;
    min-width: 960px;
    padding: 0 24px 24px;
}
</style>
