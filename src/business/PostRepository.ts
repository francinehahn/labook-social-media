import { comment } from "../models/comment"
import { like, deleteLikeDTO } from "../models/like"
import { feedPaginationDTO, post } from "../models/post"


export interface PostRepository {
    createPost (newPost: post): Promise<void>
    getAllPosts (pagination: feedPaginationDTO): Promise<post[]>
    getPostById (id: string): Promise<post>
    likeApost (newLike: like): Promise<void>
    deslikeApost (deleteLike: deleteLikeDTO): Promise<void>
    getLikesByPostId (postId: string): Promise<like[]>
    getLikesByUserId (userId: string): Promise<any>
    commentOnPost (newComment: comment): Promise<void>
    getCommentsByPostId (postId: string): Promise<comment[]>
}