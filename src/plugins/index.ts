/**
 * 插件
 * */

// 限制输入框输入小数位数
import limitInput from '@/plugins/limitInput'

// plugins/i18n.js
export default {
    install: (app, options) => {
        // 输入框小数位指令
        app.directive('limitInput', limitInput())
    },
}
