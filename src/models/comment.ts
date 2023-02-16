export type comment = {
    id: string,
    comment: string,
    user_id: string,
    post_id: string
}

export interface inputCommentDTO {
    comment: string,
    postId: string,
    token: string
}

export interface inputGetCommentsDTO {
    postId: string,
    token: string
}