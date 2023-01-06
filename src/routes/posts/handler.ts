import { Context } from "hono"
import { Order } from "../../shared/app.d.ts"
import { Post } from "./model.ts"
import { PostI, PostInput, PostKey } from "./types.d.ts"

export const getPosts = (ctx: Context) => {
  const { q, t, f, sortBy = "updatedAt", order = "desc" } = ctx.req.query()
  const $ = new Post()
  const posts = $.sortBy(sortBy as PostKey, order as Order)
  const notFound = ctx.json({ message: "No posts found" }, 404)
  if (posts.length === 0) return notFound

  if (q) {
    const result = $.find(q)
    if (result.length === 0) notFound
    return ctx.json(result)
  } else if (t) {
    const result = $.filterBy("tags", f)
    if (result.length === 0) notFound
    return ctx.json(result)
  } else if (f) {
    const result = $.filterBy("category", f)
    if (result.length === 0) notFound
    return ctx.json(result)
  } else {
    return ctx.json(posts)
  }
}
export const getPost = (ctx: Context) => {
  const $ = new Post()
  const { id } = ctx.req.param()
  const post = $.get(id)
  if (post) {
    return ctx.json(post)
  } else {
    return ctx.json({ message: "Post not found" }, 404)
  }
}
export const createPost = async (ctx: Context) => {
  const body = await ctx.req.json<PostInput>()
  const $ = new Post()
  const [valid, errors] = await Post.validate(body)
  if (!valid) {
    return ctx.json({ errors }, 400)
  } else {
    $.write(body)
    return ctx.json(valid)
  }
}
export const updatePost = async (ctx: Context) => {
  const body = await ctx.req.json<PostI>()
  const $ = new Post()
  const { id } = ctx.req.param()
  const [valid, errors] = await Post.validateUpdate(body)
  if (!valid) return ctx.json({ errors }, 400)
  const newPost = $.update(id, body)
  return ctx.json(newPost)
}
export const deletePost = (ctx: Context) => {
  const $ = new Post()
  const { id } = ctx.req.param()
  const post = $.get(id)
  if (post) {
    $.delete(id)
    return ctx.json({ message: "Post deleted" })
  } else {
    return ctx.json({ message: "Post not found" }, 404)
  }
}