import { isString, required, validate, isOptional, validateArray } from "validasaur"
import { Builder } from "../../shared/builder.ts"
import { Database } from "../../shared/storage.ts"
import { PostI, PostInput, PostInputRules, PostIRules } from "./types.d.ts"

export class Post extends Database<PostI> {

  #builder = new Builder();

  constructor() {
    super("posts")
  }

  static validate (data: PostInput) {
    const rules: PostInputRules = {
      id: [isString],
      title: [required, isString],
      content: [required, isString],
      description: [required, isString],
      category: [required, isString],
      tags: validateArray(true, [isString]),
    }

    return validate(data, rules)
  }
  static validateUpdate (data: PostI) {
    const rules: PostIRules = {
      id: [isString],
      title: [isString],
      content: [isString],
      description: [isString],
      category: [isString],
      tags: validateArray(false, [isString]),
      createdAt: [isString],
      updatedAt: [isString],
      readTime: [isString],
      tableOfContents: [isOptional]
    }
    return validate(data, rules)
  }

  async write (data: PostInput): Promise<PostI | null> {
    const payload: PostI = {
      ...this.#builder.build(data),
      tableOfContents: this.#builder.generateTableOfContents(data.content),
    }

    const result = await this.create(payload.id, payload)
    if (!result) return null
    return payload
  }
}
