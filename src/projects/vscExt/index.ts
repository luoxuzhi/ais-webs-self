import { createApp } from 'vue'
import App from './App.vue'
import { createPinia } from 'pinia'
import router from './router/index'
import '@/assets/css/common.less'
// import installAntdComponents from './config/antdComponents'
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/reset.css'
// import installAntdComponents from './config/antdComponents'
import { getEnvConfig } from '@/config/env'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
const app = createApp(App)

app.config.globalProperties.$env = getEnvConfig()

// 初始化pinia，状态管理器
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
app.use(pinia)
// 初始化vue-router，路由
app.use(router)

//全局注册antd控件
app.use(Antd)

// 挂载app
app.mount('#app')


document.title="VsCode 插件管理"