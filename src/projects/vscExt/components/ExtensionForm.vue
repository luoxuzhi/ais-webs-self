<template>
    <a-modal v-model:open="open" :title="mode === 'create' ? `VSIX 信息表单` : `上传版本`" :maskClosable="false">
        <a-upload-dragger :before-upload="beforeUpload" :show-upload-list="false" accept=".vsix">
            <div v-if="vsixInfo.displayName">
                <p class="ant-upload-drag-icon">
                    <inbox-outlined></inbox-outlined>
                </p>
                <p class="ant-upload-text">{{ vsixInfo.displayName }}</p>
            </div>

            <div v-else>
                <p class="ant-upload-drag-icon">
                    <inbox-outlined></inbox-outlined>
                </p>
                <p class="ant-upload-text">点击或拖拽上传插件</p>
            </div>
        </a-upload-dragger>

        <ExtInfo :extensionData="vsixInfo" />
        <template #footer>
            <div style="margin-top: 20px">
                <a-button key="back" @click="handleCancel">取消</a-button>
                <a-button key="submit" type="primary" @click="handleSubmit">提交</a-button>
            </div>
        </template>
    </a-modal>

    <!-- README 模态框 -->
    <a-modal v-model:open="readmeModalVisible" title="README 内容" width="80%" :footer="null">
        <MarkdownPreview :markdownText="vsixInfo.readmeContent"></MarkdownPreview>
    </a-modal>
</template>

<script lang="ts" setup>
import { ref, defineModel } from 'vue'
import JSZip from 'jszip'
import MarkdownPreview from '@/components/MarkdownPreview.vue'
import { InboxOutlined } from '@ant-design/icons-vue'
import { CreateVscExt, UploadVscExtVersion } from '@/apis/vscExt'
import ExtInfo from './ExtInfo.vue'
import { message } from 'ant-design-vue'

const props = withDefaults(
    defineProps<{
        mode?: 'create' | 'upload'
        extensionId?: string | number
    }>(),
    {
        mode: 'create',
    }
)

const emits = defineEmits(['finish'])
const open = defineModel('open')
const vsixFile = ref<File | null>(null)
const vsixInfo = ref({
    name: '',
    displayName: '',
    version: '',
    description: '',
    publisher: '',
    vscodeVersion: '',
    repositoryUrl: '',
    iconUrl: '',
    readmeContent: '',
})
const readmeModalVisible = ref(false)

const beforeUpload = (file: File) => {
    vsixFile.value = file
    parseVsixFile(file)
    return false // 阻止默认的上传行为
}

const parseVsixFile = async (file: File) => {
    const zip = new JSZip()
    const content = await zip.loadAsync(file)
    const packageJson = content.files['extension/package.json']
    if (packageJson) {
        const packageContent = await packageJson.async('text')
        const packageData = JSON.parse(packageContent)
        console.log('🚀 ~liujinhao~ ~ parseVsixFile ~ packageData:', packageData)
        vsixInfo.value.name = packageData.name || ''
        vsixInfo.value.displayName = packageData.displayName || ''
        vsixInfo.value.version = packageData.version || ''
        vsixInfo.value.description = packageData.description || ''
        vsixInfo.value.publisher = packageData.author?.name || packageData.publisher || ''
        vsixInfo.value.vscodeVersion = packageData.engines?.vscode || ''
        vsixInfo.value.repositoryUrl = packageData.repository?.url || ''
        vsixInfo.value.iconUrl = await readIconFile(content, packageData.icon)
        vsixInfo.value.readmeContent = await readReadmeFile(content)
    }
}

const readIconFile = async (zipContent: JSZip, iconPath: string | undefined): Promise<string> => {
    if (!iconPath) return ''
    const iconFile = zipContent.files['extension/' + iconPath]
    if (iconFile) {
        const iconData = await iconFile.async('base64')
        return `data:image/png;base64,${iconData}`
    }
    return ''
}

const readReadmeFile = async (zipContent: JSZip): Promise<string> => {
    const readmeFiles = Object.keys(zipContent.files).filter(file => file.toLowerCase().includes('readme'))
    if (readmeFiles.length > 0) {
        const readmeFile = zipContent.files[readmeFiles[0]]
        if (readmeFile) {
            let readmeContent = await readmeFile.async('text')
            // 使用正则表达式匹配图片链接
            const imgRegex = /!\[.*?\]\((.*?)\)/g
            readmeContent = await Promise.all(
                readmeContent.split(imgRegex).map(async (part, index) => {
                    if (index % 2 === 0) return part
                    const imgUrl = part
                    const imgFile = zipContent.files['extension/docs/' + imgUrl]
                    let fileType = imgUrl.split('.').pop()

                    if (fileType === 'svg') {
                        fileType = `svg+xml`
                    }

                    if (imgFile) {
                        const imgData = await imgFile.async('base64')
                        return `![${imgUrl}](data:image/${fileType};base64,${imgData})`
                    }
                    return part
                })
            ).then(parts => parts.join(''))
            return readmeContent
        }
    }
    return ''
}

const base64ToFile = async (base64String: string, fileName: string): Promise<File | null> => {
    const response = await fetch(base64String)
    const blob = await response.blob()
    return new File([blob], fileName, { type: blob.type })
}
const handleSubmit = async () => {
    if (!vsixFile.value) {
        return message.error('请上传插件')
    }
    // 将 readmeContent 转换为 Blob 对象
    const { readmeContent } = vsixInfo.value
    const blob = new Blob([readmeContent], { type: 'text/plain' })
    // 创建一个 File 对象
    const readmeFile = new File([blob], 'README.md', { type: 'text/plain' })

    const params: any = {
        vsixFile: vsixFile.value,
        ...vsixInfo.value,
        readmeFile,
        iconFile: await base64ToFile(vsixInfo.value.iconUrl, 'icon.png'),
    }  
    delete params.readmeContent;
    delete params.iconUrl

    if (props.mode === 'upload') {
        params.extensionId = props.extensionId
    }

    const requestMethod = props.mode === 'create' ? CreateVscExt : UploadVscExtVersion

    const res = await requestMethod(params)

    if (res.code === 0) {
        open.value = false

        message.success(props.mode === 'upload' ? '上传新版本成功' : '新增插件成功')

        emits('finish')
    }
}

const handleCancel = () => {
    open.value = false
}
</script>

<style scoped lang="less"></style>
