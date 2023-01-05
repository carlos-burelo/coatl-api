import { PostI, PostInput } from "./types.d.ts";
import { isString, required, validate, validateArray } from "validasaur";
import { Storage } from "../../shared/storage.ts";
import { Builder } from "../../shared/builder.ts";

export class Post extends Storage<PostI> {
  #builder = new Builder();
  constructor() {
    super("posts");
  }

  static validate(data: PostInput) {
    const rules = {
      title: [required],
      content: [required],
      description: [required],
      category: [required],
      tags: validateArray(true, [isString]),
    };

    return validate(data, rules);
  }

  write(data: PostInput) {
    const payload: PostI = {
      ...this.#builder.build(data),
      tableOfContents: this.#builder.generateTableOfContents(data.content),
    };

    this.create(payload.id, payload);
  }
}
