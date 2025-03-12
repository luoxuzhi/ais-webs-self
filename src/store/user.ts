// # https://pinia.vuejs.org/core-concepts/

import { User } from '@/types/user'
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
    state: () => {
        return {
            userInfo: {} as User,
            token: '',
            isGuest: false,
        }
    },

    actions: {
        updateUserInfo(userInfo, token) {
            this.userInfo = userInfo
            this.token = token
            this.isGuest = false
        },
        
        setGuestMode() {
            // 设置访客模式状态
            this.isGuest = true
            // 访客模式不需要token
            this.token = ''
            // 设置基本用户信息
            this.userInfo = {
                username: 'guest',
                nickname: '访客',
                role: 'guest',
                loginTime: new Date().toISOString(),
                createTime: new Date().toISOString()
            }
        }
    },
    persist: true,
})