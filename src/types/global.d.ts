interface RequestRes<T = any, K = any> {
    code: number
    message: string
    result?: T
    error?: K
}

type RequestResPromise<T = any, K = any> = Promise<RequestRes<T, K>>


interface BaseRecord {
    id?: number;
    createdTime?: string;
    updatedTime?: string;
}

interface Pagination{
    pageNo: number;
    count: number
}

interface ListRes<T> {
    list: T[],
    count: number
}