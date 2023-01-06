import { isString, required, validate, validateArray, maxLength, minLength, isOptional } from "validasaur"
import { ProjectI, ProjectInput, ProjectIRules, ProjectInputRules } from "./types.d.ts"
import { Storage } from "../../shared/storage.ts"
import { Builder } from '../../shared/builder.ts'

export class Project extends Storage<ProjectI> {

  #builder: Builder = new Builder();

  constructor() {
    super("projects")
  }

  static validate (data: ProjectInput) {
    const rules: ProjectInputRules = {
      title: [required, isString, minLength(3), maxLength(50)],
      content: [required, isString, minLength(40)],
      description: [required, isString, minLength(40), maxLength(400)],
      category: [required, isString, minLength(3), maxLength(50)],
      tags: validateArray(true, [isString]),
      image: [required, isString, minLength(8), maxLength(200)],
      repository: [required, isString, minLength(8), maxLength(200)],
      stack: [required],
      id: [isString, isOptional, minLength(8), maxLength(50)],
      preview: [isString, isOptional, minLength(8), maxLength(50)],
    }
    return validate(data, rules)
  }

  static validateUpdate (data: ProjectI) {
    const rules: ProjectIRules = {
      title: [isOptional],
      category: [isOptional],
      tags: validateArray(false, [isString]),
      image: [isOptional],
      repository: [isOptional],
      stack: [isOptional],
      id: [isString, isOptional, minLength(8), maxLength(50)],
      preview: [isString, isOptional, minLength(8), maxLength(50)],
      content: [isOptional, isString, minLength(40)],
      description: [isOptional, isString, minLength(40), maxLength(400)],
      pkg: [isOptional],
      createdAt: [isOptional],
      updatedAt: [isOptional],
    }
    return validate(data, rules)
  }

  #generateRepositoryLink (repository: string) {
    const [owner, repo] = repository.split('/')
    return `https://github.com/${owner}/${repo}`
  }

  async #generatePackageInfo (name: string) {
    const url = `https://registry.npmjs.org/${name}`
    const response = await fetch(url)
    const data = await response.json()
    return {
      name: data.name,
      version: data['dist-tags'].latest,
      url: `https://www.npmjs.com/package/${name}`
    }

  }

  async write (data: ProjectInput) {
    const payload: ProjectI = {
      ...this.#builder.build(data),
      tableOfContents: this.#builder.generateTableOfContents(data.content),
      repository: this.#generateRepositoryLink(data.repository),
      ...(data.pkg && { pkg: await this.#generatePackageInfo(data.pkg.name) }),
    }
    const result = this.create(payload.id, payload)
    if (result) {
      return payload
    } else {
      return { message: 'Has been occurred an error' }
    }
  }
}
