<template>
    <div>
        <TableFilter v-if="showFilter" v-bind="filterProps" @filterAction="onFilterAction" @operateAction="onOperateAction" ref="TableFilterRef">
            <template v-for="(index, name) in $slots" v-slot:[name]>
                <slot :name="name"></slot>
            </template>
        </TableFilter>
        <slot name="tableHeader"></slot>
        <a-table
            ref="tableRef"
            class="table"
            bordered
            :row-key="(record: any) => record.id"
            :loading="loading"
            :showSorterTooltip="false"
            :scroll="{ x: '100%' }"
            v-bind="$attrs"
            :columns="localeColumns"
            :data-source="localeData"
            :class="{ 'min-expand': localeData.length > 3 }"
            :pagination="false"
        >
            <template #headerCell="{ column }">
                <slot name="headerCell" :column="column"></slot>
            </template>
            <template #bodyCell="{ column, record, index }">
                <slot name="bodyCell" :column="column" :record="record" :index="index"></slot>
            </template>
        </a-table>

        <div class="pagination-wrapper">
            <slot name="paginationCell"></slot>
            <a-pagination
                v-if="showPagination"
                :total="paginationData.total"
                :current="paginationData.currentPage"
                :page-size="paginationData.pageSize"
                @change="onChangePage"
                :showTotal="totalHeader"
                :showSizeChanger="true"
            ></a-pagination>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import TableFilter from './components/TableFilter.vue'
import { TableColumnsType } from 'ant-design-vue'

const props = withDefaults(
    defineProps<{
        filterProps?: {}
        showFilter?: boolean
        showPagination?: boolean
        columns: TableColumnsType
        data?: ((params?: any) => Promise<any>) | any[]
        immediate?: boolean
        hideloading?: boolean
    }>(),
    {
        filterProps: () => ({}),
        showPagination: true,
        showFilter: true,
        immediate: true,
        hideloading: false,
    }
)

const emits = defineEmits(['filterAction', 'operateAction', 'onChangePage'])

const localeColumns = computed(() => {
    const columns = (props.columns || []).map(item => {
        return { ...item, dataIndex: item.key }
    })
    return columns
})

const localeData = ref([])
const loading = ref(false)
const paginationData = ref({
    total: 0,
    currentPage: 1,
    pageSize: 10,
})
const TableFilterRef = ref()

onMounted(() => {
    if (props.immediate) {
        getData()
    }
})
watch(
    () => props.data,
    () => {
        getData()
    }
)

async function getData(params: Record<string, any> = {}) {
    let _data
    if (typeof props.data === 'function') {
        try {
            // 是否不展示loading
            if (!props.hideloading) loading.value = true

            let _params: Record<string, any> = {}

            if (props.showPagination) {
                _params.page = paginationData.value.currentPage
                _params.count = paginationData.value.pageSize
            }

            // 如果设置了page 则需要去修改页码
            if (params?.page) {
                paginationData.value.currentPage = params?.page
            }

            _params = {
                ..._params,
                ...filterData.value,
                ...params,
            }

            const res = await props.data(_params)
            if (!res) return // 未返回对象不做处理
            const { list = [], total = 0 } = res
            _data = [...(list || [])]

            if (props.showPagination) {
                paginationData.value = {
                    ...paginationData.value,
                    total,
                }
            }
        } finally {
            loading.value = false
        }
    } else {
        _data = [...(props.data || [])]
    }

    localeData.value = _data as any
}

function reGetData() {
    getData({
        page: 1,
    })
}

// 筛选相关
const filterData = ref({})
function onFilterAction({ data } = {} as any) {
    paginationData.value.currentPage = 1
    filterData.value = data
    getData()
    emits('filterAction', data)
}
function onOperateAction(key: string) {
    emits('operateAction', key)
}

// 分页相关
function totalHeader(total: number) {
    return `共 ${total} 条`
}
function onChangePage(page: number, newPagesize: number) {
    const isSamePageSize = paginationData.value.pageSize === newPagesize
    let newPage = isSamePageSize ? page : 1
    //修复列表数据为空时点击底部页面page,change事件里page为0的问题
    if (newPage < 1) {
        newPage = 1
    }
    paginationData.value.currentPage = newPage
    paginationData.value.pageSize = newPagesize
    emits('onChangePage')
    getData()
}

defineExpose({
    paginationData,
    filterData,
    getData,
    reGetData,
    localeData,
})
</script>

<style lang="less" scoped>
.min-expand {
    min-height: 166px;
}

:deep(.ant-table-body) {
    // overflow-y: hidden !important;
    scrollbar-width: none; /* 对于Firefox */
}

.ant-table-body::-webkit-scrollbar {
    display: none; /* 对于Chrome, Safari和Opera */
}

.pagination-wrapper {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    padding-top: 24px;
}
</style>
