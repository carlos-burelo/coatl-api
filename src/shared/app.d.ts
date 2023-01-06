export interface TimeStamps {
  createdAt: string
  updatedAt: string
}

export interface Unique {
  id: string
}

export interface WithContent {
  content: string
  description: string
}

export type Order = "asc" | "desc"
