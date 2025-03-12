<template>
    <div class="page">
        <div v-if="detailData.id" class="main">
            <CustomBreadcrumb :config="breadcrumbList"></CustomBreadcrumb>
            <div class="header">
                <img :src="detailData.iconFileUrl" />

                <div class="item__main">
                    <div class="row">
                        <div class="value title">{{ detailData.displayName }}</div>
                        <div>
                            <a-tag :color="statusColorMap[detailData.status]">{{ statusMap[detailData.status] }}</a-tag>
                            <a-tag color="blue">VSCode版本：{{ detailData.vscodeVersion }}</a-tag>
                        </div>
                    </div>

                    <div class="row">
                        <div class="item">
                            <UserOutlined />
                            <div class="value">{{ detailData.publisher }}</div>
                        </div>
                        <div class="item">
                            <VerticalAlignBottomOutlined />
                            <div class="value">{{ detailData.downloadTimes || 0 }}</div>
                        </div>
                    </div>

                    <div class="row">
                        <div class="value desc">{{ detailData.description }}</div>
                    </div>

                    <div class="row" style="margin-top: 10px">
                        <a-dropdown-button type="primary" @click="onDownload(detailData)">
                            <template #overlay>
                                <a-menu @click="onClickAction">
                                    <a-menu-item v-if="detailData.status == 1" key="publish">上架</a-menu-item>
                                    <a-menu-item v-if="detailData.status == 2" key="unpublish">下架</a-menu-item>
                                    <a-menu-item key="delete">删除</a-menu-item>
                                    <a-menu-item key="upload">上传版本</a-menu-item>
                                </a-menu>
                            </template>
                            立刻下载
                        </a-dropdown-button>

                        <a-button v-if="detailData.repositoryUrl" @click="goRepository">
                            <GithubOutlined />
                            项目仓库
                        </a-button>
                    </div>
                </div>
            </div>

            <div class="content">
                <a-tabs v-model:activeKey="activeKey">
                    <a-tab-pane key="1" tab="简介">
                        <div class="content-tab">
                            <MarkdownPreview v-if="detailData.readmeContent" :markdownText="detailData.readmeContent"></MarkdownPreview>
                        </div>
                    </a-tab-pane>
                    <a-tab-pane key="2" tab="版本">
                        <div class="content-tab">
                            <FsTable
                                ref="tableRef"
                                class="tableHistoryRef mar-t20"
                                size="small"
                                :showFilter="false"
                                :showPagination="false"
                                :data="getVersionList"
                                :columns="versionColumns"
                            >
                                <template #bodyCell="{ column, record }">
                                    <template v-if="column.key === 'action'">
                                        <a-button type="primary" @click="onDownload(record)">下载</a-button>
                                        <a-button type="primary" danger @click="onDelVersion(record)" style="margin-left: 20px">删除</a-button>
                                        <a-button @click="onViewVersion(record)" style="margin-left: 20px">查看</a-button>
                                    </template>
                                </template>
                            </FsTable>
                        </div>
                    </a-tab-pane>
                </a-tabs>
            </div>
        </div>
    </div>

    <ExtensionForm
        v-if="detailData.id"
        v-model:open="formVisible"
        mode="upload"
        :extensionId="detailData.id"
        :key="+formVisible"
        @finish="refreshData"
    ></ExtensionForm>

    <a-modal v-model:open="versionInfoVisible">
        <ExtInfo :extensionData="currentVersion" />
    </a-modal>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { DelVscExt, DelVscExtVersion, GetVscExtDetail, GetVscExtVersionList, UpdateVscExtStatus } from '@/apis/vscExt'
import { useRoute } from 'vue-router'
import FsTable from '@/components/FsTable/index.vue'
import { GithubOutlined } from '@ant-design/icons-vue'
import ExtensionForm from '../../components/ExtensionForm.vue'
import ExtInfo from '../../components/ExtInfo.vue'
import { UserOutlined, VerticalAlignBottomOutlined } from '@ant-design/icons-vue'
import { downloadVscExt } from '../../hooks'
import router from '../../router'
import { Modal, message } from 'ant-design-vue'
import { previewFileUrl } from '@/apis/file'
import CustomBreadcrumb from '@/components/CustomBreadcrumb/index.vue'

const breadcrumbList = ref([{ text: '插件列表', path: '/list' }, { text: '插件详情' }])

const route = useRoute()

const statusMap = {
    1: '未上架',
    2: '已上架',
}
const statusColorMap = {
    1: '',
    2: 'green',
}

const versionColumns: any[] = [
    {
        key: 'version',
        title: '版本号',
    },
    {
        key: 'createTime',
        title: '上传时间',
    },
    {
        key: 'action',
        title: '操作',
    },
]

const formVisible = ref(false)
const versionInfoVisible = ref(false)
const tableRef = ref<any>()

getData()
const detailData = ref<any>({})
const activeKey = ref('1')
async function getData() {
    const res = await GetVscExtDetail({
        id: Number(route.query.id),
    })

    if (res.result) {
        detailData.value = res.result

        detailData.value.iconFileUrl = `${previewFileUrl}?path=${detailData.value.iconFilePath}`
        detailData.value.vsixFileUrl = `${previewFileUrl}?path=${detailData.value.vsixFilePath}`

        breadcrumbList.value[1].text = detailData.value.displayName
        document.title =  detailData.value.displayName + " - 前端智能平台"
    }
}

async function getVersionList() {
    const res = await GetVscExtVersionList({
        id: Number(route.query.id),
    })

    if (res.result) {
        res.result.list.forEach(el => {
            el.iconFileUrl = `${previewFileUrl}?path=${el.iconFilePath}`
            el.vsixFileUrl = `${previewFileUrl}?path=${el.vsixFilePath}`
        })
        return res.result
    }
}

async function onDownload(data) {
    downloadVscExt(
        {
            url: data.vsixFileUrl,
            id: data.id,
        },
        value => {
            data.downloadTimes = value
        }
    )
}

async function goRepository() {
    window.open(detailData.value.repositoryUrl, '_blank')
}

async function onClickAction(item) {
    let res: any = null
    switch (item.key) {
        case 'publish':
            res = await UpdateVscExtStatus({
                status: 2,
                id: Number(route.query.id),
            })
            if (res.result) {
                detailData.value.status = 2
                message.success('上架成功')
            }
            break
        case 'unpublish':
            res = await UpdateVscExtStatus({
                status: 1,
                id: Number(route.query.id),
            })
            if (res.result) {
                detailData.value.status = 1
                message.success('下架成功')
            }
            break
        case 'delete':
            delVscExt()
            break
        case 'upload':
            formVisible.value = true
            break
    }
}

function refreshData() {
    getData()
    tableRef?.value.getData()
}

const currentVersion = ref({})
function onViewVersion(record) {
    versionInfoVisible.value = true
    currentVersion.value = record
}

async function onDelVersion(record) {
    Modal.confirm({
        title: '提示',
        content: '确定要删除该版本吗？',
        async onOk() {
            const res = await DelVscExtVersion({
                id: record.id,
            })

            if (res.code === 0) {
                refreshData()
                message.success('删除成功')
            }
        },
    })
}

async function delVscExt() {
    Modal.confirm({
        title: '提示',
        content: '确定要删除该插件及其所有版本吗？',
        async onOk() {
            const res = await DelVscExt({
                id: detailData.value.id,
            })

            if (res.code === 0) {
                router.replace('/list')
                message.success('删除成功')
            }
        },
    })
}
</script>

<style scoped lang="less">
.page {
    box-sizing: border-box;
    width: 100%;
    padding: 20px 40px 40px;

    .main {
        width: 80%;
        min-width: 800px;
        margin: 0 auto;
    }

    .content {
        margin-top: 30px;
        padding: 10px 30px;
        background-color: white;
        border-radius: 10px;

        .content-tab {
            padding: 20px 0;
        }
    }
}

.header {
    display: flex;
    align-items: flex-start;
    padding: 30px;
    background: white;

    > img {
        width: 120px;
        margin-right: 30px;
        border-radius: 10px;
    }

    .row {
        display: flex;
        align-items: center;
        line-height: 30px;
        column-gap: 20px;

        .item {
            display: flex;
            align-items: center;

            .anticon {
                margin-right: 6px;
            }

            & + .item {
                margin-left: 20px;
            }
        }

        .title {
            font-weight: bold;
        }

        .ant-tag {
            // margin-left: 10px;
        }

        .desc {
            display: -webkit-box; /* 使用 WebKit 内核的盒模型 */
            margin-top: 6px;
            overflow: hidden; /* 隐藏溢出的内容 */
            color: #aaa;
            font-size: 13px;
            line-height: 20px;
            white-space: normal; /* 允许文本换行 */
            text-overflow: ellipsis; /* 使用省略号表示被隐藏的文本 */
            -webkit-box-orient: vertical; /* 设置盒模型的方向为垂直 */
            -webkit-line-clamp: 2; /* 设置显示的行数 */
        }
    }

    .item__main {
        flex-grow: 1;
    }
}
</style>
