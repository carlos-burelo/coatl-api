import { Section } from "../routes/posts/types.d.ts";

export class Builder {
  // deno-lint-ignore no-explicit-any
  build<T>(data: T | any) {
    return {
      ...data,
      id: this.generateId(data.title),
      createdAt: this.generateTimeStamp(),
      updatedAt: this.generateTimeStamp(),
    };
  }

  generateId(text: string): string {
    return text
      .toLowerCase()
      .replace(/\s/g, "-")
      .replace(/[^a-z0-9-]/g, "");
  }

  generateTimeStamp() {
    return new Date().toISOString();
  }

  generateTableOfContents(source: string): Section[] {
    // const source = this.#object.content;
    const headings = source.match(/^(#{1,6})\s(.*)$/gm);
    if (!headings) return [];
    const sections: Section[] = [];
    headings.forEach((heading) => {
      const level = heading.match(/^(#{1,6})/g)?.[0].length || 0;
      const text = heading.match(/^(#{1,6})\s(.*)$/)?.[2] || "";
      const section: Section = {
        "#": { id: this.generateId(text), text },
      };

      if (level === 1) {
        sections.push(section);
      } else {
        let parent = sections[sections.length - 1];
        let i = 1;
        while (i < level) {
          const last = parent["+"]?.[parent["+"]?.length - 1];
          if (last) parent = last;
          i++;
        }
        if (!parent["+"]) parent["+"] = [];
        parent["+"]?.push(section);
      }
    });
    return sections;
  }
}
