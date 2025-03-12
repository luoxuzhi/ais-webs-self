<template>
    <div class="page-account">
        <div class="page-account-container">
            <div class="page-account-top">
                <div class="page-account-top-title">前端智能平台</div>
            </div>
            <a-form
                :model="formState"
                name="login"
                :rules="rules"
                class="page-account-form"
                :label-col="{ span: 8 }"
                :wrapper-col="{ span: 16 }"
                autocomplete="off"
                ref="formRef"
            >
                <a-form-item label="" name="username" :wrapper-col="{ offset: 0, span: 24 }">
                    <a-input placeholder="用户名" v-model:value="formState.username" />
                </a-form-item>

                <a-form-item label="" name="password" :wrapper-col="{ offset: 0, span: 24 }">
                    <a-input-password placeholder="密码" v-model:value="formState.password" />
                </a-form-item>

                <a-form-item :wrapper-col="{ offset: 0, span: 24 }">
                    <a-button type="primary" @click="onSubmit">登录</a-button>
                </a-form-item>
                <!-- 原先的访客按钮被替换为链接 -->
                <a-form-item :wrapper-col="{ span: 24 }">
                    <div class="guest-link" @click="handleGuestMode">访客进入</div>
                </a-form-item>
            </a-form>
        </div>
    </div>
</template>
<script setup lang="ts">
// types
import { FormState } from '@/types/login'

// api
import { reactive, ref } from 'vue'
import { message } from 'ant-design-vue'
import { useUserStore } from '@/store/user'

// interface
import { Login } from '@/apis/user'

// hooks
import { useRouter } from 'vue-router'
import { getQueryString } from '@fs/utils'

const rules = {
    username: [{ required: true, message: '请输入用户名' }],
    password: [{ required: true, message: '请输入密码' }],
}

const userStore = useUserStore()
const formState: FormState = reactive({
    username: '',
    password: '',
    otpCode: '',
    remember: true,
})
const formRef = ref()

const router = useRouter()
const onSubmit = () => {
    formRef.value
        .validate()
        .then(async () => {
            const params = {
                username: formState.username,
                password: formState.password,
            }
            try {
                const res = await Login(params)
                if (res.code === 0) {
                    const { user, token } = res.result || {}
                    userStore.updateUserInfo(user, token)
                    message.success('登录成功')
                    login()
                }
                console.log(res, 'res')
            } catch (error) {
                console.log('🚀 ~ onFinish ~ error:', error)
            }
        })
        .catch((error: any) => {
            console.log('error', error)
        })
}

function login() {
    const aggregationUrl = `${location.origin}/ais/portal.html#/aggregation`
    // 原获取解码的redirect时存在两次编码
    // const redirectUrl = decodeURIComponent((getQueryString('redirect') || '') as string)
    const redirectParam = getQueryString('redirect')
    const redirectUrl = redirectParam
        ? decodeURIComponent(decodeURIComponent(redirectParam) as string)
        : ''
    const url = redirectUrl || aggregationUrl
    window.location.replace(url)
}
const handleGuestMode = () => {
    userStore.setGuestMode()
    router.push({ name: 'aggregation' })
}
</script>
<style scoped lang="less">
.page-account {
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow: auto;
    background-image: url('@/assets/svg/portal/loginbg.svg');
    background-position: center;
    background-size: 100%;

    &-container {
        position: fixed;
        top: 50%;
        left: 50%;
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 493px;
        padding-bottom: 20px;
        text-align: center;
        background: #fff;
        border-radius: 8px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
        transform: translate(-50%, -50%);
    }

    :deep(.ant-form-item-explain-error) {
        text-align: left;
    }

    .page-account-form {
        display: block;
        width: 350px;

        .ant-input,
        .ant-input-password,
        .ant-btn {
            height: 44px;
        }

        .form-item {
            display: flex;
            align-items: center;

            .send-otp {
                margin-left: 15px;
                white-space: nowrap;
                border-radius: 6px;
                cursor: pointer;
            }
        }
    }
     /* 移除旧按钮布局继承规则 */
    :deep(.ant-btn + .ant-btn) {
        margin-top: 12px;
    }

    .guest-link {
        margin-top: 15px;
        color: var(--theme-primary-color, #2a6ed9);
        cursor: pointer;
    }

    .guest-link:hover {
        text-decoration: underline;
    }

    :deep(.ant-btn) {
        width: 100%;
    }

    &-tabs {
        .ivu-tabs-bar {
            border-bottom: none;
        }

        .ivu-tabs-nav-scroll {
            text-align: center;
        }

        .ivu-tabs-nav {
            display: inline-block;
            float: none;
        }
    }

    &-top {
        padding: 32px 0;

        &-logo {
            img {
                height: 75px;
            }
        }
    }

    &-auto-login {
        margin-bottom: 24px;
        text-align: left;

        a {
            float: right;
        }
    }

    &-other {
        margin: 24px 0;
        text-align: left;

        img {
            width: 24px;
            margin-left: 16px;
            vertical-align: middle;
            cursor: pointer;
            opacity: 0.7;

            &:hover {
                opacity: 1;
            }
        }
    }

    .ivu-poptip,
    .ivu-poptip-rel {
        display: block;
    }

    &-register {
        float: right;

        &-tip {
            text-align: left;
        }
    }

    &-to-login {
        margin-top: 16px;
        text-align: center;
    }

    &-header {
        position: fixed;
        top: 16px;
        right: 24px;
        text-align: right;
    }
}

:deep(.ant-btn.guest-link) {
  background: transparent;
  border: none;
}

.page-account-top-title {
    font-weight: bold;
    font-size: 24px;
}
</style>