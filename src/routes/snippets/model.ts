import { Storage } from "../../shared/storage.ts"
import { Builder } from "../../shared/builder.ts"
import { SnippetI, SnippetInput, SnippetIRules, SnippetInputRules } from "./types.d.ts"
import { isString, isOptional, required, validate, validateArray } from "validasaur"

export class Snippet extends Storage<SnippetI> {

  #builder = new Builder();

  constructor() {
    super("snippets")
  }

  static validate (data: SnippetInput) {
    const rules: SnippetInputRules = {
      content: [required, isString],
      title: [required, isString],
      description: [isOptional, isString],
      tags: validateArray(true, [required, isString]),
      language: [required, isString],
      id: [isOptional, isString],
    }
    return validate(data, rules)
  }

  static validateUpdate (data: SnippetInput) {
    const rules: SnippetIRules = {
      content: [isOptional, isString],
      title: [isOptional, isString],
      description: [isOptional, isString],
      tags: validateArray(true, [isString]),
      language: [isOptional, isString],
      id: [isOptional, isString],
      createdAt: [isOptional, isString],
      updatedAt: [isOptional, isString]
    }
    return validate(data, rules)
  }

  write (data: SnippetInput) {
    const payload: SnippetI = {
      ...this.#builder.build(data),
    }
    this.create(payload.id, payload)
  }

}