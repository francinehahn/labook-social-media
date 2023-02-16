import { CustomError } from "../errors/CustomError"
import { CantAddFriend, CantDeleteFriend, DuplicateEmail, DuplicateId, EmailNotFound, FriendIdNotFound, IncorrectPassword, InvalidEmail, InvalidPassword, MissingEmail, MissingFriendId, MissingName, MissingPassword, MissingSearchTerm, MissingToken, MissingUserId, NoFriendsFound, NoUsersFound, UserIdNotFound } from "../errors/UserError"
import { deleteFriendDTO, friend, getFriendsByUserIdDTO, inputFriendDataDTO } from "../models/friend"
import { user, inputUserDTO, inputLoginDTO, inputSearchUsersDTO } from "../models/user"
import { Authenticator } from "../services/Authenticator"
import { generateId } from "../services/generateId"
import { HashManager } from "../services/HashManager"
import { UserRepository } from "./UserRepository"


export class UserBusiness {
    constructor(private userDatabase: UserRepository){}

    signup = async (input: inputUserDTO): Promise<string> => {
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

            if (input.password.length < 6) {
                throw new InvalidPassword()
            }

            if (!input.email.includes("@")) {
                throw new InvalidEmail()
            }
     
            const duplicateEmail = await this.userDatabase.getUserByEmail(input.email)
            if (duplicateEmail) {
                throw new DuplicateEmail()
            }

            const hashManager = new HashManager()
            const hashPassword: string = await hashManager.generateHash(input.password)

            const id = generateId()
            const newUser: user = {
                id,
                name: input.name,
                email: input.email,
                password: hashPassword
            }

            await this.userDatabase.signup(newUser)

            const authenticator = new Authenticator()
            const token = await authenticator.generateToken({id})
            
            return token
     
        } catch (error:any) {
           throw new CustomError(error.statusCode, error.message)
        }
    }


    login = async (input: inputLoginDTO): Promise<string> => {
        try {
            if (!input.email) {
                throw new MissingEmail()
            }
            if (!input.password) {
                throw new MissingPassword()
            }
    
            const emailExists = await this.userDatabase.getUserByEmail(input.email)
            
            if (!emailExists) {
                throw new EmailNotFound()
            }
        
            const hashManager = new HashManager()
            const comparePassword = await hashManager.compareHash(input.password, emailExists.password)

            if (!comparePassword) {
                throw new IncorrectPassword()
            }
            
            const authenticator = new Authenticator()
            const token = await authenticator.generateToken({id: emailExists.id})
            
            return token
    
        } catch (err: any) {
            throw new CustomError(err.statusCode, err.message)
        }
    }


    addAfriend = async (input: inputFriendDataDTO): Promise<void> => {
        try {
            if (!input.token) {
                throw new MissingToken()
            }

            const authenticator = new Authenticator()
            const {id} = await authenticator.getTokenData(input.token)

            if (!input.friendId) {
                throw new MissingFriendId()
            }

            const friendExists = await this.userDatabase.getUserById(input.friendId)
            if (!friendExists) {
                throw new FriendIdNotFound()
            }

            if (id === input.friendId) {
                throw new DuplicateId()
            }

            const userFriends = await this.userDatabase.getFriendsByUserId({user_id: id, friend_id: input.friendId})
            const friendFriends = await this.userDatabase.getFriendsByUserId({user_id: input.friendId, friend_id: id})
            
            if (userFriends.length > 0 || friendFriends.length > 0) {
                throw new CantAddFriend()
            }

            const friendsId = generateId()
            const newFriend: friend = {
                id: friendsId,
                user_id: id,
                friend_id: input.friendId
            }

            await this.userDatabase.addAfriend(newFriend)
     
        } catch (error:any) {
            throw new CustomError(error.statusCode, error.message)
        }
    }


    deleteAfriend = async (input: inputFriendDataDTO): Promise<void> => {
        try {
            if (!input.token) {
                throw new MissingToken()
            }

            const authenticator = new Authenticator()
            const {id} = await authenticator.getTokenData(input.token)

            if (!input.friendId) {
                throw new MissingFriendId()
            }

            if (id === input.friendId) {
                throw new DuplicateId()
            }

            const friendIdExists = await this.userDatabase.getUserById(input.friendId)
            if (!friendIdExists) {
                throw new FriendIdNotFound()
            }

            const userFriends = await this.userDatabase.getFriendsByUserId({user_id: id, friend_id: input.friendId})
            const friendFriends = await this.userDatabase.getFriendsByUserId({user_id: input.friendId, friend_id: id})
       
            if (userFriends.length === 0 && friendFriends.length === 0) {
                throw new CantDeleteFriend()
            }

            const deleteFriend: deleteFriendDTO = {
                id,
                friendId: input.friendId
            }

            await this.userDatabase.deleteAfriend(deleteFriend)
     
        } catch (error:any) {
            throw new CustomError(error.statusCode, error.message)
        }
    }


    getFriendsByUserId = async (input: getFriendsByUserIdDTO): Promise<user[]> => {
        try {
            if (!input.token) {
                throw new MissingToken()
            }

            const authenticator = new Authenticator()
            await authenticator.getTokenData(input.token)

            if (input.userId === ":userId") {
                throw new MissingUserId()
            }

            const userIdExists = await this.userDatabase.getUserById(input.userId)
            if (!userIdExists) {
                throw new UserIdNotFound()
            }

            const result: user[] = []
            let userFriends = await this.userDatabase.getFriendsByUserId({user_id: input.userId})
            userFriends.length !== 0? result.push(...userFriends) : result.push()
            
            userFriends = await this.userDatabase.getFriendsByUserId({friend_id: input.userId})
            userFriends.length !== 0? result.push(...userFriends) : result.push()

            if (result.length === 0) {
                throw new NoFriendsFound()
            }

            return result
     
        } catch (error:any) {
            throw new CustomError(error.statusCode, error.message)
        }
    }


    searchUsers = async (input: inputSearchUsersDTO): Promise<user[]> => {
        try {
            if (!input.token) {
                throw new MissingToken()
            }

            const authenticator = new Authenticator()
            await authenticator.getTokenData(input.token)

            if (!input.search) {
                throw new MissingSearchTerm()
            }

            const result = await this.userDatabase.searchUsers(input.search)
            if (result.length === 0) {
                throw new NoUsersFound()
            }

            return result

        } catch (error:any) {
            throw new CustomError(error.statusCode, error.message)
        }
    }
}