<template>
    <a-form ref="formRef" class="custom" layout="inline" :model="form.fields" :labelAlign="labelPosition">
        <search-box
            v-if="showSearch"
            :search-default="searchDefault && searchDefault.list.length ? searchDefault.label : ''"
            :search-other="searchOther && searchOther.list.length ? searchOther.label : ''"
        >
            <template v-for="(config, idx) in searchList" :key="idx" #[config.slot]>
                <a-form-item
                    v-for="item in config.list"
                    :key="item.key"
                    :label="item.label"
                    :name="item.key"
                    :labelCol="item.labelCol"
                    :class="{
                        datetimerange: item.props?.type === 'datetimerange',
                        daterange: item.props?.type === 'daterange' || item.props?.type === 'timerange',
                        datetime: item.props?.type === 'date' || item.props?.type === 'time',
                    }"
                >
                    <a-select
                        v-model:value="form.fields[item.key]"
                        :getPopupContainer="getSelectContainer"
                        v-if="item.type === 'select'"
                        v-bind="item.props"
                        :class="item.class"
                        :style="item.style"
                        :fieldNames="[item.key]"
                        @blur="onBlur(item)"
                        @focus="onFocus(item)"
                        :placeholder="getPlaceholder(item)"
                    >
                        <a-select-option v-for="option in item.options || []" :key="option.key" :value="option.key" :title="option.value">
                            {{ option.value }}
                        </a-select-option>
                    </a-select>

                    <a-range-picker
                        v-else-if="item.props?.type === 'datetimerange'"
                        @change="(dates, datesString) => onDateChange(dates, datesString, item)"
                        v-model:value="form.fields[item.key + 'datetimerange']"
                        :class="item.class"
                        :style="item.style"
                        :inputReadOnly="true"
                        show-time
                        v-bind="item.props"
                    />

                    <a-range-picker
                        v-else-if="item.props?.type === 'daterange'"
                        @change="(dates, datesString) => onDateChange(dates, datesString, item)"
                        v-model:value="form.fields[item.key + 'daterange']"
                        v-bind="item.props"
                        :class="item.class"
                        :style="item.style"
                        :inputReadOnly="true"
                    />

                    <a-date-picker
                        v-else-if="item.props?.type === 'date'"
                        @change="(dates, datesString) => onDateChange(dates, datesString, item)"
                        v-model:value="form.fields[item.key + 'date']"
                        v-bind="item.props"
                        :class="item.class"
                        :style="item.style"
                        :inputReadOnly="true"
                    />

                    <a-time-range-picker
                        v-else-if="item.props?.type === 'timerange'"
                        @change="(dates, datesString) => onDateChange(dates, datesString, item)"
                        v-model:value="form.fields[item.key + 'timerange']"
                        v-bind="item.props"
                        :class="item.class"
                        :style="item.style"
                        :inputReadOnly="true"
                    ></a-time-range-picker>

                    <a-time-picker
                        v-else-if="item.props?.type === 'time'"
                        @change="(dates, datesString) => onDateChange(dates, datesString, item)"
                        v-model:value="form.fields[item.key + 'time']"
                        v-bind="item.props"
                        :class="item.class"
                        :style="item.style"
                        :inputReadOnly="true"
                    ></a-time-picker>

                    <a-input-number
                        v-else-if="item.type === 'inputNumber'"
                        v-model:value.trim="form.fields[item.key]"
                        v-bind="item.props"
                        :class="item.class"
                        :style="item.style"
                        :placeholder="getPlaceholder(item)"
                    ></a-input-number>

                    <slot v-else-if="item.type === 'slot'" :name="item.slotName" :form="form"></slot>

                    <a-input
                        v-else
                        v-model:value.trim="form.fields[item.key]"
                        v-bind="item.props"
                        :class="item.class"
                        :style="item.style"
                        :placeholder="getPlaceholder(item)"
                    ></a-input>
                </a-form-item>
            </template>

            <template v-if="baseButtonList" #button>
                <a-button
                    v-for="{ key, props, buttonLabel } in baseButtonList.list"
                    :key="key"
                    v-bind="props"
                    @click.prevent="onActions($event, key)"
                >
                    {{ buttonLabel }}
                </a-button>
            </template>
        </search-box>
        <div class="operatable" v-if="operatableButtonList">
            <div
                v-for="{ key, type = 'button', props, buttonLabel, slotName } in operatableButtonList.list"
                :key="key"
                v-bind="props"
                class="dis-ib"
                @click="onActions($event, key)"
            >
                <a-button v-if="type === 'button'" type="primary">{{ buttonLabel }}</a-button>
                <a-button v-else-if="type === 'upload'" type="default">
                    <CloudUploadOutlined />
                    {{ buttonLabel }}
                </a-button>
                <slot v-else-if="type === 'slot'" :name="slotName"></slot>
            </div>
        </div>
    </a-form>
</template>

<script setup>
import SearchBox from './SearchBox.vue'
import { ref, onMounted, computed, reactive, inject } from 'vue'
import { CloudUploadOutlined } from '@ant-design/icons-vue'
import { useLayoutStore } from '@/store/layout'

const props = defineProps({
    searchConfig: {
        type: Object,
        default: () => ({}),
        required: true,
    },
    // 重置按钮的key
    resetKey: {
        type: String,
        default: 'reset',
    },
})

//回调方法
const emit = defineEmits(['onchange', 'filterAction', 'operateAction', 'focus', 'blur'])

const form = reactive({
    fields: {},
})
const type = ref('')

const formRef = ref(null)
const layoutStore = useLayoutStore()

const labelPosition = computed(() => {
    return 'right'
})

const searchDefault = computed(() => {
    return props.searchConfig.default
})
const searchOther = computed(() => {
    return props.searchConfig.other
})
const searchList = computed(() => {
    const list = []
    const { default: _default, other } = props.searchConfig || {}
    if (_default) {
        _default.slot = 'searchDefault'
        list.push(_default)
    }
    if (other) {
        other.slot = 'searchOther'
        list.push(other)
    }
    return list
})
const baseButtonList = computed(() => {
    const { baseButton = {} } = props.searchConfig
    baseButton.list = (baseButton.list || []).filter(i => {
        if (Array.isArray(i.authCode)) {
            return i.authCode.some(code => this.$auth(code))
        }
        return i.authCode ? true : true
    })
    return baseButton
})
const operatableButtonList = computed(() => {
    const { operatableButton = {} } = props.searchConfig
    operatableButton.list = (operatableButton.list || []).filter(i => {
        if (Array.isArray(i.authCode)) {
            return i.authCode.some(code => this.$auth(code))
        }
        return i.authCode ? true : true
    })
    return operatableButton
})

const showSearch = computed(() => {
    let show = false
    if (searchDefault.value || searchOther.value) {
        show = true
    }
    return show
})

const defaultItems = computed(() => {
    return getDefaultData()
})

const getDefaultData = () => {
    const [{ list: defaultList = [] } = {}, { list: otherList = [] } = {}] = searchList.value || []
    return [...defaultList, ...otherList].reduce((data, i) => {
        if (i.type !== 'button') {
            data[i.key] = [null, undefined].includes(i.default) ? '' : i.default
        }
        if (i.type === 'inputNumber') {
            data[i.key] = [undefined].includes(i.default) ? null : i.default
        }
        return data
    }, {})
}

const onchange = e => {
    emit('onchange', e)
}

const onFocus = e => {
    emit('focus', e)
}

const onBlur = e => {
    emit('blur', e)
}

const onActions = (e, key) => {
    if (key === 'reset') {
        //重置事件
        resetForm()
        submit(e, key)
    } else if (key === 'search') {
        //提交事件
        submit(e, key)
    } else {
        //底部操作按钮事件
        emit('operateAction', key)
    }
}

inject('setChildMethod', () => {
    console.log(111122)
})

const submit = (e, key) => {
    const result = {}
    for (const key in defaultItems.value) {
        if (form.fields[key]) {
            result[key] = form.fields[key]
        }
    }
    console.log('submit fields', result, form.fields)
    emit('filterAction', { key, data: result })
}

// 重置筛选条件
function resetForm() {
    form.fields = {}
    formRef.value.resetFields()
}

function getPlaceholder(data = {}) {
    const str = ['select', 'date', 'daterange', 'datetime', 'datetimerange'].includes(data.type) ? '请选择' : '请输入'
    return data.placeholder || `${str}${data.label}`
}
// 由于DatePicker通过v-model的值是Date类型，因此通过该hack
function onDateChange(dates, datesString, item) {
    const { key } = item
    console.log(`onDateChange key=${key} format=${item.props.format} datesString=${datesString}`)
    form.fields[key] = datesString
}

function reset(type) {
    type.value = type
    onActions({ target: { getAttribute: () => 'reset' } })
}

function getSelectContainer() {
    return layoutStore.appContentRef || document.body
}
</script>

<style lang="less" scoped>
.ant-form {
    width: 100%;

    .ant-form-item {
        min-width: 300px;
        margin: 12px 12px 12px 0;
    }

    .datetimerange {
        min-width: 450px;
    }

    .daterange {
        min-width: 350px;
    }

    .datetime {
        min-width: 250px;
    }

    :deep(.ant-row) {
        flex-flow: row nowrap;
    }

    :deep(.ant-form-item-label) {
        min-width: 100px;
        max-width: 150px;
        white-space: normal;
    }
}

.operatable {
    margin-left: 0;
    padding-bottom: 12px;

    .ant-btn {
        margin-right: 8px;
    }
}

.dis-ib {
    display: inline-block;
}
</style>
