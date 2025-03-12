import { htmlEntryProxy } from './common'

export default {
    ...htmlEntryProxy,
    '/ais-api/': {
        target: 'http://10.36.9.104:8300/',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api/, ''),
    },
}
