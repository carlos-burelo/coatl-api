import { PostI, PostInput, PostIRules, PostInputRules } from "./types.d.ts"
import { isString, isOptional, required, validate, validateArray } from "validasaur"
import { Storage } from "../../shared/storage.ts"
import { Builder } from "../../shared/builder.ts"

export class Post extends Storage<PostI> {

  #builder = new Builder();

  constructor() {
    super("posts")
  }

  static validate (data: PostInput) {
    const rules: PostInputRules = {
      id: [isOptional, isString],
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
      id: [isOptional, isString],
      title: [isOptional, isString],
      content: [isOptional, isString],
      description: [isOptional, isString],
      category: [isOptional, isString],
      tags: validateArray(false, [isString]),
      createdAt: [isOptional],
      updatedAt: [isOptional],
      readTime: [isOptional],
      tableOfContents: [isOptional],
    }
    return validate(data, rules)
  }

  write (data: PostInput) {
    const payload: PostI = {
      ...this.#builder.build(data),
      tableOfContents: this.#builder.generateTableOfContents(data.content),
    }

    this.create(payload.id, payload)
  }
}
