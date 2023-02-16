export type friend = {
    id: String,
    user_id: string,
    friend_id: string
}

export interface inputFriendDataDTO {
    friendId: string,
    token: string
}

export interface deleteFriendDTO {
    id: string,
    friendId: string
}

export interface getFriendsByUserIdDTO {
    userId: string,
    token: string
}