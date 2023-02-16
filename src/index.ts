import { app } from "./app"
import { postRouter } from "./routes/postRouter"
import { userRouter } from "./routes/userRouter"

app.use("/users", userRouter)
app.use("/posts", postRouter)
