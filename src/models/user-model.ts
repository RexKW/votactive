

export interface RegisterUserRequest{
    username: string
    email: string
    password:string
}

export interface UserResponse{
    id: number
    token?: string
    email: string
    username: string
    password: string

}

export interface LoginUserRequest {
    email: string
    password: string
}
