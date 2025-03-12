import { htmlEntryProxy } from './common'

export default {
    ...htmlEntryProxy,
    '/ais-api/': {
        target: 'https://adminapi-sit.finloopg.com',
        // target: 'http://10.36.9.104:8300',
        changeOrigin: true,
    },
}
