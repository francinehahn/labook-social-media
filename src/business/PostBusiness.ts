import { post, inputPostDTO, inputGetAllPostsDTO, feedPaginationDTO, inputGetPostByIdDTO } from "../models/post"
import { generateId } from "../services/generateId"
import { PostRepository } from "./PostRepository"
import { UserRepository } from "./UserRepository"
import { deleteLikeDTO, inputDeslikePostDTO, inputLikePostDTO, like } from "../models/like"
import { comment, inputCommentDTO, inputGetCommentsDTO } from "../models/comment"
import { CustomError } from "../errors/CustomError"
import { DuplicateLike, InvalidDeslike, InvalidPostType, MissingComment, MissingDescription, MissingPhotoUrl, MissingPostId, MissingPostType, NoCommentsFound, NoLikesFound, PostIdNotFound } from "../errors/PostError"
import { MissingToken, MissingUserId, UserIdNotFound } from "../errors/UserError"
import { Authenticator } from "../services/Authenticator"


export class PostBusiness {
    constructor(private postDatabase: PostRepository, private userDatabase: UserRepository) {}

    createPost = async (input: inputPostDTO): Promise<void> => {
        try {
            if (!input.token) {
                throw new MissingToken()
            }

            const authenticator = new Authenticator()
            const {id} = await authenticator.getTokenData(input.token)

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

            const postId: string = generateId()
            const newPost: post = {
                id: postId,
                photo: input.photo,
                description: input.description,
                type: input.type,
                created_at: new Date(),
                author_id: id
            }

            await this.postDatabase.createPost(newPost)
        
        } catch (error:any) {
            throw new CustomError(error.statusCode, error.message)
            
        }
    }


    getPostById = async (input: inputGetPostByIdDTO): Promise<post> => {
        try {
            if (!input.token) {
                throw new MissingToken()
            }

            const authenticator = new Authenticator()
            await authenticator.getTokenData(input.token)

            if (input.postId === ":postId") {
                throw new MissingPostId()
            }
            
            const result = await this.postDatabase.getPostById(input.postId)

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
            if (!input.token) {
                throw new MissingToken()
            }

            const authenticator = new Authenticator()
            await authenticator.getTokenData(input.token)

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
            if (!input.token) {
                throw new MissingToken()
            }

            const authenticator = new Authenticator()
            const {id} = await authenticator.getTokenData(input.token)

            if (input.postId === ":postId") {
                throw new MissingPostId()
            }

            const postIdExists = await this.postDatabase.getPostById(input.postId)
            if (!postIdExists) {
                throw new PostIdNotFound()
            }

            const duplicateLike = await this.postDatabase.getLikesByUserId(id)
            const filterDuplicatLike = duplicateLike.filter((item: like) => item.post_id === input.postId)
            if (filterDuplicatLike.length > 0) {
                throw new DuplicateLike()
            }

            const likeId = generateId()
            const newLike: like = {
                id: likeId,
                user_id: id,
                post_id: input.postId
            }

            await this.postDatabase.likeApost(newLike)

        } catch (error:any) {
            throw new CustomError(error.statusCode, error.message)
        }
    }


    deslikeApost = async (input: inputDeslikePostDTO): Promise<void> => {
        try {
            if (!input.token) {
                throw new MissingToken()
            }

            const authenticator = new Authenticator()
            const {id} = await authenticator.getTokenData(input.token)

            if (input.postId === ":postId") {
                throw new MissingPostId()
            }

            const postIdExists = await this.postDatabase.getPostById(input.postId)
            if (!postIdExists) {
                throw new PostIdNotFound()
            }

            const getLikesByUserId = await this.postDatabase.getLikesByUserId(id)
            const filterLikes = getLikesByUserId.filter((item: like) => item.post_id === input.postId)
            if (filterLikes.length === 0) {
                throw new InvalidDeslike()
            }

            const deleteLike: deleteLikeDTO = {
                id,
                postId: input.postId
            }

            await this.postDatabase.deslikeApost(deleteLike)

        } catch (error:any) {
            throw new CustomError(error.statusCode, error.message)
        }
    }


    getLikesByPostId = async (input: inputLikePostDTO): Promise<like[]> => {
        try {
            if (!input.token) {
                throw new MissingToken()
            }

            const authenticator = new Authenticator()
            await authenticator.getTokenData(input.token)

            if (input.postId === ":postId") {
                throw new MissingPostId()
            }

            const postIdExists = await this.postDatabase.getPostById(input.postId)
            if (!postIdExists) {
                throw new PostIdNotFound()
            }

            const result = await this.postDatabase.getLikesByPostId(input.postId)
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
            if (!input.token) {
                throw new MissingToken()
            }

            const authenticator = new Authenticator()
            const {id} = await authenticator.getTokenData(input.token)

            if (!input.comment) {
                throw new MissingComment()
            }
            if (input.postId === ":postId") {
                throw new MissingPostId()
            }

            const postIdExists = await this.postDatabase.getPostById(input.postId)
            if (!postIdExists) {
                throw new PostIdNotFound()
            }

            const commentId = generateId()
            const newComment: comment = {
                id: commentId,
                comment: input.comment,
                user_id: id,
                post_id: input.postId
            }

            await this.postDatabase.commentOnPost(newComment)

        } catch (error:any) {
            throw new CustomError(error.statusCode, error.message)
        }
    }


    getCommentsByPostId = async (input: inputGetCommentsDTO): Promise<comment[]> => {
        try {
            if (!input.token) {
                throw new MissingToken()
            }

            const authenticator = new Authenticator()
            await authenticator.getTokenData(input.token)

            if (input.postId === ":postId") {
                throw new MissingPostId()
            }

            const postIdExists = await this.postDatabase.getPostById(input.postId)
            if (!postIdExists) {
                throw new PostIdNotFound()
            }

            const result = await this.postDatabase.getCommentsByPostId(input.postId)
            if (result.length === 0) {
                throw new NoCommentsFound()
            }

            return result

        } catch (error:any) {
            throw new CustomError(error.statusCode, error.message)
        }
    }
}