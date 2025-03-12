<template>
    <div class="layout-container">
        <div class="layout-header">
            <div class="logo">
                <img class="logo" :src="logo" />
                <img class="logoTitle" :src="logoTitle" />
            </div>
            <a-dropdown>
                <!-- 用户信息 -->
                <div class="user-info">
                    <div class="username">{{ userStore.userInfo.nickname }}</div>
                    <img :src="Avatar" alt="" />
                </div>
                <template #overlay>
                    <a-menu>
                        <a-menu-item>
                            <a href="javascript:;" @click="handleLogoutOrLogin">
                                {{ userStore.isGuest ? '去登录' : '退出登录' }}
                            </a>
                        </a-menu-item>
                    </a-menu>
                </template>
            </a-dropdown>
        </div>
        <div class="layout-content">
            <div>
                <!-- 新增访客提示 -->
                <div v-if="userStore.isGuest" class="visitor-notice">
                    您当前处于访客模式，部分功能受限。
                </div>
                <div class="application-list-con">
                    <p class="title">聚合页</p>
                    <ul class="application-list">
                        <li v-for="item in allowedApps" :key="item.name" class="application-item" @click="handleClick(item)">
                            <img :src="item.icon" alt="" />
                            <div class="application-name">
                                <p>{{ item.name }}</p>
                                <div class="description-container">
                                    <div v-for="des in item.descriptions" :key="des" class="description">
                                        <span>{{ des }}</span>
                                    </div>
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
// source
import { Ref, reactive, ref, computed } from 'vue'
import logo from '/src/assets/svg/finloop/logo.svg'
import logoTitle from '/src/assets/svg/finloop/title.svg'
import Avatar from '@/assets/svg/portal/avatar.svg'
import BeSvg from '@/assets/svg/portal/be.svg'
import VSCodeSvg from '@/assets/svg/portal/vscode.svg'

import { getEnvConfig } from '@/config/env'
const { BeDomain } = getEnvConfig()
console.log('🚀 ~ BeDomain:', BeDomain)
// tools
import { clearInfoToLogin, logout } from '@/utils/service'

// store
import { useUserStore } from '@/store/user'
// import { checkLoginExpire } from '../apis'
// console.log(aa)
const userStore = useUserStore()

// 应用访问过滤功能
const allowedApps = computed(() =>
    applicationConfig.value.filter(app =>
        app.name !== '系统管理' || !userStore.isGuest
    )
)

interface applicationType {
    name: string
    descriptions: string[]
    icon: any
    url: string
    fullUrl?: string
}

// 各子系统模块配置
const applicationConfig: Ref<applicationType[]> = ref([
    {
        icon: VSCodeSvg,
        name: 'VScode插件',
        descriptions: ['查看', '下载', '发布'],
        url: 'ais/vscExt.html',
    },
    {
        icon: BeSvg,
        name: '系统管理',
        descriptions: ['用户管理'],
        url: 'ais/system.html',
    },
])
// 跳转对应的子系统
const handleClick = async (item: applicationType) => {
    if (item.fullUrl) {
        window.open(item.fullUrl)
    } else {
        window.open(`${location.origin}/${item.url}`)
    }
}

const handleLogoutOrLogin = () => {
    // 统一通过logout处理，不需要传递isGuest参数
    logout(true)
}
</script>
<style scoped lang="less">
* {
    margin: 0;
    padding: 0;
}

.exit {
    color: #fff;
    cursor: pointer;
}

.layout-container {
    display: flex;
    flex-direction: column;
    height: 100%;

    .layout-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        box-sizing: border-box;
        height: 60px;
        padding: 8px 115px;
        background: white;

        .logo {
            display: flex;
            align-items: center;

            img {
                margin-right: 12px;
            }
        }

        .user-info {
            display: flex;
            align-items: center;
            cursor: pointer;

            .username {
                margin-right: 12px;
            }
        }
    }

    .layout-content {
        display: flex;
        flex: 1;
        min-width: fit-content;
        height: 100%;
        overflow: hidden;
        background-image: url('@/assets/svg/portal/loginbg.svg');
        background-position: center;
        background-size: 100%;

        & > div {
            margin: 0 auto;
        }

        .title {
            padding: 48px 10px 12px;
            color: #1f1f1f;
            font-weight: 600;
            font-size: 20px;
            line-height: 28px;
            text-align: left;
        }

        .application-list-con {
            display: flex;
            flex: 1;
            flex-direction: column;
            height: 100%;
            padding: 0 115px;
            overflow: hidden;
        }

        .application-list {
            display: flex;
            flex-wrap: wrap;
            overflow-y: auto;

            .application-item {
                position: relative;
                display: flex;
                width: 332px;
                height: 147px;
                margin: 0 10px 24px;
                padding: 20px 0 24px 24px;
                background: #fff;
                border-radius: 6px;
                cursor: pointer;

                &:hover {
                    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
                }

                img {
                    width: 64px;
                    height: 64px;
                    margin-right: 16px;
                }

                .application-name {
                    display: flex;
                    flex-direction: column;
                    text-align: left;

                    p {
                        width: 100%;
                        height: auto;
                        overflow: hidden;
                        color: #1e2c3a;
                        font-weight: 500;
                        font-size: 18px;
                        line-height: 25px;
                        white-space: nowrap;
                        text-overflow: ellipsis;
                    }

                    .description-container {
                        display: flex;
                        flex-wrap: wrap;

                        .description {
                            position: relative;
                            margin-top: 12px;
                            padding-right: 16px;
                            overflow: hidden;
                            color: #8d99a6;
                            font-weight: 400;
                            font-size: 14px;
                            line-height: 14px;
                            white-space: nowrap;
                            text-overflow: ellipsis;
                            // &::after {
                            //     display: block;
                            //     content: '';
                            //     display: block;
                            //     width: 1px;
                            //     height: 10px;
                            //     border-left: 1px solid #dce4ec;
                            //     position: absolute;
                            //     right: 8px;
                            //     top: 2px;
                            // }
                        }
                    }
                }
            }
        }
    }
}

.visitor-notice {
    padding: 12px 16px;
    margin-bottom: 24px;
    background-color: #f5f7fa;
    border: 1px solid #b6d4f6;
    color: #2a6ed9;
}

@media (min-width: 1965px) {
    .application-list {
        width: 1760px;
    }
}

@media (min-width: 1613px) and (max-width: 1964px) {
    .application-list {
        width: 1408px;
    }
}

@media (min-width: 1260px) and (max-width: 1612px) {
    .application-list {
        width: 1056px;
    }
}

@media (min-width: 930px) and (max-width: 1259px) {
    .application-list {
        width: 704px;
    }
}

@media (max-width: 929px) {
    .application-list {
        width: 380px;
    }
}
</style>