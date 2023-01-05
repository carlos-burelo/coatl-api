import { Hono } from "hono";
import posts from "./routes/posts/router.ts";

const app = new Hono();

app.route("/posts", posts);

export default app;
