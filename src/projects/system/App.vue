<script setup lang="ts">
import zhCN from 'ant-design-vue/es/locale/zh_CN' // 导入简体中文语言包
</script>

<template>
    <a-config-provider :locale="zhCN">
        <router-view></router-view>
    </a-config-provider>
</template>

<style lang="less">
#app {
    box-sizing: border-box;
    width: 100%;
    max-width: 100%;
    height: 100vh;
    padding: 0;
}
</style>
