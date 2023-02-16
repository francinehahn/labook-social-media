export type like = {
    id: string,
    user_id: string,
    post_id: string
}

export interface inputLikePostDTO {
    postId: string,
    token: string
}

export interface inputDeslikePostDTO {
    postId: string,
    token: string
}

export interface deleteLikeDTO {
    id: string,
    postId: string
}