/// <reference types="vitest" />
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import Components from 'unplugin-vue-components/vite'
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers'
import autoprefixer from 'autoprefixer'
import path from 'path'
import VueSetupExtend from 'vite-plugin-vue-setup-extend'
// 增加开始时ts校验
import checker from 'vite-plugin-checker'
import rollupOptions from './rollup.config'

function getProxy(mode: string): any {
    let proxy = {}
    try {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        proxy = require(`./proxy/${mode}.js`).default
    } catch (error) {
        console.log(`Feng.chen:: 16:59:39 error ===>1 `, error)
    }
    return proxy
}

// https://vitejs.dev/config/
export default defineConfig((options: any = {}) => {
    const { mode } = options
    // TODO: mode此时为项目名
    console.log(`Feng.chen:: 09:55:48 mode ===> 1`, mode, options)

    const proxy = getProxy(mode)

    const config = {
        base: '/ais',
        resolve: {
            alias: {
                '@': resolve(__dirname, 'src'),
                '~@': resolve(__dirname, 'src/assets'),
            },
        },
        plugins: [
            vue(),
            VueSetupExtend(),
            Components({
                resolvers: [
                    AntDesignVueResolver({
                        importStyle: false, // 4.x不需要引入样式了
                    }),
                ],
                dts: false,
            }),
            // checker({
            //     vueTsc: true,
            // }),
        ],
        css: {
            postcss: {
                plugins: [
                    autoprefixer({
                        // 配置使用 autoprefixer
                        overrideBrowserslist: ['last 15 versions'],
                    }),
                ],
            },

            preprocessorOptions: {
                less: {
                    javascriptEnabled: true,
                    additionalData: `@import "${path.resolve(__dirname, 'src/assets/css/variable.less')}";`,
                },
            },
        },
        build: {
            target: ['es2015'],
            outDir: 'dist',
            assetsDir: 'assets',
            rollupOptions: rollupOptions,
            terserOptions: {
                compress: {
                    drop_console: false,
                    drop_debugger: true,
                },
            },
            // 生产环境去除console输出，及调试
            // minify: 'terser' as const,
            // terserOptions: {
            //     compress: {
            //         drop_console: false,
            //         drop_debugger: true,
            //     },
            // },
        },
        server: {
            proxy,
            open: '/',
            host: '0.0.0.0',
            port: 5800,
            allowedHosts:['5800-5af768f8d191-web.clackypaas.com']
        },
        test: {
            // 启用类似 jest 的全局测试 API
            globals: true,
            // 使用 happy-dom 模拟 DOM
            // 这需要你安装 happy-dom 作为对等依赖（peer dependency）
            environment: 'happy-dom',
            coverage: {
                // 覆盖率提供者
                reporter: ['text', 'json', 'html'],
                // 设置覆盖文件夹
                reportsDirectory: './testCoverage',
                //覆盖范围阈值选项  暂时不加阈值 不然达不到会报错
                // thresholds: {
                //     perFile: true, // 检查每个文件的阈值
                //     lines: 75, //lines 的全局阈值
                //     functions: 75, //functions 的全局阈值
                //     branches: 75, //branches 的全局阈值
                //     statements: 75, //statements 的全局阈值
                // },
            },
            reporters: ['default', 'html'], //导出覆盖率 or 测试报告
            outputFile: './testCoverage/index.html', //导出覆盖率文件的路径
        },
    }

    // setBase(config, project)

    return config
})
