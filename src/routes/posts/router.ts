import { Hono } from "hono";
import { createPost, getPosts } from "./handler.ts";

const posts = new Hono();

posts.get("/", getPosts);
posts.post("/", createPost);

export default posts;
