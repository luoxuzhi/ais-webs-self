<template>
    <div class="layout-container">
        <div class="layout-header">
            <a class="logo" href="/ais/portal.html#/aggregation">
                <img class="logo" :src="logo" />
                <img class="logoTitle" :src="logoTitle" />
            </a>
            <a-dropdown>
                <!-- 用户信息 -->
                <div class="user-info">
                    <div class="username">{{ userStore.userInfo.nickname }}</div>
                    <img :src="Avatar" alt="" />
                </div>
                <template #overlay>
                    <a-menu>
                        <a-menu-item>
                            <a href="javascript:;" @click="handleLogout">
                                {{ userStore.isGuest ? '去登录' : '退出登录' }}
                            </a>
                        </a-menu-item>
                    </a-menu>
                </template>
            </a-dropdown>
        </div>
        <div class="layout-content">
            <router-view></router-view>
        </div>
    </div>
</template>
<script setup lang="ts">
// source
import { Ref, reactive, ref, watch } from 'vue'
import logo from '/src/assets/svg/finloop/logo.svg'
import logoTitle from '/src/assets/svg/finloop/title.svg'
import BillIcon from '../assets/images/svg/bill.svg'
import TenantPermissions from '../assets/images/svg/tenantPermissions.svg'
import PrivatePlacement from '../assets/images/svg/privatePlacement.svg'
// import Avatar from '@/assets/images/svg/avatar.svg'
import BondIcon from '../assets/images/svg/bond.svg'
import BeSvg from '../assets/images/svg/be.svg'
import Avatar from '@/assets/svg/portal/avatar.svg'
import { getEnvConfig } from '@/config/env'
const { BeDomain } = getEnvConfig()
console.log('🚀 ~ BeDomain:', BeDomain)
// tools
import { logout } from '@/utils/service'

// store
import { useUserStore } from '@/store/user'
// import { checkLoginExpire } from '../apis'
// console.log(aa)
const userStore = useUserStore()
interface applicationType {
    name: string
    descriptions: string[]
    icon: any
    url: string
    fullUrl?: string
}

const handleLogout = async () => {
    try {
        // 只传递一个参数，表示是否需要重定向
        await logout(true)
    } catch (error) {
        console.error("handleLogout error", error)
    }
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
            cursor: pointer;

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
        overflow: auto;
        background-color: rgb(246, 247, 250);
        background-image: url('../assets/images/svg/loginbg.svg');
        background-position: center;
        background-size: 100%;

        // & > div {
        //     margin: 0 auto;
        // }

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