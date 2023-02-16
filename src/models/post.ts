enum POST_TYPES {
    NORMAL = "normal",
    EVENT = "event"
}
 
export type post = {
    id: string,
    photo: string,
    description: string,
    type: POST_TYPES,
    created_at: Date,
    author_id: string
}

export interface inputPostDTO {
    photo: string,
    description: string,
    type: POST_TYPES,
    token: string
}

export interface inputGetAllPostsDTO {
    page: number,
    size: number,
    token: string
}

export interface inputGetPostByIdDTO {
    postId: string,
    token: string
}

export interface feedPaginationDTO {
    size: number,
    offset: number
}