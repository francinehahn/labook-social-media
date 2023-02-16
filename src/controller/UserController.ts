import { Response, Request } from "express"
import { UserBusiness } from "../business/UserBusiness"
import { inputFriendDataDTO } from "../models/friend"
import { inputUserDTO } from "../models/user"


export class UserController {
    constructor(private userBusiness: UserBusiness) {}

    createUser = async (req: Request, res: Response): Promise<void> => {
        try {
            const input: inputUserDTO = {
                name: req.body.name,
                email: req.body.email,
                password: req.body.password
            }
     
            await this.userBusiness.createUser(input)
            
            res.status(201).send("Success! The user has been registered.")
     
        } catch (error:any) {
           res.status(error.statusCode || 400).send(error.message || error.sqlMessage)
        }
    }


    addAfriend = async (req: Request, res: Response): Promise<void> => {
        try {
            const input: inputFriendDataDTO = {
                userId: req.params.userId,
                friendId: req.body.friendId
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
                userId: req.params.userId,
                friendId: req.body.friendId
            }

            await this.userBusiness.deleteAfriend(input)
            
            res.status(201).send("Success! The user has been deleted.")
     
        } catch (error:any) {
            res.status(error.statusCode || 400).send(error.message || error.sqlMessage)
        }
    }


    getFriendsByUserId = async (req: Request, res: Response): Promise<void> => {
        try {
            const userId = req.params.userId
            const result = await this.userBusiness.getFriendsByUserId(userId)
            
            res.status(200).send(result)
     
        } catch (error:any) {
            res.status(error.statusCode || 400).send(error.message || error.sqlMessage)
        }
    }

    
    searchUsers = async (req: Request, res: Response): Promise<void> => {
        try {
            const search = req.query.search as string
            const result = await this.userBusiness.searchUsers(search)
            
            res.status(200).send(result)
     
        } catch (error:any) {
            res.status(error.statusCode || 400).send(error.message || error.sqlMessage)
        }
    }
}