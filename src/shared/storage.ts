import { resolve } from "std:path"
import type { Order } from './app.d.ts'

export class Database<T> {
  #collection: string
  #DBPath: string = resolve(Deno.cwd(), "./db.json")
  constructor(collection: string) {
    this.#collection = collection
  }

  static async init<T> (collections: string[]) {
    const absolutePath = resolve(Deno.cwd(), "./db.json")
    try {
      await Deno.stat(absolutePath)
      return
    } catch (error) {
      if (error instanceof Deno.errors.NotFound) {
        const encoder = new TextEncoder()
        const collectionMap: Record<string, object> = {}
        collections.forEach((collection) => {
          collectionMap[collection] = {}
        })
        const raw = encoder.encode(JSON.stringify(collectionMap))
        await Deno.writeFile(absolutePath, raw)
      }
    }
  }

  async #exist (document: string): Promise<boolean> {
    const decoder = new TextDecoder("utf-8")
    const raw = await Deno.readFile(this.#DBPath)
    const data = JSON.parse(decoder.decode(raw))
    return data[this.#collection][document] !== undefined
  }

  async #writeFile (data: unknown) {
    const encoder = new TextEncoder()
    const raw = encoder.encode(JSON.stringify(data))
    Deno.writeFile(this.#DBPath, raw)
  }

  async getAll (): Promise<T[]> {
    const decoder = new TextDecoder("utf-8")
    const raw = await Deno.readFile(this.#DBPath)
    const data = JSON.parse(decoder.decode(raw))
    console.log({ data, collection: this.#collection })
    const documents = data[this.#collection]
    console.log(documents)
    const result: T[] = []
    for (const document in documents) {
      result.push(documents[document])
    }
    return result
  }

  async get (document: string): Promise<T | null> {
    const decoder = new TextDecoder("utf-8")
    const raw = await Deno.readFile(this.#DBPath)
    const data = JSON.parse(decoder.decode(raw))
    return data[this.#collection][document] || null
  }

  async create (document: string, data: T) {
    if (await this.#exist(document)) {
      return false
    }
    const decoder = new TextDecoder("utf-8")
    const raw = await Deno.readFile(this.#DBPath)
    const db = JSON.parse(decoder.decode(raw))
    db[this.#collection][document] = data
    await this.#writeFile(db)
    return true
  }

  async update (document: string, data: Partial<T>): Promise<T | null> {
    if (!await this.#exist(document)) {
      return null
    }
    const decoder = new TextDecoder("utf-8")
    const raw = await Deno.readFile(this.#DBPath)
    const db = JSON.parse(decoder.decode(raw))
    const newUpdatedAt = new Date().toISOString()
    const newData = { ...db[this.#collection][document], ...data, updatedAt: newUpdatedAt }
    db[this.#collection][document] = newData
    await this.#writeFile(db)
    return newData
  }

  async mutate (document: string, data: T) {
    if (!await this.#exist(document)) {
      return false
    }
    const decoder = new TextDecoder("utf-8")
    const raw = await Deno.readFile(this.#DBPath)
    const db = JSON.parse(decoder.decode(raw))
    db[this.#collection][document] = data
    await this.#writeFile(db)
    return true
  }

  async delete (document: string) {
    if (!await this.#exist(document)) {
      return false
    }
    const decoder = new TextDecoder("utf-8")
    const raw = await Deno.readFile(this.#DBPath)
    const db = JSON.parse(decoder.decode(raw))
    delete db[this.#collection][document]
    await this.#writeFile(db)
    return true
  }

  async deleteAll () {
    const decoder = new TextDecoder("utf-8")
    const raw = await Deno.readFile(this.#DBPath)
    const db = JSON.parse(decoder.decode(raw))
    db[this.#collection] = {}
    await this.#writeFile(db)
    return true
  }

  // filtering

  async filterBy (field: keyof T, value: T[keyof T]): Promise<T[]> {
    const collection = await this.getAll()
    return collection.filter((item) =>
      item[field] === value || (<Array<any>>item[field]).includes(value)
    )
  }
  // searching
  async find (query: string): Promise<T[]> {
    const queryString = query.toLowerCase()
    const collections = await this.getAll()
    return collections.filter((item) => {
      const itemString = JSON.stringify(item).toLowerCase()
      return itemString.includes(queryString)
    })
  }

  // sorting
  async sortBy (field: keyof T, order: Order = "asc"): Promise<T[]> {
    const collection = await this.getAll()
    console.log(collection)
    return collection.sort((a, b) => {
      if (order === "asc") {
        return a[field] > b[field] ? 1 : -1
      } else {
        return a[field] < b[field] ? 1 : -1
      }
    })
  }

  // pagination
  async paginate (page: number, limit: number): Promise<T[]> {
    const collection = await this.getAll()
    const start = (page - 1) * limit
    const end = start + limit
    return collection.slice(start, end)
  }

  // count
  async count (): Promise<number> {
    const collection = await this.getAll()
    return collection.length
  }

}