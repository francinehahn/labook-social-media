import { CustomError } from "./CustomError"

export class Unauthorized extends CustomError {
    constructor () {
        super(401, "Unauthorized user.")
    }
}

export class MissingToken extends CustomError {
    constructor () {
        super(422, "Provide the token.")
    }
}

export class MissingName extends CustomError {
    constructor () {
        super(422, "Provide the user name.")
    }
}

export class MissingEmail extends CustomError {
    constructor () {
        super(422, "Provide the email.")
    }
}

export class InvalidEmail extends CustomError {
    constructor () {
        super(422, "Invalid email.")
    }
}

export class EmailNotFound extends CustomError {
    constructor () {
        super(404, "Email not found.")
    }
}

export class MissingPassword extends CustomError {
    constructor () {
        super(422, "Provide the password.")
    }
}

export class InvalidPassword extends CustomError {
    constructor () {
        super(422, "The password must have at least 6 characters.")
    }
}

export class IncorrectPassword extends CustomError {
    constructor () {
        super(422, "Incorrect password.")
    }
}

export class DuplicateEmail extends CustomError {
    constructor () {
        super(422, "E-mail already in use.")
    }
}

export class MissingUserId extends CustomError {
    constructor () {
        super(422, "Provide the user id.")
    }
}

export class UserIdNotFound extends CustomError {
    constructor () {
        super(404, "User id not found.")
    }
}

export class MissingFriendId extends CustomError {
    constructor () {
        super(422, "Provide the friend id.")
    }
}

export class FriendIdNotFound extends CustomError {
    constructor () {
        super(404, "Friend id not found.")
    }
}

export class DuplicateId extends CustomError {
    constructor () {
        super(422, "The user cannot add or delete himself/herself.")
    }
}

export class CantAddFriend extends CustomError {
    constructor () {
        super(422, "It is not possible to add a user who is already a friend.")
    }
}

export class CantDeleteFriend extends CustomError {
    constructor () {
        super(422, "It is not possible to delete a user who is not a friend.")
    }
}

export class NoFriendsFound extends CustomError {
    constructor () {
        super(404, "The user has no friends yet.")
    }
}

export class MissingSearchTerm extends CustomError {
    constructor () {
        super(422, "Provide a search term.")
    }
}

export class NoUsersFound extends CustomError {
    constructor () {
        super(404, "No users have been found with the given search parameters.")
    }
}