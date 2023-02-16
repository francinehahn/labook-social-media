import { connection } from "./connection"


const createTables = () => connection.raw(`
    CREATE TABLE IF NOT EXISTS labook_users (
        id CHAR(36) NOT NULL PRIMARY KEY,
        name VARCHAR(120) NOT NULL,
        email VARCHAR(120) NOT NULL UNIQUE,
        password VARCHAR(120) NOT NULL
    );

    CREATE TABLE IF NOT EXISTS labook_posts (
        id CHAR(36) NOT NULL PRIMARY KEY,
        photo VARCHAR(255) NOT NULL,
        description VARCHAR(255) NOT NULL,
        type ENUM("normal", "event") DEFAULT "normal",
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        author_id CHAR(36) NOT NULL,
        FOREIGN KEY (author_id) REFERENCES labook_users(id)
    );

    CREATE TABLE IF NOT EXISTS labook_friends (
        id CHAR(36) NOT NULL PRIMARY KEY,
        user_id CHAR(36) NOT NULL,
        friend_id CHAR(36) NOT NULL,
        FOREIGN KEY (user_id) REFERENCES labook_users(id),
        FOREIGN KEY (friend_id) REFERENCES labook_users(id)
    );

    CREATE TABLE IF NOT EXISTS labook_likes (
        id CHAR(36) NOT NULL PRIMARY KEY,
        user_id CHAR(36) NOT NULL,
        post_id CHAR(36) NOT NULL,
        FOREIGN KEY (user_id) REFERENCES labook_users(id),
        FOREIGN KEY (post_id) REFERENCES labook_posts(id)
    );

    CREATE TABLE IF NOT EXISTS labook_comments (
        id CHAR(36) NOT NULL PRIMARY KEY,
        comment VARCHAR(255) NOT NULL,
        user_id CHAR(36) NOT NULL,
        post_id CHAR(36) NOT NULL,
        FOREIGN KEY (user_id) REFERENCES labook_users(id),
        FOREIGN KEY (post_id) REFERENCES labook_posts(id)
    );
`).then(() => console.log("Tabelas criadas.")).catch(err => console.log(err.message || err.sqlMessage))

createTables().then(() => connection.destroy())