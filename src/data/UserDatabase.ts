import { UserRepository } from "../business/UserRepository"
import { BaseDatabase } from "../data/BaseDatabase"
import { CustomError } from "../errors/CustomError"
import { deleteFriendDTO, friend, inputFriendDataDTO } from "../models/friend"
import { user } from "../models/user"


export class UserDatabase extends BaseDatabase implements UserRepository {
    TABLE = "labook_users"

    signup = async (newUser: user): Promise<void> => {
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


    deleteAfriend = async (deleteFriend: deleteFriendDTO): Promise<void> => {
        try {
            await BaseDatabase.connection("labook_friends").where({"user_id": deleteFriend.id, "friend_id": deleteFriend.friendId}).delete()
            await BaseDatabase.connection("labook_friends").where({"user_id": deleteFriend.friendId, "friend_id": deleteFriend.id}).delete()
     
        } catch (error:any) {
            throw new CustomError(error.statusCode, error.message)
        }
    }


    getFriendsByUserId = async (id: string): Promise<any> => {
        try {
            return await BaseDatabase.connection("labook_friends").select().where("user_id", id).orWhere("friend_id", id)
     
        } catch (error:any) {
            throw new CustomError(error.statusCode, error.message)
        }
    }


    getUserByEmail = async (email: string): Promise<any> => {
        try {
            const result = await BaseDatabase.connection(this.TABLE).select().where({email})
            return result[0]
     
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