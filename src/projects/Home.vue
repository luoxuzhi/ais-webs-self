<template>
    <div class="title">导航</div>
    <div class="item" v-for="item in list" :key="item.name">
        <a @click="click(item.path)">{{ item.name }}</a>
    </div>
</template>

<script setup>
import { ref } from 'vue'
const baseUrl = `${location.origin}`
const list = ref([
    {
        name: '登陆聚合页',
        path: '/ais/portal.html',
    },
    // {
    //     name: 'vs-code插件管理',
    //     path: '/portal/index.html',
    // },
])

const click = path => {
    const url = baseUrl + path
    console.log('url', url)

    location.href = url
}
</script>

<style scoped>
.title {
    margin-bottom: 20px;
    font-size: 20px;
    text-align: center;
}

.item {
    margin: 10px;
    font-size: 14px;
    text-align: center;
    cursor: pointer;
}
</style>
