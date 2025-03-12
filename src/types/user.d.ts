export interface LoginParams {
    username: string
    password: string
}

interface User {
    username: string
    nickname: string
    role: string
    loginTime: string
    createTime: string
}

interface CreateUserParams {
    username: string
    nickname: string
}

export interface LoginUser {
    user: User
    token: string
}
