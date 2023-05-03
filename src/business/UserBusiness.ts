import { CustomError } from "../errors/CustomError"
import { CantAddFriend, CantDeleteFriend, DuplicateEmail, DuplicateId, EmailNotFound, FriendIdNotFound, IncorrectPassword, InvalidEmail, InvalidPassword, MissingEmail, MissingFriendId, MissingName, MissingPassword, MissingSearchTerm, MissingToken, MissingUserId, NoFriendsFound, NoUsersFound, UserIdNotFound } from "../errors/UserError"
import { deleteFriendDTO, friend, inputFriendsByUserIdDTO, inputFriendDataDTO } from "../models/friend"
import { user, inputUserDTO, inputLoginDTO, inputSearchUsersDTO, inputGetUserByIdDTO, returnUserDTO } from "../models/user"
import { Authenticator } from "../services/Authenticator"
import { generateId } from "../services/generateId"
import { HashManager } from "../services/HashManager"
import { UserRepository } from "./UserRepository"
import { outputGetFriendsByUserIdDTO } from "../models/user"


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
                throw new MissingPassword()
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

            const userFriends = await this.userDatabase.getFriendsByUserId(id)
            
            const alreadyFriends = userFriends.filter((item: outputGetFriendsByUserIdDTO) => item.id1 === input.friendId || item.id2 === input.friendId)
            
            if (alreadyFriends.length > 0) {
                throw new CantAddFriend()
            }

            const friendshipId = generateId()
            const newFriend: friend = {
                id: friendshipId,
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

            const userFriends = await this.userDatabase.getFriendsByUserId(id)
            const notFriends = userFriends.filter((item: outputGetFriendsByUserIdDTO) => item.id1 === input.friendId || item.id2 === input.friendId)

            if (notFriends.length === 0) {
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


    getFriendsByUserId = async (input: inputFriendsByUserIdDTO): Promise<returnUserDTO[]> => {
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

            const friends = await this.userDatabase.getFriendsByUserId(input.userId)
         
            if (friends.length === 0) {
                throw new NoFriendsFound()
            }
            
            const result: returnUserDTO[] = []
            friends.forEach((item: outputGetFriendsByUserIdDTO) => {
                if (item.id1 !== input.userId) {
                    result.push({
                        id: item.id1,
                        name: item.name1,
                        email: item.email1
                    })
                } else {
                    result.push({
                        id: item.id2,
                        name: item.name2,
                        email: item.email2
                    })
                }
            })
            
            return result
     
        } catch (error:any) {
            throw new CustomError(error.statusCode, error.message)
        }
    }


    getUserById = async (input: inputGetUserByIdDTO): Promise<returnUserDTO> => {
        try {
            if (!input.token) {
                throw new MissingToken()
            }

            const authenticator = new Authenticator()
            await authenticator.getTokenData(input.token)

            if (input.userId === ":userId") {
                throw new MissingUserId()
            }

            const result = await this.userDatabase.getUserById(input.userId)
            if (!result) {
                throw new UserIdNotFound()
            }

            const user: returnUserDTO = {
                id: result.id,
                name: result.name,
                email: result.email
            }

            return user
             
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