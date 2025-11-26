// usePasteImageToCode.ts
// Converts pasted image (clipboard) into a markdown code block with data URL or uploaded URL
import { useCallback } from "react";

export function usePasteImageToCode(uploadFn?: (file: File)=>Promise<string>) {
  // uploadFn should return URL if provided, otherwise returns dataURL
  const handlePaste = useCallback(async (ev: ClipboardEvent) => {
    const items = ev.clipboardData?.items;
    if (!items) return null;
    for (let i=0;i<items.length;i++){
      const it = items[i];
      if (it.type.startsWith("image/")) {
        const file = it.getAsFile();
        if (!file) continue;
        if (uploadFn) {
          const url = await uploadFn(file);
          return `![pasted image](${url})`;
        } else {
          // convert to dataURL
          const data = await fileToDataURL(file);
          return `![pasted image](${data})`;
        }
      }
    }
    return null;
  }, [uploadFn]);

  return { handlePaste };
}

function fileToDataURL(file: File) {
  return new Promise<string>((res, rej) => {
    const r = new FileReader();
    r.onload = () => res(String(r.result));
    r.onerror = rej;
    r.readAsDataURL(file);
  });
}
