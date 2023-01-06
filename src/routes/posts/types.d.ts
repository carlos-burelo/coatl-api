import type { TimeStamps, Unique, WithContent } from "../../shared/app.d.ts"

export interface PostI extends TimeStamps, Unique, WithContent {
  title: string
  category: string
  tags: string[]
  tableOfContents: Section[]
  readTime: string
}

export interface Section {
  "#": { id: string; text: string }
  "+"?: Section[]
}

export type PostInput =
  & Omit<PostI, "createdAt" | "updatedAt" | "tableOfContents" | "readTime">
  & { id?: string }

export type PostKey = keyof PostI

export type PostInputRules = {
  [key in keyof PostInput]: any
}

export type PostIRules = {
  [key in keyof PostI]: any
}