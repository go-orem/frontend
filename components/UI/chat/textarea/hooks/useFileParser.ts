// useFileParser.ts
// parse dropped files: images, text, code, zip (simple)
export function useFileParser() {
  async function parse(file: File) {
    const type = file.type;
    if (type.startsWith("image/")) {
      return { kind: "image", file };
    }
    if (type === "application/json" || file.name.endsWith(".json")) {
      const txt = await file.text();
      return { kind: "json", content: JSON.parse(txt) };
    }
    const txt = await file.text();
    return { kind: "text", content: txt };
  }
  return { parse };
}
