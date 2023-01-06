import { Context } from 'hono'
import { Order } from "../../shared/app.d.ts"
import { Project } from './model.ts'
import { ProjectI, ProjectInput, ProjectKey } from './types.d.ts'

export const getAllProjects = (ctx: Context) => {
  const $ = new Project()
  const { q, t, f, sortBy = 'updatedAt', order = 'desc' } = ctx.req.query()
  const projects = $.sortBy(sortBy as ProjectKey, order as Order)
  const notFound = ctx.json({ message: 'No projects found' }, 404)
  if (projects.length === 0) return notFound

  if (q) {
    const result = $.find(q)
    if (result.length === 0) notFound
    return ctx.json(result)
  } else if (t) {
    const result = $.filterBy('tags', f)
    if (result.length === 0) notFound
    return ctx.json(result)
  } else if (f) {
    const result = $.filterBy('category', f)
    if (result.length === 0) notFound
    return ctx.json(result)
  } else {
    return ctx.json(projects)
  }
}
export const getProject = (ctx: Context) => {
  const $ = new Project()
  const { id } = ctx.req.param()
  const project = $.get(id)
  if (project) {
    return ctx.json(project)
  } else {
    return ctx.json({ message: 'Project not found' }, 404)
  }
}
export const createProject = async (ctx: Context) => {
  const body = await ctx.req.json<ProjectInput>()
  const $ = new Project()
  const [valid, errors] = await Project.validate(body)
  if (!valid) {
    return ctx.json({ errors }, 400)
  } else {
    const result = await $.write(body)
    return ctx.json(result)
  }
}
export const updateProject = async (ctx: Context) => {
  const body = await ctx.req.json<ProjectI>()
  const { id } = ctx.req.param()
  const $ = new Project()
  const [valid, errors] = await Project.validateUpdate(body)
  if (!valid) return ctx.json({ errors }, 400)
  const newProject = $.update(id, body)
  return ctx.json(newProject)
}
export const deleteProject = (ctx: Context) => {
  const $ = new Project()
  const { id } = ctx.req.param()
  const project = $.delete(id)
  if (project) {
    $.delete(id)
    return ctx.json(project)
  } else {
    return ctx.json({ message: 'Project not found' }, 404)
  }
}