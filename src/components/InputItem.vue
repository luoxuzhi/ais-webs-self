<template>
    <div
        class="com-input-item"
        :class="{
            active: isFocus,
        }"
    >
        <!-- <div class="title">{{ title }}</div> -->

        <div class="input-wrapper">
            <!-- <div v-if="isAmount && unitText" class="unit">{{ unitText }}</div> -->
            <input
                ref="inputRef"
                :class="{ disabled: props.disabled }"
                :value="formatValue"
                v-bind="$attrs"
                :disabled="props.disabled"
                @input="onInput"
                @focus="isFocus = true"
                @blur="onBlur"
            />
            <!-- <img v-if="localeValue" class="clear" src="@/assets/svg/login/clear.svg" @click.stop="onClear" /> -->
            <span v-if="currency" class="currency">{{ currency }}</span>
        </div>
    </div>

    <slot name="append"></slot>
</template>

<script lang="ts" setup>
import { useInjectFormItemContext } from 'ant-design-vue/es/form'
import { computed, nextTick, ref, watch } from 'vue'
import { milliFormat } from '@fs/utils'
import { amountInput } from '@/utils/tools'

const { onFieldChange, onFieldBlur } = useInjectFormItemContext()

const props = withDefaults(
    defineProps<{
        modelValue: string
        title?: string
        currency?: string
        disabled?: boolean
        isAmount?: boolean
        amountOption?: any
        maxIntegerDigits?: number
        maxDecimalDigits?: number
        maxVal?: number // 最大值
    }>(),
    {
        modalValue: '',
        title: '',
        isAmount: true,
        amountOption: () => ({
            base: 2,
        }),
    }
)

const emits = defineEmits(['update:modelValue'])

const isFocus = ref(false)
const inputRef = ref()
const localeValue = computed({
    get() {
        return props.modelValue
    },

    set(val) {
        inputRef.value.value = props.isAmount ? formatHandler(val) : val
        emits('update:modelValue', val)
    },
})
watch(
    () => props.modelValue,
    () => {
        localeValue.value = formatHandler(localeValue.value).replace(/,/g, '')
    }
)
const formatValue = computed(() => {
    return props.isAmount ? formatHandler(localeValue.value) : localeValue.value
})

const numUnitMap: Record<string, any> = {}

const unitText = computed(() => numUnitMap[localeValue.value.split('.')[0].length] || '')

function onInput(e) {
    let value = e.target.value
    let _formatValue = value
    if (props.isAmount) {
        _formatValue = formatHandler(value)
        const offset = _formatValue.length - value.length

        const rep = v => {
            const val = v
            return val.replaceAll(/,/g, '')
        }

        // 如果删除的是","的情况下，帮用户删除一个数据
        const isSameValue = rep(value) === rep(formatValue.value)
        if (isSameValue) {
            const inputDom = inputRef.value as HTMLInputElement
            const selectionStart = inputDom.selectionStart as number
            const autoDeletedValue: any = formatValue.value.split('')
            autoDeletedValue.splice(selectionStart - 1, 1)
            value = autoDeletedValue.join('')
            setSelectionRange(-1)
        } else {
            value = _formatValue
            setSelectionRange(offset)
        }

        // 最大值为1的处理逻辑
        if (props.maxVal && value > props.maxVal) {
            value = props.maxVal
        }
        value = value.replace(/,/g, '')
    }
    localeValue.value = value
    onFieldChange()
}

// 数据格式化
function formatHandler(value, options = { ...props.amountOption }) {
    const _value = amountInput(value, options, props.maxIntegerDigits, props.maxDecimalDigits)
    return String(milliFormat(_value))
}

function setSelectionRange(offset) {
    const inputDom = inputRef.value as HTMLInputElement
    const selectionStart = inputDom.selectionStart
    const start = selectionStart + offset
    const end = selectionStart + offset

    setTimeout(() => {
        inputDom.setSelectionRange(start, end)
    }, 0)
}

function onBlur() {
    if (props.isAmount && localeValue.value) {
        // eslint-disable-next-line prefer-const
        let [intValue, decimalValue] = localeValue.value.split('.')
        const maxDecimalDigits = props.maxDecimalDigits || 2
        if (decimalValue) {
            // 不足两位进行补位
            decimalValue = decimalValue.length < maxDecimalDigits ? decimalValue + '0'.repeat(maxDecimalDigits - decimalValue.length) : decimalValue
        } else {
            // 没有小数位则补充0
            decimalValue = '0'.repeat(maxDecimalDigits)
        }
        // 需要小数位才展示小数点
        localeValue.value = props.maxDecimalDigits && props.maxDecimalDigits > 0 ? `${intValue}.${decimalValue}` : intValue
    }
    onFieldBlur()
    isFocus.value = false
}

function onClear() {
    localeValue.value = ''
    onFieldChange()
}
</script>

<style scoped lang="less">
input::placeholder {
    color: #ccc;
}

.com-input-item {
    margin-bottom: 4px;
    // padding: 0 10px 0 8px;
    font-size: 12px;
    // border: 1px solid #d9d9d9;
    border-radius: 4px;
    transition: border 0.3s;

    &.active {
        .input-wrapper input {
            border: 1px solid #45a2ff;
        }
    }

    .title {
        color: #333;
        font-weight: 500;
        font-size: 14px;
        line-height: 20px;
        text-align: left;
    }

    .input-wrapper {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: 30px;
        font-size: 12px;
        // line-height: 26px;

        .unit {
            position: absolute;
            top: 0;
            display: flex;
            flex-direction: column;
            align-items: center;
            height: 12px;
            padding: 0 2px;
            color: @fontBlackColor;
            font-weight: 400;
            font-size: 8px;
            line-height: 12px;
            background-color: #f2f2f2;
            border-radius: 1px;

            &::after {
                display: block;
                width: 0;
                height: 0;
                border-top: 2px solid #f2f2f2;
                border-right: 2px solid transparent;
                border-left: 2px solid transparent;
                content: '';
            }
        }

        input {
            flex-grow: 1;
            box-sizing: border-box;
            height: 31px;
            padding: 0 10px 0 8px;
            color: @fontBlackColor;
            font-size: 14px;
            background: #fff;
            border: 1px solid #d9d9d9;
            border-radius: 4px;

            &.disabled {
                color: rgba(0, 0, 0, 0.25);
                background-color: rgba(0, 0, 0, 0.04);
                cursor: not-allowed;
            }

            &.active {
                border: 1px solid #45a2ff;
            }

            &::placeholder {
                color: #d9d9d9;
            }
        }

        .clear {
            margin-right: 6px;
            cursor: pointer;
        }

        .currency {
            flex-shrink: 0;
            color: #333;
            font-weight: 500;
        }
    }
}
</style>
