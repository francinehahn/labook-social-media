export type user = {
    id: string,
    name: string,
    email: string,
    password: string
 }

export interface inputUserDTO {
    name: string,
    email: string,
    password: string
}

export interface inputLoginDTO {
    email: string,
    password: string
}

export interface inputSearchUsersDTO {
    search: string,
    token: string
}