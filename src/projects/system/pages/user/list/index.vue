<template>
    <a-card>
        <div class="row">
            <a-button type="primary" @click="formVisible = true">新增用户</a-button>
        </div>
        <FsTable ref="tableRef" class="tableHistoryRef mar-t20" :showFilter="false" :data="getDataList" :columns="columns">
            <template #bodyCell="{ column, record }">
                <template v-if="column.key === 'role'">
                    <a-tag color="blue">{{ roleMap[record.role] }}</a-tag>
                </template>
            </template>
        </FsTable>

        <UserForm v-model:open="formVisible" :key="+formVisible" @finish="onFinish"></UserForm>
    </a-card>
</template>

<script lang="ts" setup>
import { GetUserList } from '@/apis/user'
import UserForm from './components/UserForm.vue'
import { ref } from 'vue'

const columns: any[] = [
    {
        key: 'username',
        title: '用户名',
    },
    {
        key: 'nickname',
        title: '昵称',
    },
    {
        key: 'role',
        title: '角色',
    },
    {
        key: 'createTime',
        title: '创建时间',
    },
    {
        key: 'loginTime',
        title: '上次登录时间',
    },
]

const roleMap = {
    1: '管理员',
}

async function getDataList(params) {
    const res = await GetUserList(params)
    return res.result
}

const formVisible = ref(false)
const tableRef = ref<any>()
function onFinish() {
    formVisible.value = false
    tableRef?.value.reGetData()
}
</script>

<style scoped lang="less">
.row {
    margin-bottom: 30px;
}
</style>
