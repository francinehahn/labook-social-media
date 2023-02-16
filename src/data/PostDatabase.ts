import { PostRepository } from "../business/PostRepository"
import { BaseDatabase } from "../data/BaseDatabase"
import { CustomError } from "../errors/CustomError"
import { comment } from "../models/comment"
import { like, inputLikePostDTO } from "../models/like"
import { feedPaginationDTO, post } from "../models/post"


export class PostDatabase extends BaseDatabase implements PostRepository {
    TABLE = "labook_posts"

    createPost = async (newPost: post): Promise<void> => {
        try {
            await BaseDatabase.connection(this.TABLE).insert(newPost)
        
        } catch (error:any) {
            throw new CustomError(error.statusCode, error.message)
            
        }
    }


    getPostById = async (id: string): Promise<any> => {
        try {
            const result = await BaseDatabase.connection(this.TABLE).select().where({ id })
            return result[0]

        } catch (error:any) {
            throw new CustomError(error.statusCode, error.message)
        }
    }


    getAllPosts = async (pagination: feedPaginationDTO): Promise<post[]> => {
        try {
            return await BaseDatabase.connection(this.TABLE).select().orderBy("created_at", "desc").limit(pagination.size).offset(pagination.offset)
     
        } catch (error:any) {
            throw new CustomError(error.statusCode, error.message)
        }
    }


    likeApost = async (newLike: like): Promise<void> => {
        try {
            await BaseDatabase.connection("labook_likes").insert(newLike)
     
        } catch (error:any) {
            throw new CustomError(error.statusCode, error.message)
        }
    }


    deslikeApost = async (input: inputLikePostDTO): Promise<void> => {
        try {
            await BaseDatabase.connection("labook_likes").where({user_id: input.userId, post_id: input.postId}).delete()
     
        } catch (error:any) {
            throw new CustomError(error.statusCode, error.message)
        }
    }


    getLikesByPostId = async (postId: string): Promise<like[]> => {
        try {
            return await BaseDatabase.connection("labook_likes").select().where("post_id", postId)
     
        } catch (error:any) {
            throw new CustomError(error.statusCode, error.message)
        }
    }


    getLikesByUserId = async (userId: string): Promise<any> => {
        try {
            return await BaseDatabase.connection("labook_likes").select().where("user_id", userId)
     
        } catch (error:any) {
            throw new CustomError(error.statusCode, error.message)
        }
    }


    commentOnPost = async (newComment: comment): Promise<void> => {
        try {
            await BaseDatabase.connection("labook_comments").insert(newComment)
     
        } catch (error:any) {
            throw new CustomError(error.statusCode, error.message)
        }
    }


    getCommentsByPostId = async (postId: string): Promise<comment[]> => {
        try {
            return await BaseDatabase.connection("labook_comments").select().where("post_id", postId)
     
        } catch (error:any) {
            throw new CustomError(error.statusCode, error.message)
        }
    }
}