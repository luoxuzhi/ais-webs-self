import { describe, expect, it, beforeEach, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import HelloWorld from './helloWorld.vue'
import { createPinia } from 'pinia'

const pinia = createPinia()

//我们用mount渲染组件，获取wrapper的变量，再通过find获取class属性为name的元素，断言文案是hello world!。
// Vue Test Utils提供两种渲染方式，mount和shallowMount。区别是mount会渲染子组件，shallowMount把子组件渲染为stub组件。
// 假如单元测试用例不涉及子组件功能测试的话，使用shallowMount更合理。
// mount和shallowMount的第二个参数提供可以传入propsData、slots等内容，可以挂载到组件实例上，详见挂载选项。
// 通常一个describe块只需要渲染一次组件，因此我们可以使用beforeEach钩子函数实现组件的共享。

/**
 *  let wrapper = mount(Parent); // 挂载组件
 *  wrapper.find('.name'); // 获取类名为name的元素
 *  wrapper.findAll('.namelist'); // 获取类名为namelist的元素集合
 *  wrapper.findComponent(Child); // 获取parent中的一个child子组件
 *  wrapper.findComponentAll(Child); // 获取parent中的一个child子组件集合
 *
 *  wrapper.vm; // 获取根组件实例
 *  wrapper.findComponent(Child).vm; // 获取子组件实例
 *  wrapper.findComponent(Child).vm.$emit('change'); // 触发子组件事件
 *  wrapper.findComponent(Child).vm.getList(); // 触发子组件的getList事件
 *
 **/

describe('测试示例', async () => {
    let wrapper: any = null
    const name = '张三'
    const newName = '李四'

    beforeEach(() => {
        wrapper = mount(HelloWorld, {
            propsData: {
                name,
            },
            slots: {
                default: '<div class="slot-default">我是内容</div>', // 插槽内容
                header: '<div class="header">Header</div>',
                main: '<div class="body">Main Content</div>',
                footer: '<div class="footer">Footer</div>',
            },
            global: {
                plugins: [pinia], // 安装pinia
            },
        }) // 挂载组件
    })
    it('hellow world', () => {
        //expect(wrapper.html()).toMatchSnapshot() // 快照测试
        expect(wrapper.find('.content').text()).toBe('hello world!')
    })

    it('hellow world isVisible', () => {
        wrapper.find('.content').isVisible()
    })

    it('测试修改props', async () => {
        expect(wrapper.find('.name').text()).toBe(name)
        await wrapper.setProps({ name: newName }) // 中途修改props的值
        expect(wrapper.find('.name').text()).toBe(newName)
    })

    it('测试点击事件', async () => {
        await wrapper.find('.add').trigger('click') // 触发click事件
        expect(wrapper.find('.count').text()).toBe('1')
    })

    it('change事件触发测试', () => {
        wrapper.find('.btn').trigger('click')
        expect(wrapper.emitted().change).toMatchObject([[true]]) // 获取change事件
    })

    it('普通插槽', () => {
        expect(wrapper.find('.slot-default').text()).toBe('我是内容')
    })

    it('具名插槽', () => {
        expect(wrapper.find('.body').text()).toBe('Main Content')
        expect(wrapper.find('.header').text()).toBe('Header')
        expect(wrapper.find('.footer').text()).toBe('Footer')
    })

    it('表单测试', async () => {
        wrapper.find('.account').setValue('123') // 填写账号
        wrapper.find('.password').setValue('1234') // 填写密码
        wrapper.find('.login').trigger('click') // 点击登录
        expect(wrapper.emitted('loginSuccess')[0]).toEqual([])
    })

    it('测试倒计时', async () => {
        vi.useFakeTimers() // 启用模拟计时器

        await wrapper.find('.counter').trigger('click') // 开启倒计时
        await flushPromises()
        expect(wrapper.find('.seconds').text()).toBe('5s')

        await vi.advanceTimersByTime(3000) // 倒计时快进3s
        await flushPromises()
        expect(wrapper.find('.seconds').text()).toBe('2s')

        vi.runAllTimers() // 调用每个被创建的计时器，直到计时器队列为空
        await flushPromises()
        expect(wrapper.find('.seconds').text()).toBe('0s')

        vi.useRealTimers() // 关闭模拟计时器
    })

    it('vue中的pinia测试', async () => {
        expect(wrapper.find('.namegg').text()).toBe('姓名: 张三')
        expect(wrapper.find('.age').text()).toBe('年龄: 14')
        expect(wrapper.find('.doubleAge').text()).toBe('两倍年龄: 28')

        wrapper.find('.change').trigger('click') // 改变store
        await flushPromises()
        expect(wrapper.find('.namegg').text()).toBe('姓名: 李四')
        expect(wrapper.find('.age').text()).toBe('年龄: 15')
        expect(wrapper.find('.doubleAge').text()).toBe('两倍年龄: 30')
    })
})
