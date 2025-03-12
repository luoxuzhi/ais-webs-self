import { expect, test, assert } from 'vitest'

// 测试 JSON 序列化和反序列化
test('JSON', () => {
    const input = {
        foo: 'hello',
        bar: 'world',
    }

    const output = JSON.stringify(input)
    expect(output).eq('{"foo":"hello","bar":"world"}')
    assert.deepEqual(JSON.parse(output), input, 'matches original')
})
