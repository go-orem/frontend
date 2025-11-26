// clipboardHtml.ts
export function copyCodeAsHtml(htmlFragment: string, plainText: string) {
  const blobHtml = new Blob([htmlFragment], { type: "text/html" });
  const blobPlain = new Blob([plainText], { type: "text/plain" });
  const data = new ClipboardItem({ "text/html": blobHtml, "text/plain": blobPlain });
  return navigator.clipboard.write([data]);
}
