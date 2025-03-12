<template>
    <a-modal v-model:open="open" title="新增用户" :maskClosable="false" :width="500" @ok="onConfirm">
        <a-form :model="formData"  ref="formRef" labelAlign="right" :rules="rules" :labelCol="{ span: 5, offset: 0 }">
            <a-form-item label="用户名" labelAlign="right" name="username">
                <a-input v-model:value="formData.username" placeholder="请输入用户名" :maxlength="256" />
            </a-form-item>

            <a-form-item label="昵称" labelAlign="right" name="nickname">
                <a-input v-model:value="formData.nickname" placeholder="请输入昵称" :maxlength="256" />
            </a-form-item>
        </a-form>
    </a-modal>
</template>

<script lang="ts" setup>
import { CreateUser } from '@/apis/user';
import { CreateUserParams } from '@/types/user';
import { FormInstance, message } from 'ant-design-vue';
import { ref, defineModel } from 'vue'

const open = defineModel('open')
const emits = defineEmits(['finish'])
const formRef = ref<FormInstance>()
const formData = ref<CreateUserParams>({
    username: "",
    nickname: "",
})
const rules = {
    username: [{ required: true, message: '请输入用户名' }],
    nickname: [{ required: true, message: '请输入昵称' }],
}

async function onConfirm() {
    await formRef.value?.validate()
   
    const res = await CreateUser(formData.value)

    if(res.code === 0){
        open.value = false
        message.success('新增用户成功')
        emits('finish')
    }
}
</script>

<style scoped lang="less"></style>
