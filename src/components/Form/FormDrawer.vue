<template>
    <a-drawer v-bind="$attrs" :maskClosable="maskClosable" :body-style="{ paddingBottom: '80px' }" @close="onClose">
        <slot></slot>
        <template #footer>
            <a-button @click="onClose">取消</a-button>
            <a-button type="primary" @click="onConfirm">确认</a-button>
        </template>
    </a-drawer>
</template>
<script lang="ts" setup>
const emit = defineEmits(['close', 'confirm', 'update:visible'])

withDefaults(
    defineProps<{
        maskClosable?: boolean
    }>(),
    {
        maskClosable: false,
    }
)

function onClose() {
    hide()
    emit('close')
}

function onConfirm() {
    emit('confirm')
}

function hide() {
    emit('update:visible', false)
}

defineExpose({
    hide,
})
</script>

<style scoped lang="less">
.ant-btn + .ant-btn {
    margin-left: 12px;
}
</style>
