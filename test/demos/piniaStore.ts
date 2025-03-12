import { defineStore } from 'pinia'

export const useUserInfo = defineStore('userinfo', {
    state() {
        return {
            namegg: '张三',
            age: 14,
        }
    },
    getters: {
        doubleAge: state => state.age * 2,
    },
    actions: {
        changeUserInfo(name, age) {
            this.namegg = name
            this.age = age
        },
    },
})
