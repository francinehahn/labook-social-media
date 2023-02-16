import { post, inputPostDTO, inputGetAllPostsDTO, feedPaginationDTO } from "../models/post"
import { generateId } from "../services/generateId"
import { PostRepository } from "./PostRepository"
import { UserRepository } from "./UserRepository"
import { inputLikePostDTO, like } from "../models/like"
import { comment, inputCommentDTO } from "../models/comment"
import { CustomError } from "../errors/CustomError"
import { DuplicateLike, InvalidDeslike, InvalidPostType, MissingAuthorId, MissingComment, MissingDescription, MissingPhotoUrl, MissingPostId, MissingPostType, NoCommentsFound, NoLikesFound, PostIdNotFound } from "../errors/PostError"
import { MissingUserId, UserIdNotFound } from "../errors/UserError"


export class PostBusiness {
    constructor(private postDatabase: PostRepository, private userDatabase: UserRepository) {}

    createPost = async (input: inputPostDTO): Promise<void> => {
        try {
            if (!input.authorId) {
                throw new MissingAuthorId()
            }

            if (!input.description) {
                throw new MissingDescription()
            }

            if (!input.photo) {
                throw new MissingPhotoUrl()
            }

            if (!input.type) {
                throw new MissingPostType()
            }

            if (input.type !== "normal" && input.type !== "event") {
                throw new InvalidPostType()
            }

            const userIdExists = await this.userDatabase.getUserById(input.authorId)
            if (!userIdExists) {
                throw new UserIdNotFound()
            }

            const id: string = generateId()
            const newPost: post = {
                id,
                photo: input.photo,
                description: input.description,
                type: input.type,
                created_at: new Date(),
                author_id: input.authorId
            }

            await this.postDatabase.createPost(newPost)
        
        } catch (error:any) {
            throw new CustomError(error.statusCode, error.message)
            
        }
    }


    getPostById = async (postId: string): Promise<post> => {
        try {
            if (postId === ":postId") {
                throw new MissingPostId()
            }
            
            const result = await this.postDatabase.getPostById(postId)

            if (!result) {
                throw new PostIdNotFound()
            }
     
            return result

        } catch (error:any) {
            throw new CustomError(error.statusCode, error.message)
        }
    }


    getAllPosts = async (input: inputGetAllPostsDTO): Promise<post[]> => {
        try {
            if (!input.page) {
                input.page = 1
            }
            if (!input.size) {
                input.page = 5
            }

            const offset = input.size * (input.page - 1)
            
            const inputAllPosts: feedPaginationDTO = {
                size: input.size,
                offset
            }

            return await this.postDatabase.getAllPosts(inputAllPosts)
            
        } catch (error:any) {
            throw new CustomError(error.statusCode, error.message)
        }
    }


    likeApost = async (input: inputLikePostDTO): Promise<void> => {
        try {
            if (!input.userId) {
                throw new MissingUserId()
            }
            if (input.postId === ":postId") {
                throw new MissingPostId()
            }
            
            const userIdExists = await this.userDatabase.getUserById(input.userId)
            if (!userIdExists) {
                throw new UserIdNotFound()
            }

            const postIdExists = await this.postDatabase.getPostById(input.postId)
            if (!postIdExists) {
                throw new PostIdNotFound()
            }

            const duplicateLike = await this.postDatabase.getLikesByUserId(input.userId)
            const filterDuplicatLike = duplicateLike.filter((item: like) => item.post_id === input.postId)
            if (filterDuplicatLike.length > 0) {
                throw new DuplicateLike()
            }

            const id = generateId()
            const newLike: like = {
                id,
                user_id: input.userId,
                post_id: input.postId
            }

            await this.postDatabase.likeApost(newLike)

        } catch (error:any) {
            throw new CustomError(error.statusCode, error.message)
        }
    }


    deslikeApost = async (input: inputLikePostDTO): Promise<void> => {
        try {
            if (!input.userId) {
                throw new MissingUserId()
            }
            if (input.postId === ":postId") {
                throw new MissingPostId()
            }
            
            const userIdExists = await this.userDatabase.getUserById(input.userId)
            if (!userIdExists) {
                throw new UserIdNotFound()
            }

            const postIdExists = await this.postDatabase.getPostById(input.postId)
            if (!postIdExists) {
                throw new PostIdNotFound()
            }

            const getLikesByUserId = await this.postDatabase.getLikesByUserId(input.userId)
            const filterLikes = getLikesByUserId.filter((item: like) => item.post_id === input.postId)
            if (filterLikes.length === 0) {
                throw new InvalidDeslike()
            }

            await this.postDatabase.deslikeApost(input)

        } catch (error:any) {
            throw new CustomError(error.statusCode, error.message)
        }
    }


    getLikesByPostId = async (postId: string): Promise<like[]> => {
        try {
            if (postId === ":postId") {
                throw new MissingPostId()
            }

            const postIdExists = await this.postDatabase.getPostById(postId)
            if (!postIdExists) {
                throw new PostIdNotFound()
            }

            const result = await this.postDatabase.getLikesByPostId(postId)
            if (result.length === 0) {
                throw new NoLikesFound()
            }

            return result

        } catch (error:any) {
            throw new CustomError(error.statusCode, error.message)
        }
    }


    commentOnPost = async (input: inputCommentDTO): Promise<void> => {
        try {
            if (!input.comment) {
                throw new MissingComment()
            }
            if (!input.userId) {
                throw new MissingUserId()
            }
            if (input.postId === ":postId") {
                throw new MissingPostId()
            }
            
            const userIdExists = await this.userDatabase.getUserById(input.userId)
            if (!userIdExists) {
                throw new UserIdNotFound()
            }

            const postIdExists = await this.postDatabase.getPostById(input.postId)
            if (!postIdExists) {
                throw new PostIdNotFound()
            }

            const id = generateId()
            const newComment: comment = {
                id,
                comment: input.comment,
                user_id: input.userId,
                post_id: input.postId
            }

            await this.postDatabase.commentOnPost(newComment)

        } catch (error:any) {
            throw new CustomError(error.statusCode, error.message)
        }
    }


    getCommentsByPostId = async (postId: string): Promise<comment[]> => {
        try {
            if (postId === ":postId") {
                throw new MissingPostId()
            }

            const postIdExists = await this.postDatabase.getPostById(postId)
            if (!postIdExists) {
                throw new PostIdNotFound()
            }

            const result = await this.postDatabase.getCommentsByPostId(postId)
            if (result.length === 0) {
                throw new NoCommentsFound()
            }

            return result

        } catch (error:any) {
            throw new CustomError(error.statusCode, error.message)
        }
    }
}