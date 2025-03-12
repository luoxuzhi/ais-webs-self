import { getBaseUrl } from "@/utils/tools";
import { getEnvConfig } from '@/config/env'
const { ais_api } = getEnvConfig()

const domain = getBaseUrl(ais_api)

export const previewFileUrl = `${domain}/ais-api/file/preview`