# Chat App Server

The server is responsible for handling the chat messages and user authentication. The server is built with ExpressJs and uses Mongoose to interact with MongoDB. The server uses Socket.io to handle the realtime chat messages.

### [Deployed Link](https://chat-app-server-cfig.onrender.com)

## Technology

- NodeJs
- ExpressJs
- Mongoose
- Socket.io
- Typescript

## Run the project in your local mechine

### Requirements

- Node Js (Make sure you have node js installed on your mechine).
- MongoDB Compass (optional: if you want to use mongodb localy).

### Installation

1. Clone this repo:
   - `git clone https://github.com/NaZmuZ-SaKiB/chat-app-server.git`
2. Install all necessary dependencies:
   - `cd chat-app-server`
   - `npm install` or `yarn`
3. Create a `.env` file in current directory and add following properties:

   - `NODE_ENV` = development/ production
   - `PORT` = (any port number)
   - `DATABASE_URL` = (your database url for connection)
   - `BCRYPT_SALT_ROUNDS` = 12
   - `FRONT_END_URL` = front end url
   - `JWT_ACCESS_SECRET` = secret for jwt
   - `JWT_ACCESS_EXPIRES_IN` = jwt expire time
   - `AVATAR_URL` = https://avatar.iran.liara.run/public

4. Run the development server using following command:
   - `npm run dev` or `yarn dev`
5. To build the project run following command:
   - `npm run build` or `yarn build`
6. To run the build version of the project run following command:

   - `npm run start` or `yarn start`

### Endpoints

- **POST /api/auth/sign-in** : User login.
- **POST /api/auth/sign-up** : User registraion.
- **GET /api/auth/me** : Get logged in user.
- **PATCH /api/auth/change-password** : Update Password.
- **GET /api/user** : Search user by `searchTerm` query.
- **GET /api/user/:id** : Get user by id.
- **GET /api/user/sidebar** : Get items for auth user's sidebar conversations.
- **GET /api/user/conversation/:conversationId** : Get the other user of the conversation.
- **PATCH /api/user** : Update user info.
- **GET /api/message/:conversationId** : Get conversation messages.
- **POST /api/message/:conversationId** : Add new message.
- **PATCH /api/message/:id/seen** : Seen a message.
- **GET /api/conversation/:recipientId** : Get conversation with other user.
- **POST /api/conversation/start/:recipientId** : Create a new conversation with other user.

### Deployment

1. Push the project in github.
2. Go to render.com and create a new account or login.
3. Go to Dashboard and click on new project and select the github repository.
4. change build command to `yarn install && yarn build`.
5. Change start command to `yarn start`.
