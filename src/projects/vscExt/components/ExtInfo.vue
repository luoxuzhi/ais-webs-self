<template>
    <a-descriptions v-if="extensionData.displayName" title="扩展信息" :column="1" style="margin: 20px 0" bordered>
        <a-descriptions-item label="图标" v-if="extensionData.iconUrl">
            <img :src="extensionData.iconUrl" alt="扩展图标" style="max-width: 100px; max-height: 100px" />
        </a-descriptions-item>
        <a-descriptions-item label="扩展名称">
            {{ extensionData.displayName }}
        </a-descriptions-item>
        <a-descriptions-item label="版本">
            {{ extensionData.version }}
        </a-descriptions-item>
        <a-descriptions-item label="描述">
            {{ extensionData.description }}
        </a-descriptions-item>
        <a-descriptions-item label="发布者">
            {{ extensionData.publisher }}
        </a-descriptions-item>
        <a-descriptions-item label="VS Code 版本要求">
            {{ extensionData.vscodeVersion }}
        </a-descriptions-item>
        <a-descriptions-item label="Git 仓库地址">
            {{ extensionData.repositoryUrl }}
        </a-descriptions-item>
        <a-descriptions-item :span="1">
            <template #label>
                简介
                <a-tooltip placement="top">
                    <template #title>
                        <span >请确保简介文件路径为:<br>docs/README.md</span>
                    </template>
                    <InfoCircleOutlined />
                </a-tooltip>
            </template>
            <a-button type="primary" @click="showReadmeModal" style="margin-left: 0">README</a-button>
        </a-descriptions-item>
    </a-descriptions>

    <!-- README 模态框 -->
    <a-modal v-model:open="readmeModalVisible" title="README" width="800px" :footer="null">
        <MarkdownPreview v-if="extensionData.readmeContent" :markdownText="extensionData.readmeContent"></MarkdownPreview>
    </a-modal>
</template>

<script lang="ts" setup>
import { ref, defineProps } from 'vue'
import MarkdownPreview from '@/components/MarkdownPreview.vue'
import { InfoCircleOutlined } from "@ant-design/icons-vue"

const props = defineProps({
    extensionData: {
        type: Object,
        required: true,
    },
})

const readmeModalVisible = ref(false)

const showReadmeModal = () => {
    readmeModalVisible.value = true
}
</script>

<style scoped>
/* 可以在这里添加样式 */
</style>
