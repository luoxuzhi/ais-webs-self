import zhCn from 'ant-design-vue/es/locale/zh_CN'
import zhTc from 'ant-design-vue/es/locale/zh_HK'
import enUS from 'ant-design-vue/es/locale/en_US'

// 定制化主题
export const THEME = {
    token: {
        colorPrimary: '#1B83F8', // 主题色
        colorError: '#F31414', // 错误色
        borderRadius: 4, // 基础组件的圆角大小
        screenXXL: 1800,
        screenXXLMin: 1800,
        screenXL: 1600,
        screenXLMin: 1600,
        screenLG: 1200,
        screenLGMin: 1200,
    },

    components: {
        Button: {
            colorPrimary: '#1B83F8',
            colorPrimaryHover: '#1B83F8',
            colorPrimaryActive: '#1B83F8',
            borderRadius: 4,
        },
    },
}

export const ANTD_CONFIG = {
    theme: THEME,

    // 国际化
    locale: {
        zhCn,
        zhTc,
        enUS,
    },

    // 设置水波纹特效
    wave: {
        disabled: true,
    },
}
