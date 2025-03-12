<template>
    <div class="markdown-body" :innerHTML="renderedMarkdown"></div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
// 修正为具名导入
import { marked } from 'marked'
import hljs from 'highlight.js'
import 'github-markdown-css'

marked.setOptions({
    highlight: function (code, lang) {
        const validLang = hljs.getLanguage(lang) ? lang : 'plaintext'
        return hljs.highlight(code, { language: validLang }).value
    },
})

const props = defineProps({
    markdownText: {
        type: String,
        default: '',
    },
})

const renderedMarkdown = computed(() => {
    return marked(props.markdownText)
})
</script>

<style lang="less">
.markdown-body {
    /* 你可以根据需要添加更多样式 */
    font-family: Arial, sans-serif;
    line-height: 2;

    ol {
        display: block;
        unicode-bidi: isolate;
        list-style: decimal;
        list-style-type: decimal;
        margin-block-start: 1em;
        margin-block-end: 1em;
        margin-inline-start: 0;
        margin-inline-end: 0;
        padding-inline-start: 40px;
    }

    ul {
        list-style: disc; /* 无序列表的默认值 */
    }

    dl {
        list-style: none; /* 定义列表通常不使用列表标记 */
    }

    img {
        display: block;
        width: 100%;
        max-width: 500px;
    }

    pre {
        padding: 10px;
        overflow-x: auto;
        background-color: #f8f8f8;
        border-radius: 5px;
    }

    code {
        font-family: monospace;
    }
}
</style>
