<template>
    <!-- 退出登录 -->
    <a-popover trigger="hover">
        <template #content>
            <div class="user-btn" :class="{ collapsed: collapsed }" @click="handleLogout">
                <img src="@/assets/svg/finloop/logout.svg" class="icon" />
                {{ useStore.isGuest ? '去登录' : '退出登录' }}
            </div>
        </template>

        <!-- 用户信息 -->
        <div class="user-info" :class="{ collapsed: collapsed }">
            <div class="avatar">
                <img src="@/assets/img/home/avatar@3x.png" />
            </div>
            <div class="name">{{ useStore.userInfo.nickname }}</div>
        </div>
    </a-popover>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useLayoutStore } from '@/store/layout'
import { useUserStore } from '@/store/user'
import { logout } from '@/utils/service'
import { useRouter } from 'vue-router'

// 菜单收起与展开状态
const LayoutStore = useLayoutStore()
const collapsed = computed(() => LayoutStore.collapsed)

// 用户名
const useStore = useUserStore()
const router = useRouter()

// 退出登录
const handleLogout = async () => {
    try {
        // 只传递一个参数，表示是否需要重定向
        await logout(true)
    } catch (error: any) {
        console.log('error=>', error)
    }
}
</script>

<style lang="less" scoped>
.user-btn {
    display: flex;
    align-items: center;
    padding: 0 14px;
    color: #fff;
    font-size: 14px;
    line-height: 22px;
    cursor: pointer;

    .icon {
        width: 16px;
        height: 16px;
        margin-right: 8px;
    }

    &.collapsed {
        padding: 0 8px;

        .icon {
            display: none;
        }
    }
}

.user-info {
    display: flex;
    align-items: center;
    margin-bottom: 24px;
    padding: 6px;
    background: rgba(182, 222, 255, 0.12);
    border-radius: 8px;
    cursor: pointer;

    &.collapsed {
        background: transparent;

        .name {
            display: none;
        }
    }

    &:hover {
        background: rgba(182, 222, 255, 0.12);
    }

    .avatar {
        display: flex;
        align-items: center;
        width: 36px;
        height: 36px;
        border-radius: 50%;

        img {
            width: 100%;
        }
    }

    .name {
        margin-left: 12px;
        color: @bgWhiteColor;
        font-weight: 500;
        font-size: 16px;
    }
}
</style>