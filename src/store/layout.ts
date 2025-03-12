import { defineStore } from 'pinia'
import { getSystem } from '@/utils/tools'
import { RouteLocationNormalized } from 'vue-router'

type Navtab = RouteLocationNormalized & {
    active?: Boolean
}

export const useLayoutStore = defineStore('layout', {
    // id: 'layout',
    state: () => {
        return {
            collapsed: false, // 菜单收起与展开状态
            navTabs: [] as Navtab[],
            tabsMap: {
                'finloop-tenantManagement': [],
            } as any,
            maxLen: 8, // 每个系统最多同时存在的tab数量
            appContentRef: null as any, // 布局的appContent实例
            hasInquiryNotify: false, // 是否有询价通知
        }
    },
    actions: {
        // 更新菜单收起与展开状态
        updateCollapsed(collapsed: boolean) {
            this.collapsed = collapsed
        },
        updateInquiryNotify(InquiryNotify: boolean) {
            this.hasInquiryNotify = InquiryNotify
        },
        // 新打开tab
        addTab(navTab: Navtab) {
            console.log('🚀 ~ addTab ~ navTab:', navTab)
            const systemName = getSystem()
            // 如果不是菜单上的页面，则不添加
            if (!navTab.meta || navTab.meta.hidden || !navTab.name) return
            const tabArr = this.tabsMap[systemName]
            if (this.tabsMap[systemName]) {
                const index = tabArr.findIndex((item: Navtab) => item.path === navTab.path)
                if (index === -1) {
                    // 如果打开tab的数量大于最大值，则移除第一个tab
                    if (this.maxLen === tabArr.length) {
                        tabArr.shift()
                    }
                    tabArr.push(navTab)
                }
            } else {
                this.tabsMap[systemName] = []
                this.tabsMap[systemName].push(navTab)
            }
        },
        // 关闭tab
        removeTab(navTab: Navtab, router: any) {
            const systemName = getSystem()
            const tabArr = this.tabsMap[systemName]
            const index = tabArr.findIndex((item: Navtab) => item.path === navTab.path)
            if (index !== -1) {
                tabArr.splice(index, 1)
                // 如果关闭的是当前展示的tab，则跳转到右侧第一个tab，如果已经是最右侧，则打开最新tab
                if (tabArr.length && navTab.active) {
                    let route = tabArr[tabArr.length - 1]
                    if (tabArr[index]) {
                        route = tabArr[index]
                    }
                    router.push(route.fullPath || route.path)
                }
            }
        },
        // 设置当前展示的tab
        setActiveTab(navTab: Navtab) {
            const systemName = getSystem()
            if (this.tabsMap[systemName]) {
                this.tabsMap[systemName].forEach((item: Navtab) => {
                    item.active = item.path === navTab.path
                })
            } else {
                this.tabsMap[systemName] = []
            }
        },
        // 清空当前系统打开的tab
        clearTabs() {
            const systemName = getSystem()
            this.tabsMap[systemName] = []
        },
    } as const,
    // 开启持久化
    persist: {
        key: 'layout',
        storage: sessionStorage,
    },
})

// 用于存活的组件
interface AlivePage {
    scrollTop: number
}
export const useKeepAliveStore = defineStore('keepAlive', {
    state: (): {
        alivePages: Record<string, AlivePage>
    } => {
        return {
            alivePages: {} as Record<string, AlivePage>,
        }
    },
    actions: {
        /**
         * 新增alivePage
         * @param name 路由/组件名称
         * @param scrollTop appContent高度
         */
        setItem(name: string, alivePage: AlivePage) {
            this.alivePages[name] = alivePage
        },

        /**
         * 移除alivePage
         * @param name 路由/组件名称
         */
        removeItem(name: string) {
            delete this.alivePages[name]
        },

        /**
         * 删除所有alivePage
         */
        removeAll() {
            this.alivePages = {}
        },
    },
})
