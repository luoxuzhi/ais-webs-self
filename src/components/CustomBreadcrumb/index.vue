<template>
    <div class="com-custom-breadcrumb">
        <a-breadcrumb>
            <a-breadcrumb-item v-for="item in config" :key="item.text">
                <router-link v-if="item.path" :to="item.path">{{ item.text }}</router-link>
                <span v-else>{{ item.text }}</span>
            </a-breadcrumb-item>
        </a-breadcrumb>
    </div>
</template>

<script lang="ts" setup>
const props = withDefaults(
    defineProps<{
        config?: {
            path?: string
            text: string
        }[]
    }>(),
    { config: () => [] }
)
</script>

<style scoped lang="less">
.com-custom-breadcrumb {
    margin-bottom: 20px;

    :deep {
        .ant-breadcrumb-link {
            color: #1d2129;
            font-weight: 500;
            font-size: 14px;
            line-height: 22px;

            a {
                color: #4e5969;

                &.router-link-active {
                    color: #4e5969;
                    font-weight: 400;
                }

                &:hover {
                    color: #4e5969;
                    background: none;
                }
            }
        }

        .ant-breadcrumb-separator {
            font-size: 10px;
            vertical-align: text-bottom;
        }
    }
}
</style>
