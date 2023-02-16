import { friend, inputFriendDataDTO } from "../models/friend"
import { user } from "../models/user"

export interface UserRepository {
    createUser (newUser: user): Promise<void>
    addAfriend (input: friend): Promise<void>
    deleteAfriend (input: inputFriendDataDTO): Promise<void>
    getUserByEmail (email: string): Promise<any>
    getUserById (id: string): Promise<any>
    getFriendsByUserId (item: any): Promise<any>
    searchUsers (search: string): Promise<user[]>
}