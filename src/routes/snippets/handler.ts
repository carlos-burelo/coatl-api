import { Context } from 'hono'
import { Snippet } from "./model.ts"
import { SnippetI, SnippetInput, SnippetKey } from "./types.d.ts"
import { Order } from '../../shared/app.d.ts'

export const getSnippets = (ctx: Context) => {
  const { q, t, f, sortBy = 'updatedAt', order = 'desc' } = ctx.req.query()
  const $ = new Snippet()
  const snippets = $.sortBy(sortBy as SnippetKey, order as Order)
  const notFound = ctx.json({ message: 'No snippets found' }, 404)
  if (snippets.length === 0) return notFound

  if (q) {
    const result = $.find(q)
    if (result.length === 0) notFound
    return ctx.json(result)
  } else if (t) {
    const result = $.filterBy('tags', f)
    if (result.length === 0) notFound
    return ctx.json(result)
  } else if (f) {
    const result = $.filterBy('language', f)
    if (result.length === 0) notFound
    return ctx.json(result)
  } else {
    return ctx.json(snippets)
  }
}

export const getSnippet = (ctx: Context) => {
  const $ = new Snippet()
  const { id } = ctx.req.param()
  const snippet = $.get(id)
  if (snippet) {
    return ctx.json(snippet)
  } else {
    return ctx.json({ message: 'Snippet not found' }, 404)
  }
}

export const createSnippet = async (ctx: Context) => {
  const body = await ctx.req.json<SnippetInput>()
  const $ = new Snippet()
  const [valid, errors] = await Snippet.validate(body)
  if (!valid) {
    return ctx.json({ errors }, 400)
  } else {
    $.write(body)
    return ctx.json(valid)
  }
}

export const updateSnippet = async (ctx: Context) => {
  const body = await ctx.req.json<SnippetI>()
  const $ = new Snippet()
  const { id } = ctx.req.param()
  const [valid, errors] = await Snippet.validateUpdate(body)
  if (!valid) return ctx.json({ errors }, 400)
  const newSnippet = $.update(id, body)
  return ctx.json(newSnippet)
}

export const deleteSnippet = (ctx: Context) => {
  const $ = new Snippet()
  const { id } = ctx.req.param()
  const snippet = $.get(id)
  if (snippet) {
    $.delete(id)
    return ctx.json({ message: 'Snippet deleted' })
  } else {
    return ctx.json({ message: 'Snippet not found' }, 404)
  }
}