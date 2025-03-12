<template>
    <div class="page">
        <div class="main">
            <div class="header">
                <a-input-search
                    size="large"
                    v-model:value="searchValue"
                    placeholder="输入插件名称"
                    enter-button
                    style="width: 600px"
                    @search="getData"
                    allowClear
                />

                <div class="actions">
                    <a-button type="primary" @click="formVisible = true" v-if="!userStore.isGuest">新增插件</a-button>
                </div>
            </div>

            <div class="list">
                <div v-for="item in extensionList" class="list-item" @click="goDetail(item)">
                    <div class="cover">
                        <img :src="item.iconFileUrl" />
                        <a-button type="primary" @click.stop="onDownload(item)">立刻下载</a-button>
                    </div>

                    <div class="item__main">
                        <div class="row">
                            <div class="value title">{{ item.displayName }}</div>
                            <a-tag :color="statusColorMap[item.status]">{{ statusMap[item.status] }}</a-tag>
                            <!-- <a-button size="small" type="primary">立刻下载</a-button> -->
                        </div>

                        <div class="row">
                            <div class="item">
                                <UserOutlined />
                                <div class="value">{{ item.publisher }}</div>
                            </div>
                            <div class="item">
                                <VerticalAlignBottomOutlined />
                                <div class="value">{{ item.downloadTimes || 0 }}</div>
                            </div>
                        </div>

                        <div class="row">
                            <div class="value desc">{{ item.description }}</div>
                        </div>
                    </div>
                </div>
            </div>

            <a-empty v-if="extensionList.length === 0" />
        </div>
    </div>

    <ExtensionForm v-model:open="formVisible" :key="+formVisible" @finish="getData"></ExtensionForm>
</template>

<script lang="ts" setup>
import { useUserStore } from '@/store/user'
import { ref } from 'vue'
import ExtensionForm from '../../components/ExtensionForm.vue'
import { GetVscExtList } from '@/apis/vscExt'
import { useRouter } from 'vue-router'
import { UserOutlined, VerticalAlignBottomOutlined } from '@ant-design/icons-vue'
import { downloadVscExt } from '../../hooks'
import { previewFileUrl } from "@/apis/file" 

const userStore = useUserStore()
const statusMap = {
    1: '未上架',
    2: '已上架',
}

const statusColorMap = {
    1: '',
    2: 'green',
}

const searchValue = ref('')
const formVisible = ref(false)

getData()
const extensionList = ref<VscExtRecord[]>([])
async function getData() {
    const params: VscExtListParam = {}

    if (searchValue.value) {
        params.displayName = searchValue.value
    }

    const res = await GetVscExtList(params)

    if (res.result) {
        res.result.list.forEach(el => {
            el.iconFileUrl = `${previewFileUrl}?path=${el.iconFilePath}`
            el.vsixFileUrl = `${previewFileUrl}?path=${el.vsixFilePath}`
        })
        extensionList.value = res.result.list
    }
}

const router = useRouter()
function goDetail(item) {
    router.push({
        path: `/detail`,
        query: {
            id: item.id,
        },
    })
}

function onDownload(data) {
    downloadVscExt(
        {
            url: data.vsixFileUrl,
            id: data.id,
        },
        (value) => {
            data.downloadTimes = value
        }
    )
}
</script>

<style scoped lang="less">
.page {
    box-sizing: border-box;
    width: 100%;
    padding: 40px;

    .main {
        width: 80%;
        min-width: 800px;
        margin: 0 auto;

        .header {
            display: flex;
            justify-content: space-between;
            padding: 20px 40px;
            background-color: white;
            border-radius: 10px;
        }

        .list {
            display: flex;
            box-sizing: border-box;
            padding: 40px 0;
            column-gap: 50px;
            row-gap: 50px;

            &-item {
                // position: relative;
                display: flex;

                // flex-direction: column;
                // align-items: center;
                width: 400px;
                overflow: hidden;
                background-color: white;
                border-radius: 8px;
                cursor: pointer;
                transition: box-shadow 0.25s ease-in-out 0s;

                .cover {
                    position: relative;
                    width: 130px;

                    .ant-btn {
                        width: 100%;
                        border-radius: 0;
                    }

                    > img {
                        width: 100%;
                        height: 130px;
                        border-bottom: 1px solid #fff;
                    }
                }

                &:hover {
                    box-shadow: rgba(0, 0, 0, 0.1) 0 8px 15px;
                }

                .item__main {
                    padding: 10px;

                    .row {
                        display: flex;
                        align-items: center;
                        line-height: 30px;

                        .item {
                            display: flex;
                            align-items: center;

                            .anticon {
                                margin-right: 6px;
                            }

                            & + .item {
                                margin-left: 30px;
                            }
                        }

                        .title {
                            font-weight: bold;
                        }

                        .ant-tag {
                            margin-left: 10px;
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
                }
            }
        }
    }
}
</style>