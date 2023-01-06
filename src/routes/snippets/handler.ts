import { Context } from 'hono'
import { Order } from '../../shared/app.d.ts'
import { Snippet } from "./model.ts"
import { SnippetI, SnippetInput, SnippetKey } from "./types.d.ts"

export const getSnippets = async (ctx: Context) => {
  const { q, t, f, sortBy = 'updatedAt', order = 'desc' } = ctx.req.query()
  const $ = new Snippet()
  const snippets = await $.sortBy(sortBy as SnippetKey, order as Order)
  const notFound = ctx.json({ message: 'No snippets found' }, 404)
  if (snippets.length === 0) return notFound

  if (q) {
    const result = await $.find(q)
    if (result.length === 0) notFound
    return ctx.json(result)
  } else if (t) {
    const result = await $.filterBy('tags', f)
    if (result.length === 0) notFound
    return ctx.json(result)
  } else if (f) {
    const result = await $.filterBy('language', f)
    if (result.length === 0) notFound
    return ctx.json(result)
  } else {
    return ctx.json(snippets)
  }
}

export const getSnippet = async (ctx: Context) => {
  const $ = new Snippet()
  const { id } = ctx.req.param()
  const snippet = await $.get(id)
  if (!snippet) return ctx.json({ message: 'Snippet not found' }, 404)
  return ctx.json(snippet)

}

export const createSnippet = async (ctx: Context) => {
  const body = await ctx.req.json<SnippetInput>()
  const $ = new Snippet()
  const [valid, errors] = await Snippet.validate(body)
  if (!valid) return ctx.json({ errors }, 400)
  const result = $.write(body)
  if (!result) return ctx.json({ message: 'Snippet not created' }, 400)
  return ctx.json(result)
}

export const updateSnippet = async (ctx: Context) => {
  const body = await ctx.req.json<SnippetI>()
  const $ = new Snippet()
  const { id } = ctx.req.param()
  const [valid, errors] = await Snippet.validateUpdate(body)
  if (!valid) return ctx.json({ errors }, 400)
  const newSnippet = await $.update(id, body)
  if (!newSnippet) return ctx.json({ message: 'Snippet not found' }, 404)
  return ctx.json(newSnippet)
}

export const deleteSnippet = async (ctx: Context) => {
  const $ = new Snippet()
  const { id } = ctx.req.param()
  const snippet = await $.get(id)
  if (!snippet) return ctx.json({ message: 'Snippet not found' }, 404)
  const result = await $.delete(id)
  if (!result) return ctx.json({ message: 'Snippet not deleted' }, 400)
  return ctx.json({ message: 'Snippet deleted' })
}