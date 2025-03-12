<template>
    <a-spin :indicator="indicator" :spinning="spinning" :delay="delayTime">
        <slot></slot>
    </a-spin>
</template>
<script lang="ts" setup>
import { LoadingOutlined } from '@ant-design/icons-vue'
import { h } from 'vue'
defineProps({
    spinning: {
        type: Boolean,
        default: false,
    },
})
const indicator = h(LoadingOutlined, {
    style: {
        fontSize: '24px',
    },
    spin: true,
})
const delayTime = 500
</script>
