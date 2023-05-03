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

export interface inputGetUserByIdDTO {
    userId: string,
    token: string
}

export interface returnUserDTO {
    id: string,
    name: string,
    email: string
}

export interface outputGetFriendsByUserIdDTO {
    id1: string,
    name1: string,
    email1: string,
    id2: string,
    name2: string,
    email2: string
}