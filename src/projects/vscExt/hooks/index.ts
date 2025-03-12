import { ReportLog } from '@/apis/log'

export async function downloadVscExt(config: { url: string; id: number }, callback?: Function) {
    window.open(config.url, '_blank')

    // 上报下载
    const res = await ReportLog({
        type: 1,
        eventId: config.id,
    })

    if (typeof callback === 'function') {
        callback(res.result?.count || 0)
    }
}
