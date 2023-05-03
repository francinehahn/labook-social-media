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
            return await BaseDatabase.connection("labook_friends")
            .where('labook_friends.user_id', id)
            .orWhere('labook_friends.friend_id', id)
            .join("labook_users as lu", 'labook_friends.user_id', '=', 'lu.id')
            .join("labook_users as lu2", 'labook_friends.friend_id', '=', 'lu2.id')
            .select("lu.id as id1", "lu.name as name1", "lu.email as email1", "lu2.id as id2", "lu2.name as name2", "lu2.email as email2")
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
            return await BaseDatabase.connection(this.TABLE).select("id", "name", "email").where("name", "like", `%${search}%`)
            
        } catch (error:any) {
            throw new CustomError(error.statusCode, error.message)
        }
    }
}