import { deleteFriendDTO, friend } from "../models/friend"
import { user } from "../models/user"


export interface UserRepository {
    signup (newUser: user): Promise<void>
    addAfriend (input: friend): Promise<void>
    deleteAfriend (deleteFriend: deleteFriendDTO): Promise<void>
    getUserByEmail (email: string): Promise<any>
    getUserById (id: string): Promise<any>
    getFriendsByUserId (id: string): Promise<any>
    searchUsers (search: string): Promise<user[]>
}