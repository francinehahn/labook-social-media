import { CustomError } from "./CustomError"


export class MissingAuthorId extends CustomError {
    constructor () {
        super(422, "Provide the author id.")
    }
}

export class MissingPostId extends CustomError {
    constructor () {
        super(422, "Provide the post id.")
    }
}

export class MissingDescription extends CustomError {
    constructor () {
        super(422, "Provide the post description.")
    }
}

export class MissingPhotoUrl extends CustomError {
    constructor () {
        super(422, "Provide the photo url.")
    }
}

export class MissingPostType extends CustomError {
    constructor () {
        super(422, "Provide the post type.")
    }
}

export class InvalidPostType extends CustomError {
    constructor () {
        super(422, "The post type must be either 'normal' or 'event'.")
    }
}

export class PostIdNotFound extends CustomError {
    constructor () {
        super(404, "Post id not found.")
    }
}

export class DuplicateLike extends CustomError {
    constructor () {
        super(422, "The user can't like the same post twice.")
    }
}

export class InvalidDeslike extends CustomError {
    constructor () {
        super(422, "The user can't deslike a post that has not been liked before.")
    }
}

export class NoLikesFound extends CustomError {
    constructor () {
        super(422, "This post does not have any likes yet.")
    }
}

export class MissingComment extends CustomError {
    constructor () {
        super(422, "Provide the comment.")
    }
}

export class NoCommentsFound extends CustomError {
    constructor () {
        super(422, "This post does not have any comments yet.")
    }
}

