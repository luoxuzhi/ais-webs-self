/**
 * 此demo测试，是对vitest中常用方法的简单测试，用作参考
 */

import {
    expect,
    vi,
    describe,
    it,
    assert,
    afterEach,
    beforeEach,
    test,
    expectTypeOf,
    onTestFinished,
    onTestFailed,
    beforeAll,
    afterAll,
} from 'vitest'
import { increment } from './example'

/**
 * test & bench & describe & beforeEach & afterEach & beforeAll & afterAll
 * https://cn.vitest.dev/api/
 */

//test 定义了一组相关的期望。 它接收测试名称和保存测试期望的函数。 别名: it

test('should work as expected', () => {
    expect(Math.sqrt(4)).toBe(2)
})

//通过.extend扩展测试上下文, 添加扩展
interface MyFixtures {
    todos: number[]
    archive: number[]
}

const myTest = test.extend<MyFixtures>({
    todos: [],
    archive: [],
})

myTest('test extend', ({ todos, archive }) => {
    expectTypeOf(todos).toEqualTypeOf<number[]>()
    expectTypeOf(archive).toEqualTypeOf<number[]>()

    expect(todos.length).toBe(0)
    todos.push(3)
    todos.push(4)
    expect(todos.length).toBe(2)
})

//skip 如果想跳过运行某些测试，但又不想删代码，可以使用 skip 来跳过这些测试。
//skipIf 在某些情况下，可能会需要在不同的环境下多次运行测试，而且某些测试可能是特定于环境的。我们这时候可以通过使用 skipIf 来跳过测试
//runIf 与 skipIf 相反，只有在条件为真时才运行测试。
//only 有时候我们只想运行一个测试，可以使用 only 来运行这个测试。
//todo 有时候我们想标记一些测试为待办，可以使用 todo 来标记这些测试。
//concurrent 有时候我们想并发运行测试，可以使用 concurrent 来并发运行测试。skip、only、todo可以和 concurrent 一起使用。
//sequential 有时候我们想串行运行测试，可以使用 sequential 来串行运行测试
//fails 明确表示断言将失败
//each 当需要使用不同变量运行同一测试时，请使用 test.each。 我们可以按照测试功能参数的顺序
//describe.shuffle 提供了一种以随机顺序运行所有测试的方法
//skip、only、todo 等在test、bench、describe中的语法类似

//skip
test.skip('skipped test', () => {
    // Test skipped, no error
    assert.equal(Math.sqrt(4), 3)
})

const isProd = process.env.NODE_ENV === 'production'

// //skipIf
test.skipIf(isProd)('prod only test', () => {
    assert.equal(Math.sqrt(4), 2)
})

// //runIf
test.runIf(!isProd)('dev only test', () => {
    assert.equal(Math.sqrt(4), 2)
})

//only 暂时注释，测试发现only会导致其他测试不执行, 置灰执行only里面的逻辑
// test.only('test', () => {
//     // Only this test (and others marked with only) are run
//     assert.equal(Math.sqrt(4), 2)
// })

//todo
test.todo('unimplemented test')

// concurrent
describe('concurrent suite', () => {
    let value = 0
    test('serial test', async () => {
        value += 1
        expect(value).toBe(1)
    })
    test.concurrent('concurrent test 1', async () => {
        value += 1
        expect(value).toBe(2)
    })
    test.concurrent('concurrent test 2', async () => {
        value += 1
        expect(value).toBe(3)
    })
    test.skip.concurrent('concurrent test 2', async () => {
        value += 1
        expect(value).toBe(4)
    })
})

//sequential
describe.concurrent('sequential suite', () => {
    let sequential = 0
    test('concurrent test 1', async () => {
        sequential += 1
        expect(sequential).toBe(1)
    })
    test('concurrent test 2', async () => {
        sequential += 1
        expect(sequential).toBe(2)
    })

    test.sequential('sequential test 1', async () => {
        sequential += 1
        expect(sequential).toBe(3)
    })
    test.sequential('sequential test 2', async () => {
        sequential += 1
        expect(sequential).toBe(4)
    })
})

//fails
function myAsyncFunc() {
    return new Promise(resolve => resolve(1))
}
test.fails('fail test', async () => {
    await expect(myAsyncFunc()).rejects.toBe(1)
})

//each
test.each([
    [1, 1, 2],
    [1, 2, 3],
    [2, 1, 3],
])('add(%i, %i) -> %i', (a, b, expected) => {
    expect(a + b).toBe(expected)
})

//bench 定义了一个基准。在 Vitest 术语中，基准是定义一系列操作的函数。 Vitest 会多次运行该函数，以显示不同的性能结果
//需要再runner的benchmark mode下运行
// bench(
//     'normal sorting',
//     () => {
//         const x = [1, 5, 4, 2, 3]
//         x.sort((a, b) => {
//             return a - b
//         })
//     },
//     { time: 1000 }
// )

// 当在文件的顶层使用 test 或 bench 时，它们会作为隐式套件的一部分被收集起来。
// 使用 describe 可以在当前上下文中定义一个新的测试套件，作为一组相关测试或基准以及其他嵌套测试套件。
// 测试套件可让组织测试和基准，使报告更加清晰。

//describe
const person = {
    isActive: true,
    age: 32,
}

describe('person', () => {
    test('person is defined', () => {
        expect(person).toBeDefined()
    })

    test('is active', () => {
        expect(person.isActive).toBeTruthy()
    })

    test('age limit', () => {
        expect(person.age).toBeLessThanOrEqual(32)
    })
})

//describe.shuffle
describe.shuffle('shuffle suite', () => {
    test('random test 1', async () => {
        /* ... */
    })
    test('random test 2', async () => {
        /* ... */
    })
    test('random test 3', async () => {
        /* ... */
    })
})

describe.each([
    { a: 1, b: 1, expected: 2 },
    { a: 1, b: 2, expected: 3 },
    { a: 2, b: 1, expected: 3 },
])('describe object add($a, $b)', ({ a, b, expected }) => {
    test(`returns ${expected}`, () => {
        expect(a + b).toBe(expected)
    })

    test(`returned value not be greater than ${expected}`, () => {
        expect(a + b).not.toBeGreaterThan(expected)
    })

    test(`returned value not be less than ${expected}`, () => {
        expect(a + b).not.toBeLessThan(expected)
    })
})

//beforeEach 注册一个回调函数，在当前上下文中的每个测试运行前调用。 如果函数返回一个 Promise ，Vitest 会等待承诺解析后再运行测试。
//afterEach 注册一个回调函数，在当前上下文中的每个测试完成后调用。 如果函数返回一个承诺，Vitest 会等待承诺解析后再继续
//beforeAll 注册一个回调函数，在开始运行当前上下文中的所有测试之前调用一次。 如果函数返回一个 Promise ，Vitest 会等待承诺解析后再运行测试。
//afterAll 注册一个回调函数，以便在当前上下文中所有测试运行完毕后调用一次。 如果函数返回一个 Promise ，Vitest 会等待承诺解析后再继续。
//onTestFinished 这个 hook 总是在测试运行结束后调用。它在 afterEach 之后被调用，因为它们会影响测试结果。它接收一个包含当前测试结果的 TaskResult 。
//onTestFailed 只有在测试失败后才会调用这个 hook 。它在 afterEach 之后被调用，因为它们会影响测试结果。它将接收一个包含当前测试结果的 TaskResult 。这个 hook 对调试非常有用

const mockDB = {
    isActive: true,
    age: 32,
    close: vi.fn(),
    query: vi.fn(),
}

function connectDB() {
    return mockDB
}

describe('database', () => {
    let value = 0

    beforeAll(() => {
        value += 1
        expect(value).toBe(1)
    })

    beforeEach(() => {
        value += 1
        expect(value).toBe(2)
    })

    afterEach(() => {
        value += 1
        expect(value).toBe(3)
    })

    afterAll(() => {
        value += 1
        expect(value).toBe(4)
    })

    test('performs a query', () => {
        const db: any = connectDB()
        onTestFailed((e: any) => {
            console.log(e.result.errors)
        })
        onTestFinished(() => db.close())
        db.query('SELECT * FROM users')
    })
})

//对象模拟(Mocking) https://cn.vitest.dev/api/mock.html
//我们可以使用 vi.fn 方法创建一个 mock 函数来跟踪其执行情况。
//如果要跟踪已创建对象上的方法，可以使用 vi.spyOn 方法

describe('mocking function', () => {
    it('fn', async () => {
        const fn = vi.fn()
        fn('hello', 1)
        expect(vi.isMockFunction(fn)).toBe(true)
        expect(fn.mock.calls[0]).toEqual(['hello', 1])
        fn.mockImplementation(arg => arg)
        fn('world', 2)
        expect(fn.mock.results[1].value).toBe('world')
    })

    it('spyOn', async () => {
        const market = {
            getApples: () => 100,
        }

        const getApplesSpy = vi.spyOn(market, 'getApples')
        market.getApples()
        expect(getApplesSpy.mock.calls.length).toBe(1)
    })

    //接受一个函数，该函数将用作 mock 的实现。
    it('mockImplementation', async () => {
        const mockFn = vi.fn().mockImplementation(apples => apples + 1)
        // or: vi.fn(apples => apples + 1);

        const BobsBucket = mockFn(1)
        expect(BobsBucket).toBe(2)

        expect(mockFn.mock.calls[0][0]).toBe(1)
    })

    //接受一个函数，该函数将在下一次调用时用作 mock 的实现。可以链式调用多个函数，从而产生不同的结果
    it('mockImplementationOnce', async () => {
        const myMockFn = vi
            .fn(() => 'default')
            .mockImplementationOnce(() => 'first call')
            .mockImplementationOnce(() => 'second call')

        expect(myMockFn()).toBe('first call')
        expect(myMockFn()).toBe('second call')
        expect(myMockFn()).toBe('default')
        expect(myMockFn()).toBe('default')
    })

    //在执行回调时，临时覆盖原始模拟实现。
    it('withImplementation', async () => {
        const myMockFn = vi.fn(() => 'original')

        myMockFn.withImplementation(
            () => 'temp',
            () => {
                expect(myMockFn()).toBe('temp')
            }
        )

        expect(myMockFn()).toBe('original')
    })

    //接受在调用 async 函数时将被拒绝的错误。
    it('mockRejectedValue', async () => {
        const asyncMock = vi.fn().mockRejectedValue(new Error('Async error'))
        expect(asyncMock()).rejects.toThrow('Async error')
    })

    //接受一个将在下一次函数调用中被剔除的值。如果是链式调用，则每次连续调用都会剔除指定值。
    it('mockRejectedValueOnce', async () => {
        const asyncMock = vi.fn().mockResolvedValueOnce('first call').mockRejectedValueOnce(new Error('Async error'))

        expect(asyncMock()).resolves.toBe('first call')
        expect(asyncMock()).rejects.toThrow('Async error')
    })
    //接受将在调用 async 函数时解析的值。
    it('mockResolvedValue', async () => {
        const asyncMock = vi.fn().mockResolvedValue(42)

        expect(asyncMock()).resolves.toBe(42)
    })

    //接受一个将在下一次函数调用时解析的值。如果是链式调用，则每次连续调用都会解析指定的值。
    it('mockResolvedValueOnce', async () => {
        const asyncMock = vi.fn().mockResolvedValue('default').mockResolvedValueOnce('first call').mockResolvedValueOnce('second call')

        expect(asyncMock()).resolves.toBe('first call')
        expect(asyncMock()).resolves.toBe('second call')
        expect(asyncMock()).resolves.toBe('default')
        expect(asyncMock()).resolves.toBe('default')
    })

    //mockReset 执行 mockClear 的功能，并使内部实现成为空函数（调用时返回 undefined ）。这也会重置所有 "once" 实现。当我们想将 mock 完全重置为默认状态时，这很有用。
    it('mockReset', async () => {
        const myMockFn = vi.fn(() => 'original')
        expect(myMockFn()).toBe('original')
        myMockFn.mockReset()
        expect(myMockFn()).toBe(undefined)
    })

    //mockRestore 执行与 mockReset 相同的功能，并将内部实现还原为原始函数。
    it('mockReset', async () => {
        const myMockFn = vi.fn(() => 'original')

        myMockFn.mockImplementation(() => 'temp')
        expect(myMockFn()).toBe('temp')

        myMockFn.mockRestore()
        expect(myMockFn()).toBe('original')
    })

    //接受一个值，该值将在调用 mock 函数时返回。 mockReturnValueOnce 和 mockResolvedValueOnce 一样
    it('mockReturnValue', async () => {
        const mock = vi.fn()
        mock.mockReturnValue(42)
        expect(mock()).toBe(42)
        mock.mockReturnValue(43)
        expect(mock()).toBe(43)
    })

    //这是一个数组，包含每次调用的所有参数。数组中的一项就是该调用的参数。
    //lastCall 其中包含最后一次调用的参数。如果 mock 未被调用，将返回 undefined。
    it('calls', async () => {
        const fn = vi.fn()

        fn('arg1', 'arg2')
        fn('arg3')

        expect(fn.mock.calls[0]).toEqual(['arg1', 'arg2'])
        expect(fn.mock.calls[1]).toEqual(['arg3'])
    })

    //这是一个数组，包含函数 returned 的所有值。数组中的一项是一个具有 type 和 value 属性的对象。可用的类型有:
    it('results', async () => {
        const fn = vi
            .fn()
            .mockReturnValueOnce('result')
            .mockImplementationOnce(() => {
                throw new Error('thrown error')
            })

        const result = fn()
        console.log(result) // returned 'result'

        try {
            fn() // threw Error
        } catch {
            console.log('error')
        }

        // {
        //     type: 'return',
        //     value: 'result',
        //   },
        expect(fn.mock.results[0].type).toBe('return')
        expect(fn.mock.results[0].value).toBe('result')
        // {return
        //     type: 'throw',
        //     value: Error,
        //   },
        expect(fn.mock.results[1].type).toBe('throw')
        expect(fn.mock.results[1].value.message).toBe('thrown error')
    })
})

//vi vi.fn vi.mock vi.spyOn

describe('vi vi vi', () => {
    //更新当前测试文件的配置。此方法只会影响当前测试文件的配置选项：
    //可以通过vi.resetConfig()将配置重置为原始状态
    vi.setConfig({
        allowOnly: true,
        testTimeout: 10_000,
        hookTimeout: 10_000,
        clearMocks: true,
        restoreMocks: true,
        fakeTimers: {
            now: new Date(2021, 11, 19),
            // supports the whole object
        },
        maxConcurrency: 10,
        sequence: {
            hooks: 'stack',
            // supports only "sequence.hooks"
        },
    })

    //vi.hoisted
    it('vi.mock', async () => {
        // vi.mock('./example.js', async () => {
        //     //vi.importActual导入模块，绕过模块是否应被模拟的所有检查。如果我们想部分模拟模块，这一点很有用
        //     const axios = await vi.importActual('./example.js')
        //导入模块并模拟其所有属性（包括嵌套属性）。遵循与 vi.mock 相同的规则
        // vi.importMock
        //     return { ...axios, get: vi.fn() }
        // })
        beforeEach(() => {
            //通过清除所有模块的缓存来重置模块注册表。这样就可以在重新导入模块时对模块进行重新评估。顶层导入无法重新评估。这可能有助于隔离测试之间存在本地状态冲突的模块。
            vi.resetModules()
        })

        const mocks = vi.hoisted(() => {
            return {
                increment: vi.fn(),
            }
        })

        vi.mock('./example.js', () => {
            return {
                increment: mocks.increment,
            }
        })
        vi.mocked(increment).mockReturnValue(100)

        expect(increment(10)).toBe(100)
        expect(increment).toBe(mocks.increment)

        //等待加载所有导入模块。如果有同步调用开始导入一个模块，而如果不这样做就无法等待，那么它就很有用。
        //await vi.dynamicImportSettled()

        //与 vi.unmock 相同，但不会移动到文件顶端。下一次导入模块时，将导入原始模块而非 mock
        vi.doUnmock('./example.js')
        expect(increment(10)).toBe(100)

        // the next import is unmocked, now `increment` is the original function that returns count + 1
        const { increment: unmockedIncrement } = await import('./example.js')

        unmockedIncrement(1) === 2
        unmockedIncrement(30) === 31
    })

    /**创建函数的监视程序，但也可以不创建监视程序。
     * 每次调用函数时，它都会存储调用参数、返回值和实例。
     * 此外，我们还可以使用 methods 操纵它的行为。 如果没有给出函数，调用 mock 时将返回 undefined。
     **/
    test('vi.fn and resetAllMocks and clearAllMocks', () => {
        const getApples = vi.fn(() => 0)

        getApples()
        //检查给定参数是否为 mock 函数
        expect(vi.isMockFunction(getApples)).toBe(true)

        expect(getApples).toHaveBeenCalled()
        expect(getApples).toHaveReturnedWith(0)

        getApples.mockReturnValueOnce(5)

        const res = getApples()
        expect(res).toBe(5)
        expect(getApples).toHaveNthReturnedWith(2, 5)

        //这将清除 mock 历史记录，并将其重置为空函数（将返回 undefined ）。
        vi.resetAllMocks()
        expect(getApples()).toBe(undefined)

        //这将清除 mock 历史记录，但不会将其重置为默认实现。
        vi.clearAllMocks()
        expect(getApples()).toBe(undefined)
    })

    //创建与 vi.fn() 类似的对象的方法或 getter/setter 的监听(spy)
    test('vi.spyOn and restoreAllMocks', async () => {
        const cart = {
            getApples: () => 42,
        }

        const spy = vi.spyOn(cart, 'getApples').mockReturnValue(10)
        expect(cart.getApples()).toBe(10)
        //这将清除 mock 的历史记录，并将其重置为原来的实现。
        vi.restoreAllMocks()
        expect(cart.getApples()).toBe(42) // 42
        spy.mockReturnValue(10)
        expect(cart.getApples()).toBe(42) // still 42!
    })

    test('vi.stubGlobal and unstubAllGlobals', async () => {
        // `innerWidth` is "0" before calling stubGlobal
        const defaultValue = innerWidth
        //更改全局变量的值
        vi.stubGlobal('innerWidth', 100)

        expect(innerWidth).toBe(100)
        expect(globalThis.innerWidth).toBe(100)
        expect(window.innerWidth).toBe(100)

        //恢复全局变量的值
        vi.unstubAllGlobals()

        expect(innerWidth).toBe(defaultValue)
        expect(globalThis.innerWidth).toBe(defaultValue)
        expect(window.innerWidth).toBe(defaultValue)
    })

    it('vi.setSystemTime, userFakeTimers, userRealTimers', async () => {
        const date = new Date(1998, 11, 19)
        /* 启用模拟定时器 它将封装所有对定时器的进一步调用
         *（如 setTimeout 、setInterval 、clearTimeout 、clearInterval 、setImmediate 、clearImmediate 和 Date）。
         */
        vi.useFakeTimers()
        //如果启用了伪计时器，此方法将模拟用户更改系统时钟
        vi.setSystemTime(date)

        expect(vi.isFakeTimers()).toBe(true)
        expect(Date.now()).toBe(date.valueOf())
        //定时器用完后，可以调用此方法将模拟的定时器返回到其原始实现。之前调度的所有计时器都将被丢弃
        vi.useRealTimers()
    })

    //等待回调成功执行。如果回调抛出错误或返回拒绝的承诺，它将继续等待，直到成功或超时。
    it('vi.waitFor', async () => {
        const result = await vi.waitFor(
            async () => {
                return new Promise(resolve => setTimeout(resolve, 200)).then(() => {
                    return Promise.resolve(33)
                })
            },
            {
                timeout: 500,
                interval: 100,
            }
        )
        expect(result).toBe(33)
    })

    //与 vi.waitFor 类似，但如果回调抛出任何错误，执行将立即中断并收到一条错误信息。如果回调返回虚假值(falsy) ，下一次检查将继续，直到返回真实值(truthy) 。这在需要等待某项内容存在后再执行下一步时非常有用
    it('vi.waitUntil', async () => {
        const result = await vi.waitUntil(
            async () => {
                return new Promise(resolve => setTimeout(resolve, 100))
                    .then(() => {
                        return Promise.resolve(33)
                    })
                    .then(() => {
                        return new Promise(resolve => setTimeout(resolve, 100)).then(() => {
                            return Promise.resolve(44)
                        })
                    })
            },
            {
                timeout: 500, // default is 1000
                interval: 50, // default is 50
            }
        )

        // do something with the element
        expect(result === 44).toBeTruthy()
    })
})
