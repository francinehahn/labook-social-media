import { Response, Request } from "express"
import { UserBusiness } from "../business/UserBusiness"
import { inputFriendsByUserIdDTO, inputFriendDataDTO } from "../models/friend"
import { inputGetUserByIdDTO, inputLoginDTO, inputSearchUsersDTO, inputUserDTO } from "../models/user"


export class UserController {
    constructor(private userBusiness: UserBusiness) {}

    signup = async (req: Request, res: Response): Promise<void> => {
        try {
            const input: inputUserDTO = {
                name: req.body.name,
                email: req.body.email,
                password: req.body.password
            }

            const token = await this.userBusiness.signup(input)
            res.status(201).send({message: 'Success! User has been registered!', token})
     
        } catch (error:any) {
           res.status(error.statusCode || 400).send(error.message || error.sqlMessage)
        }
    }


    login = async (req: Request, res: Response): Promise<void> => {
        try {
            const input: inputLoginDTO = {
                email: req.body.email,
                password: req.body.password
            }
      
            const token = await this.userBusiness.login(input)
            res.status(201).send({token})
    
        } catch (err: any) {
            res.status(err.statusCode || 400).send(err.message || err.sqlMessage)
        }
    }


    addAfriend = async (req: Request, res: Response): Promise<void> => {
        try {
            const input: inputFriendDataDTO = {
                friendId: req.body.friendId,
                token: req.headers.authorization as string
            }
     
            await this.userBusiness.addAfriend(input)
            
            res.status(201).send("Success! The user has been added.")
     
        } catch (error:any) {
            res.status(error.statusCode || 400).send(error.message || error.sqlMessage)
        }
    }


    deleteAfriend = async (req: Request, res: Response): Promise<void> => {
        try {
            const input: inputFriendDataDTO = {
                friendId: req.body.friendId,
                token: req.headers.authorization as string
            }

            await this.userBusiness.deleteAfriend(input)
            
            res.status(201).send("Success! The user has been deleted.")
     
        } catch (error:any) {
            res.status(error.statusCode || 400).send(error.message || error.sqlMessage)
        }
    }


    getFriendsByUserId = async (req: Request, res: Response): Promise<void> => {
        try {
            const input: inputFriendsByUserIdDTO = {
                userId: req.params.userId,
                token: req.headers.authorization as string
            }

            const result = await this.userBusiness.getFriendsByUserId(input)
            res.status(200).send(result)
     
        } catch (error:any) {
            res.status(error.statusCode || 400).send(error.message || error.sqlMessage)
        }
    }


    getUserById = async (req: Request, res: Response): Promise<void> => {
        try {
            const input: inputGetUserByIdDTO = {
                userId: req.params.userId,
                token: req.headers.authorization as string
            }

            const result = await this.userBusiness.getUserById(input)
            res.status(200).send(result)
     
        } catch (error:any) {
            res.status(error.statusCode || 400).send(error.message || error.sqlMessage)
        }
    }

    
    searchUsers = async (req: Request, res: Response): Promise<void> => {
        try {
            const input: inputSearchUsersDTO = {
                search: req.query.search as string,
                token: req.headers.authorization as string
            }

            const result = await this.userBusiness.searchUsers(input)
            res.status(200).send(result)
     
        } catch (error:any) {
            res.status(error.statusCode || 400).send(error.message || error.sqlMessage)
        }
    }
}