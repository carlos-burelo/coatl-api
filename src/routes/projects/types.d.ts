import { TimeStamps, Unique, WithContent } from "../../shared/app.d.ts"

export interface ProjectI extends TimeStamps, Unique, WithContent {
  title: string
  image: string
  preview?: string
  category: string
  repository: string
  stack: Stack
  tags: string[],
  pkg?: Pkg
}

export interface Stack {
  [language: string]: number
}

export interface Pkg {
  name: string
  version?: string
  url?: string
}

export type ProjectInput = Omit<ProjectI, "id" | "createdAt" | "updatedAt"> & {
  id?: string
}

export type ProjectKey = keyof ProjectI

export type ProjectInputRules = {
  [key in keyof ProjectInput]: any
}
export type ProjectIRules = {
  [key in keyof ProjectI]: any
}