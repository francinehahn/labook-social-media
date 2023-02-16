import { CustomError } from "../errors/CustomError"
import { CantAddFriend, CantDeleteFriend, DuplicateEmail, DuplicateId, FriendIdNotFound, MissingEmail, MissingFriendId, MissingName, MissingSearchTerm, MissingUserId, NoFriendsFound, NoUsersFound, UserIdNotFound } from "../errors/UserError"
import { friend, inputFriendDataDTO } from "../models/friend"
import { user, inputUserDTO } from "../models/user"
import { generateId } from "../services/generateId"
import { UserRepository } from "./UserRepository"


export class UserBusiness {
    constructor(private userDatabase: UserRepository){}

    createUser = async (input: inputUserDTO): Promise<void> => {
        try {
            if (!input.name) {
                throw new MissingName()
            }

            if (!input.email) {
                throw new MissingEmail()
            }

            if (!input.password) {
                throw new MissingEmail()
            }
     
            const duplicateEmail = await this.userDatabase.getUserByEmail(input.email)
            if (duplicateEmail.length > 0) {
                throw new DuplicateEmail()
            }

            const id = generateId()
            const newUser: user = {
                id,
                name: input.name,
                email: input.email,
                password: input.password
            }

            await this.userDatabase.createUser(newUser)
     
        } catch (error:any) {
           throw new CustomError(error.statusCode, error.message)
        }
    }


    addAfriend = async (input: inputFriendDataDTO): Promise<void> => {
        try {
            if (input.userId === ":userId") {
                throw new MissingUserId()
            }

            if (!input.friendId) {
                throw new MissingFriendId()
            }

            if (input.userId === input.friendId) {
                throw new DuplicateId()
            }

            const userIdExists = await this.userDatabase.getUserById(input.userId)
            if (!userIdExists) {
                throw new UserIdNotFound()
            }

            const friendIdExists = await this.userDatabase.getUserById(input.friendId)
            if (!friendIdExists) {
                throw new FriendIdNotFound()
            }

            const userFriends = await this.userDatabase.getFriendsByUserId({user_id: input.userId, friend_id: input.friendId})
            const friendFriends = await this.userDatabase.getFriendsByUserId({user_id: input.friendId, friend_id: input.userId})
            
            if (userFriends.length > 0 || friendFriends.length > 0) {
                throw new CantAddFriend()
            }

            const id = generateId()
            const newFriend: friend = {
                id,
                user_id: input.userId,
                friend_id: input.friendId
            }

            await this.userDatabase.addAfriend(newFriend)
     
        } catch (error:any) {
            throw new CustomError(error.statusCode, error.message)
        }
    }


    deleteAfriend = async (input: inputFriendDataDTO): Promise<void> => {
        try {
            if (input.userId === ":userId") {
                throw new MissingUserId()
            }

            if (!input.friendId) {
                throw new MissingFriendId()
            }

            if (input.userId === input.friendId) {
                throw new DuplicateId()
            }

            const userIdExists = await this.userDatabase.getUserById(input.userId)
            if (!userIdExists) {
                throw new UserIdNotFound()
            }

            const friendIdExists = await this.userDatabase.getUserById(input.friendId)
            if (!friendIdExists) {
                throw new FriendIdNotFound()
            }

            const userFriends = await this.userDatabase.getFriendsByUserId({user_id: input.userId, friend_id: input.friendId})
            const friendFriends = await this.userDatabase.getFriendsByUserId({user_id: input.friendId, friend_id: input.userId})
       
            if (userFriends.length === 0 && friendFriends.length === 0) {
                throw new CantDeleteFriend()
            }

            await this.userDatabase.deleteAfriend(input)
     
        } catch (error:any) {
            throw new CustomError(error.statusCode, error.message)
        }
    }


    getFriendsByUserId = async (userId: string): Promise<user[]> => {
        try {
            if (userId === ":userId") {
                throw new MissingUserId()
            }

            const userIdExists = await this.userDatabase.getUserById(userId)
            if (!userIdExists) {
                throw new UserIdNotFound()
            }

            const result: user[] = []
            let userFriends = await this.userDatabase.getFriendsByUserId({user_id: userId})
            userFriends.length !== 0? result.push(...userFriends) : result.push()
            
            userFriends = await this.userDatabase.getFriendsByUserId({friend_id: userId})
            userFriends.length !== 0? result.push(...userFriends) : result.push()

            if (result.length === 0) {
                throw new NoFriendsFound()
            }

            return result
     
        } catch (error:any) {
            throw new CustomError(error.statusCode, error.message)
        }
    }


    searchUsers = async (search: string): Promise<user[]> => {
        try {
            if (!search) {
                throw new MissingSearchTerm()
            }

            const result = await this.userDatabase.searchUsers(search)
            if (result.length === 0) {
                throw new NoUsersFound()
            }

            return result

        } catch (error:any) {
            throw new CustomError(error.statusCode, error.message)
        }
    }
}