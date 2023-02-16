import express from 'express'
import { PostBusiness } from '../business/PostBusiness'
import { PostController } from '../controller/PostController'
import { PostDatabase } from '../data/PostDatabase'
import { UserDatabase } from '../data/UserDatabase'

export const postRouter = express.Router()

const postDatabase = new PostDatabase()
const userDatabase = new UserDatabase()
const postBusiness = new PostBusiness(postDatabase, userDatabase)
const postController = new PostController(postBusiness)

postRouter.post("/", (req, res) => postController.createPost(req, res))
postRouter.get("/", (req, res) => postController.getAllPosts(req, res))

postRouter.get("/:postId", (req, res) => postController.getPostById(req, res))

postRouter.post("/likes/:postId", (req, res) => postController.likeApost(req, res))
postRouter.delete("/likes/:postId", (req, res) => postController.deslikeApost(req, res))
postRouter.get("/likes/:postId", (req, res) => postController.getLikesByPostId(req, res))

postRouter.post("/comments/:postId", (req, res) => postController.commentOnPost(req, res))
postRouter.get("/comments/:postId", (req, res) => postController.getCommentsByPostId(req, res))
