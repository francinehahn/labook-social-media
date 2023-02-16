import express from 'express'
import { UserBusiness } from '../business/UserBusiness'
import { UserController } from '../controller/UserController'
import { UserDatabase } from '../data/UserDatabase'

export const userRouter = express.Router()

const userDatabase = new UserDatabase()
const userBusiness = new UserBusiness(userDatabase)
const userController = new UserController(userBusiness)

userRouter.post("/signup", (req, res) => userController.signup(req, res))
userRouter.post("/login", (req, res) => userController.login(req, res))

userRouter.get("/", (req, res) => userController.searchUsers(req, res))

userRouter.post("/friends/add", (req, res) => userController.addAfriend(req, res))
userRouter.get("/friends/:userId", (req, res) => userController.getFriendsByUserId(req, res))
userRouter.delete("/friends/delete", (req, res) => userController.deleteAfriend(req, res))