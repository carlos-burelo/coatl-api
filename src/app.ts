import { Hono } from "hono"
import posts from "./routes/posts/router.ts"
import projects from "./routes/projects/router.ts"
import snippets from "./routes/snippets/router.ts"

const app = new Hono()

app.route("/posts", posts)
app.route("/projects", projects)
app.route("/snippets", snippets)

export default app
