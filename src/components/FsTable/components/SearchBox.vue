<template>
    <section class="base-form-box">
        <div class="base-form-left">
            <section class="base-form-search" v-if="searchDefault !== ''">
                <div class="base-form-search-label">
                    {{ searchDefault }}
                </div>
                <div class="base-form-search-box">
                    <slot name="searchDefault"></slot>
                </div>
            </section>
            <section class="base-form-search" v-if="searchSecond !== ''">
                <div class="base-form-search-label">
                    {{ searchSecond }}
                </div>
                <div class="base-form-search-box">
                    <slot name="searchSecond"></slot>
                </div>
            </section>
            <section class="base-form-search" v-if="searchOther !== ''">
                <div class="base-form-search-label">
                    {{ searchOther }}
                </div>
                <div class="base-form-search-box overflow" :class="{ one: !show }">
                    <div class="base-other" ref="searchOtherRef">
                        <slot name="searchOther"></slot>
                    </div>
                </div>
                <span v-if="isMore" @click="toggleMore" class="more-btn">
                    {{ show ? '收起' : '更多' }}
                    <DownOutlined v-show="!show" class="icon" />
                    <UpOutlined v-show="show" class="icon" />
                </span>
            </section>
        </div>
        <div class="base-form-btn">
            <slot name="button"></slot>
        </div>
    </section>
</template>

<script setup>
import { ref, watch, onMounted, nextTick, onBeforeUnmount } from 'vue'
import { DownOutlined, UpOutlined } from '@ant-design/icons-vue'

const props = defineProps({
    searchDefault: {
        type: String,
        default: '',
    },
    searchSecond: {
        type: String,
        default: '',
    },
    searchOther: {
        type: String,
        default: '',
    },
    type: {
        type: String,
        default: '',
    },
    // 是否全部展开，默认不展开
    isExpand: {
        type: Boolean,
        default: false,
    },
})

const show = ref(true)
const isMore = ref(false)
const originResizeHandle = ref(null)
const searchOtherRef = ref(null)

const minHeight = 56
watch(
    () => show.value,
    value => {
        if (value) {
            nextTick(() => {
                isMore.value = searchOtherRef.value && searchOtherRef.value.offsetHeight > minHeight
            })
        }
    }
)

onMounted(() => {
    // 侦听页面变化 重新计算是否需要展开
    originResizeHandle.value = window.onresize
    handle()
    window.onresize = () => {
        originResizeHandle.value?.()
        handle()
    }
})

onBeforeUnmount(() => {
    window.onresize = originResizeHandle.value
})

function handle() {
    isMore.value = searchOtherRef.value && searchOtherRef.value.offsetHeight > minHeight
    show.value = !props.isExpand ? searchOtherRef.value && searchOtherRef.value.offsetHeight < minHeight : true
}

function toggleMore() {
    show.value = !show.value
}

function refresh() {
    handle()
}
</script>
<style scoped lang="less">
@minheight: 56px;

.base-form-box {
    display: flex;
    align-items: center;
    width: 100%;
    margin-bottom: 16px;
    border: 1px solid #ddd;

    .base-form-left {
        flex: 1;
    }

    .base-form-search {
        position: relative;
        display: flex;
        align-items: center;
        background: #f1f1f1;
        border-right: 1px solid #ddd;
        border-bottom: 1px solid #ddd;
        transition: all 0.5s;

        &:last-child {
            border-bottom: 0;
        }

        .base-form-search-label {
            width: 120px;
            text-align: center;
        }

        .base-form-search-box {
            position: relative;
            display: flex;
            flex: 1;
            flex-wrap: wrap;
            box-sizing: content-box;
            padding: 8px;
            background: #fff;
            border-left: 1px solid #ddd;

            &.overflow {
                overflow: hidden;
            }

            &.one {
                height: @minheight;
            }

            .base-other {
                display: flex;
                flex-wrap: wrap;
                align-items: center;
                padding-right: 100px;
            }
        }

        .more-btn {
            position: absolute;
            top: 20px;
            right: 16px;
            width: 80px;
            line-height: 32px;
            text-align: center;
            // border: 1px solid #ddd;
            // border-radius: 2px;
            cursor: pointer;

            .icon {
                font-size: 14px;
            }
        }
    }

    .base-form-btn {
        :deep(.ant-btn) {
            margin: 5px;
        }
    }
}

@media screen and (max-width: 576px) {
    .base-form-box .base-form-search {
        border-right: none;
    }

    .base-form-left {
        width: 100%;
    }
}

@media screen and (max-width: 700px) {
    .base-form-box {
        flex-direction: column;

        .base-form-btn {
            display: flex;
            width: 100%;
        }
    }
}
</style>
