<template>
    <div>
        <h1 class="content">{{ content }}</h1>
        <h1 class="name">{{ name }}</h1>
        <button class="add" @click="add">点我</button>
        <p class="count">{{ count }}</p>

        <button class="btn" @click="clickMe">点我</button>
        <div>
            <slot></slot>
            <header>
                <slot name="header" />
            </header>
            <main>
                <slot name="main" />
            </main>
            <footer>
                <slot name="footer" />
            </footer>
        </div>

        <section>
            <input class="account" v-model="account" type="text" placeholder="请输入账号" />
        </section>

        <section>
            <input class="password" v-model="password" type="password" placeholder="请输入密码" />
        </section>

        <section>
            <button class="login" @click="login">登录</button>
        </section>

        <button class="counter" @click="start">开启倒计时</button>
        <p class="seconds">{{ seconds }}s</p>

        <p class="namegg">姓名: {{ namegg }}</p>
        <p class="age">年龄: {{ age }}</p>
        <p class="doubleAge">两倍年龄: {{ doubleAge }}</p>
        <button class="change" @click="change">改变信息</button>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useUserInfo } from './piniaStore'
import { storeToRefs } from 'pinia'

//test pinia
const store = useUserInfo()
const { namegg, age, doubleAge } = storeToRefs(store)

function change() {
    store.changeUserInfo('李四', 15)
}

//test vm
const content = ref('hello world!')

//test props 传值
const props = defineProps(['name'])

//test 点击事件 和 emit
const count = ref(0)

const emit = defineEmits(['change', 'loginSuccess', 'loginFail'])

function add() {
    count.value++
}

function clickMe() {
    emit('change', true)
}

//test 表单
const account = ref('')
const password = ref('')

function login() {
    if (account.value === '123' && password.value === '1234') {
        emit('loginSuccess')
    } else {
        emit('loginFail')
    }
}

//test 倒计时
const seconds = ref(0) // 倒计时的秒数
const timer = ref(0)
// 开启倒计时
function start() {
    if (seconds.value !== 0) return
    clearInterval(timer.value)
    countDownCallback()
    timer.value = setInterval(countDownCallback, 1000)
}

function countDownCallback() {
    if (seconds.value === 0) {
        seconds.value = 5
    } else if (seconds.value - 1 <= 0) {
        seconds.value = 0
        clearInterval(timer.value)
    } else {
        seconds.value--
    }
}
</script>

<style scoped></style>
