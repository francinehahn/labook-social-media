import { Request, Response } from "express"
import { PostBusiness } from "../business/PostBusiness"
import { inputGetAllPostsDTO, inputPostDTO } from "../models/post"
import { inputLikePostDTO } from "../models/like"
import { inputCommentDTO } from "../models/comment"


export class PostController {
    constructor(private postBusiness: PostBusiness) {}

    createPost = async (req: Request, res: Response): Promise<void> => {
        try {
            const input: inputPostDTO = {
                photo: req.body.photo,
                description: req.body.description,
                type: req.body.type,
                authorId: req.body.authorId
            }
            
            await this.postBusiness.createPost(input)
        
            res.status(201).send("Success! The post has been posted.")
        
        } catch (error:any) {
            res.status(error.statusCode || 400).send(error.message || error.sqlMessage)
        }
    }


    getPostById = async (req: Request, res: Response): Promise<void> => {
        try {
            const postId = req.params.postId
            const result = await this.postBusiness.getPostById(postId)

            res.status(200).send(result)
     
        } catch (error:any) {
            res.status(error.statusCode || 400).send(error.message || error.sqlMessage)
        }
    }


    getAllPosts = async (req: Request, res: Response): Promise<void> => {
        try {
            const input: inputGetAllPostsDTO = {
                page: Number(req.query.page),
                size: Number(req.query.size)
            }

            const result = await this.postBusiness.getAllPosts(input)
            res.status(200).send(result)
     
        } catch (error:any) {
            res.status(error.statusCode || 400).send(error.message || error.sqlMessage)
        }
    }


    likeApost = async (req: Request, res: Response): Promise<void> => {
        try {
            const input: inputLikePostDTO = {
                userId: req.body.userId,
                postId: req.params.postId
            }

            await this.postBusiness.likeApost(input)
            res.status(201).send("Success! Your like has been registered.")
     
        } catch (error:any) {
            res.status(error.statusCode || 400).send(error.message || error.sqlMessage)
        }
    }


    deslikeApost = async (req: Request, res: Response): Promise<void> => {
        try {
            const input: inputLikePostDTO = {
                userId: req.body.userId,
                postId: req.params.postId
            }

            await this.postBusiness.deslikeApost(input)
            res.status(201).send("Success! Your like has been deleted.")
     
        } catch (error:any) {
            res.status(error.statusCode || 400).send(error.message || error.sqlMessage)
        }
    }


    getLikesByPostId = async (req: Request, res: Response): Promise<void> => {
        try {
            const postId: string = req.params.postId

            const result = await this.postBusiness.getLikesByPostId(postId)
            res.status(200).send(result)
     
        } catch (error:any) {
            res.status(error.statusCode || 400).send(error.message || error.sqlMessage)
        }
    }


    commentOnPost = async (req: Request, res: Response): Promise<void> => {
        try {
            const input: inputCommentDTO = {
                comment: req.body.comment,
                userId: req.body.userId,
                postId: req.params.postId
            }

            await this.postBusiness.commentOnPost(input)
            res.status(201).send("Success! Your comment has been registered.")
     
        } catch (error:any) {
            res.status(error.statusCode || 400).send(error.message || error.sqlMessage)
        }
    }


    getCommentsByPostId = async (req: Request, res: Response): Promise<void> => {
        try {
            const postId: string = req.params.postId

            const result = await this.postBusiness.getCommentsByPostId(postId)
            res.status(200).send(result)
     
        } catch (error:any) {
            res.status(error.statusCode || 400).send(error.message || error.sqlMessage)
        }
    }
}