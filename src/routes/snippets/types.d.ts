import type { WithContent, Unique, TimeStamps } from "../../shared/app.d.ts"

export interface SnippetI extends WithContent, Unique, TimeStamps {
  title: string
  tags: string[]
  language: string
}

export type SnippetInput = Omit<SnippetI, "createdAt" | "updatedAt"> & { id?: string }

export type SnippetKey = keyof SnippetI

export type SnippetIRules = {
  [key in SnippetKey]: any
}

export type SnippetInputRules = {
  [key in keyof SnippetInput]: any
}