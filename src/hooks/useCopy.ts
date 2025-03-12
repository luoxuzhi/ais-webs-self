import { message } from 'ant-design-vue'
import useClipboard from 'vue-clipboard3'
const { toClipboard } = useClipboard()

export async function useCopy(text: string) {
    try {
        await toClipboard(text)
        message.success('复制成功')
    } catch (err) {
        console.log('复制失败', err)
        message.error('复制失败')
        throw err
    }
}
