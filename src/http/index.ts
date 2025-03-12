import axios from 'axios'
import { FSH5Http } from '@fs/http'
import { baseGet, basePost } from '@/http/utlis'
import { useUserStore }  from "@/store/user"
import initInterceptors from './interceptors/index'

const defaultOptions = {
    timeout: 30000,
}

const options = {
    adapter: axios,
    defaultOptions,
}
const http = new FSH5Http(options)

initInterceptors(http)

export const get = baseGet(http) as any

export const post =  basePost(http, { jsonRpc: false }) as any

export default {
    get,
    post,
}
