# Social Media - Labook
This API Rest was developed to simulate a social media and to practice data architecture, typescript, node.js, mySQL, custom errors, authentication and cryptography.

## Documentation
https://documenter.getpostman.com/view/22375317/2s935mr528

## Endpoints
- Signup
- Login
- Add User As A Friend
- Delete User As A Friend
- Search Users
- Get Friends By User Id
- Get User By Id
- Create Post
- Get Post By Id
- Get All Posts
- Like A Post
- Deslike A Post
- Get Likes By Post Id
- Comment On A Post
- Get Comments By Post Id

## Technologies
- Typescript
- Node.js
- Knex.js
- Express.js
- MySQL

## 🛰Running the project
<pre>
  <code>git clone https://github.com/francinehahn/labook-social-media.git</code>
</pre>

<pre>
  <code>cd labook-social-media</code>
</pre>

<pre>
  <code>npm install</code>
</pre>

Create a file .env and complete the following variables:
<pre>
  <code>
    DB_HOST = ""
    DB_USER = ""
    DB_PASS = ""
    DB_NAME = ""

    PORT = 3003
    BCRYPT_COST = 12
    JWT_KEY = "labook"
  </code>
</pre>

To add the tables to your database, run the following command:
<pre>
  <code>npm run migrations</code>
</pre>

To initialize the project:
<pre>
  <code>npm run start</code>
</pre>

Finally, you can use Postman or another similar tool to test the endpoints.
