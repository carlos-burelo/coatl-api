import { Hono } from "hono"
import { createProject, deleteProject, getAllProjects, getProject, updateProject } from "./handler.ts"

const projects = new Hono()

projects.get("/", getAllProjects)
projects.post("/", createProject)

projects.get("/:id", getProject)
projects.put("/:id", updateProject)
projects.delete("/:id", deleteProject)

export default projects