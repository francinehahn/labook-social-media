export type comment = {
    id: string,
    comment: string,
    user_id: string,
    post_id: string
}

export interface inputCommentDTO {
    comment: string,
    userId: string,
    postId: string
}