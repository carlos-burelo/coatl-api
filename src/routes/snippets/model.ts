import { isOptional, isString, required, validate, validateArray } from "validasaur"
import { Builder } from "../../shared/builder.ts"
import { Database } from "../../shared/storage.ts"
import { SnippetI, SnippetInput, SnippetInputRules, SnippetIRules } from "./types.d.ts"

export class Snippet extends Database<SnippetI> {

  #builder = new Builder();

  constructor() {
    super("snippets")
  }

  static validate (data: SnippetInput) {
    const rules: SnippetInputRules = {
      content: [required, isString],
      title: [required, isString],
      description: [isString],
      tags: validateArray(true, [required, isString]),
      language: [required, isString],
      id: [isString],
    }
    return validate(data, rules)
  }

  static validateUpdate (data: SnippetInput) {
    const rules: SnippetIRules = {
      content: [isString],
      title: [isString],
      description: [isString],
      tags: validateArray(true, [isString]),
      language: [isString],
      id: [isString],
      createdAt: [isString],
      updatedAt: [isString]
    }
    return validate(data, rules)
  }

  write (data: SnippetInput) {
    const payload: SnippetI = {
      ...this.#builder.build(data),
    }
    const result = this.create(payload.id, payload)
    if (!result) return null
    return payload
  }

}