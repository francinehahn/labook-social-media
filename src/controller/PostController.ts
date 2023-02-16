import { Request, Response } from "express"
import { PostBusiness } from "../business/PostBusiness"
import { inputGetAllPostsDTO, inputGetPostByIdDTO, inputPostDTO } from "../models/post"
import { inputDeslikePostDTO, inputLikePostDTO } from "../models/like"
import { inputCommentDTO, inputGetCommentsDTO } from "../models/comment"


export class PostController {
    constructor(private postBusiness: PostBusiness) {}

    createPost = async (req: Request, res: Response): Promise<void> => {
        try {
            const input: inputPostDTO = {
                photo: req.body.photo,
                description: req.body.description,
                type: req.body.type,
                token: req.headers.authorization as string
            }
            
            await this.postBusiness.createPost(input)
            res.status(201).send("Success! The post has been posted.")
        
        } catch (error:any) {
            res.status(error.statusCode || 400).send(error.message || error.sqlMessage)
        }
    }


    getPostById = async (req: Request, res: Response): Promise<void> => {
        try {
            const input: inputGetPostByIdDTO = {
                postId: req.params.postId,
                token: req.headers.authorization as string
            }

            const result = await this.postBusiness.getPostById(input)
            res.status(200).send(result)
     
        } catch (error:any) {
            res.status(error.statusCode || 400).send(error.message || error.sqlMessage)
        }
    }


    getAllPosts = async (req: Request, res: Response): Promise<void> => {
        try {
            const input: inputGetAllPostsDTO = {
                page: Number(req.query.page),
                size: Number(req.query.size),
                token: req.headers.authorization as string
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
                postId: req.params.postId,
                token: req.headers.authorization as string
            }

            await this.postBusiness.likeApost(input)
            res.status(201).send("Success! Your like has been registered.")
     
        } catch (error:any) {
            res.status(error.statusCode || 400).send(error.message || error.sqlMessage)
        }
    }


    deslikeApost = async (req: Request, res: Response): Promise<void> => {
        try {
            const input: inputDeslikePostDTO = {
                postId: req.params.postId,
                token: req.headers.authorization as string
            }

            await this.postBusiness.deslikeApost(input)
            res.status(201).send("Success! Your like has been deleted.")
     
        } catch (error:any) {
            res.status(error.statusCode || 400).send(error.message || error.sqlMessage)
        }
    }


    getLikesByPostId = async (req: Request, res: Response): Promise<void> => {
        try {
            const input: inputLikePostDTO = {
                postId: req.params.postId,
                token: req.headers.authorization as string
            }

            const result = await this.postBusiness.getLikesByPostId(input)
            res.status(200).send(result)
     
        } catch (error:any) {
            res.status(error.statusCode || 400).send(error.message || error.sqlMessage)
        }
    }


    commentOnPost = async (req: Request, res: Response): Promise<void> => {
        try {
            const input: inputCommentDTO = {
                comment: req.body.comment,
                postId: req.params.postId,
                token: req.headers.authorization as string
            }

            await this.postBusiness.commentOnPost(input)
            res.status(201).send("Success! Your comment has been registered.")
     
        } catch (error:any) {
            res.status(error.statusCode || 400).send(error.message || error.sqlMessage)
        }
    }


    getCommentsByPostId = async (req: Request, res: Response): Promise<void> => {
        try {
            const input: inputGetCommentsDTO = {
                postId: req.params.postId,
                token: req.headers.authorization as string
            }

            const result = await this.postBusiness.getCommentsByPostId(input)
            res.status(200).send(result)
     
        } catch (error:any) {
            res.status(error.statusCode || 400).send(error.message || error.sqlMessage)
        }
    }
}