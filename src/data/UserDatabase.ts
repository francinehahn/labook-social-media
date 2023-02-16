import { UserRepository } from "../business/UserRepository"
import { BaseDatabase } from "../data/BaseDatabase"
import { CustomError } from "../errors/CustomError"
import { friend, inputFriendDataDTO } from "../models/friend"
import { user } from "../models/user"


export class UserDatabase extends BaseDatabase implements UserRepository {
    TABLE = "labook_users"

    createUser = async (newUser: user): Promise<void> => {
        try {
            await BaseDatabase.connection(this.TABLE).insert(newUser)
     
        } catch (error:any) {
           throw new CustomError(error.statusCode, error.message)
        }
    }


    addAfriend = async (newFriend: friend): Promise<void> => {
        try {
            await BaseDatabase.connection("labook_friends").insert(newFriend)
     
        } catch (error:any) {
            throw new CustomError(error.statusCode, error.message)
        }
    }


    deleteAfriend = async (input: inputFriendDataDTO): Promise<void> => {
        try {
            await BaseDatabase.connection("labook_friends").where({"user_id": input.userId, "friend_id": input.friendId}).delete()
            await BaseDatabase.connection("labook_friends").where({"user_id": input.friendId, "friend_id": input.userId}).delete()
     
        } catch (error:any) {
            throw new CustomError(error.statusCode, error.message)
        }
    }


    getFriendsByUserId = async (item: any): Promise<any> => {
        try {
            return await BaseDatabase.connection("labook_friends").select().where(item)
     
        } catch (error:any) {
            throw new CustomError(error.statusCode, error.message)
        }
    }


    getUserByEmail = async (email: string): Promise<any> => {
        try {
            return await BaseDatabase.connection(this.TABLE).select().where({email})
     
        } catch (error:any) {
            throw new CustomError(error.statusCode, error.message)
        }
    }


    getUserById = async (id: string): Promise<any> => {
        try {
            const result = await BaseDatabase.connection(this.TABLE).select().where({id})
            return result[0]

        } catch (error:any) {
            throw new CustomError(error.statusCode, error.message)
        }
    }


    searchUsers = async (search: string): Promise<user[]> => {
        try {
            return await BaseDatabase.connection(this.TABLE).select().where("name", "like", `%${search}%`)
            
        } catch (error:any) {
            throw new CustomError(error.statusCode, error.message)
        }
    }
}