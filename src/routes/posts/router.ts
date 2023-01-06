import { Hono } from "hono"
import { createPost, getPost, getPosts, updatePost } from "./handler.ts"

const posts = new Hono()

posts.get("/", getPosts)
posts.post("/", createPost)
posts.get("/:id", getPost)
posts.put("/:id", updatePost)
posts.delete("/:id", updatePost)

export default posts
