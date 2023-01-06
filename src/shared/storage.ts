import { resolve } from "std:path"

export class Storage<T> {
  #storagePath: string = resolve(Deno.cwd(), "./db");

  #exist (path: string, match: "file" | "directory" = "directory"): boolean {
    try {
      return Deno.statSync(path).isDirectory === (match === "directory")
    } catch {
      return false
    }
  }

  #filePath (collection: string, document: string): string {
    const relativePath = `./${collection}/${document}.json`
    return resolve(this.#storagePath, relativePath)
  }
  #folderPath (collection: string): string {
    return resolve(this.#storagePath, `./${collection}`)
  }

  #writeFile (path: string, data: unknown) {
    if (this.#exist(path, "file")) return
    const encoder = new TextEncoder()
    const raw = encoder.encode(JSON.stringify(data))
    console.log(raw)
    Deno.writeFileSync(path, raw)
  }

  #overwriteFile (path: string, data: unknown) {
    if (!this.#exist(path, "file")) return
    const encoder = new TextEncoder()
    const raw = encoder.encode(JSON.stringify(data))
    Deno.writeFileSync(path, raw)
  }

  #writeFolder (path: string) {
    if (this.#exist(path, "directory")) return
    Deno.mkdirSync(path)
  }

  #readAllDocuments (path: string): T[] {
    const paths = Deno.readDirSync(path)
    const absolutePaths = []
    for (const path of paths) {
      if (path.isFile) {
        const payload = this.#readDocument(
          this.#filePath(this.collection, path.name.replace(".json", "")),
        )
        absolutePaths.push(payload)
      }
    }
    return absolutePaths
  }

  #readDocument (path: string): T {
    const decoder = new TextDecoder("utf-8")
    const raw = Deno.readFileSync(path)
    return JSON.parse(decoder.decode(raw))
  }

  constructor(private readonly collection: string) {
    const collectionPath = this.#folderPath(collection)
    if (!this.#exist(this.#storagePath)) {
      this.#writeFolder(this.#storagePath)
    }
    if (!this.#exist(collectionPath)) {
      this.#writeFolder(collectionPath)
    }
  }

  getAll (): T[] {
    const collectionPath = this.#folderPath(this.collection)
    return this.#readAllDocuments(collectionPath)
  }

  get (document: string): T | null {
    const documentPath = this.#filePath(this.collection, document)
    if (this.#exist(documentPath, "file")) {
      return this.#readDocument(documentPath)
    } else {
      return null
    }
  }

  create (document: string, data: T) {
    if (this.#exist(this.#filePath(this.collection, document), "file")) {
      return false
    }
    this.#writeFile(this.#filePath(this.collection, document), data)
    return true
  }

  update (document: string, data: Partial<T>) {
    const filePath = this.#filePath(this.collection, document)
    const newDate = new Date().toISOString()
    if (!this.#exist(filePath, "file")) {
      return null
    } else {
      const oldData = this.#readDocument(filePath)
      const newData = { ...oldData, ...data, updatedAt: newDate }
      this.#overwriteFile(filePath, newData)
      return newData
    }
  }

  mutate (document: string, data: T) {
    const filePath = this.#filePath(this.collection, document)
    if (!this.#exist(filePath, "file")) {
      return false
    }
    this.#writeFile(filePath, data)
  }

  delete (document: string) {
    const filePath = this.#filePath(this.collection, document)
    if (!this.#exist(filePath, "file")) {
      return false
    }
    Deno.removeSync(filePath)
  }

  deleteAll () {
    const collectionPath = this.#folderPath(this.collection)
    if (!this.#exist(collectionPath, "directory")) {
      return false
    }
    Deno.removeSync(collectionPath, { recursive: true })
  }

  // filtering
  filterBy (field: keyof T, value: T[keyof T]): T[] {
    const collection = this.getAll()
    return collection.filter((item) =>
      item[field] === value || (<Array<any>>item[field]).includes(value)
    )
  }

  find (query: string): T[] {
    const queryString = query.toLowerCase()
    const collection = this.getAll()
    return collection.filter((item) => {
      const itemString = JSON.stringify(item).toLowerCase()
      return itemString.includes(queryString)
    })
  }

  // sorting
  sortBy (field: keyof T, order: "asc" | "desc" = "asc"): T[] {
    const collection = this.getAll()
    return collection.sort((a, b) => {
      if (order === "asc") {
        return a[field] > b[field] ? 1 : -1
      } else {
        return a[field] < b[field] ? 1 : -1
      }
    })
  }

  // pagination
  paginate (page: number, limit: number): T[] {
    const collection = this.getAll()
    const start = (page - 1) * limit
    const end = start + limit
    return collection.slice(start, end)
  }

  // count
  count (): number {
    const collection = this.getAll()
    return collection.length
  }

  // distinct
  distinct (field: keyof T): T[keyof T][] {
    const collection = this.getAll()
    const values = collection.map((item) => item[field])
    return [...new Set(values)]
  }
}
