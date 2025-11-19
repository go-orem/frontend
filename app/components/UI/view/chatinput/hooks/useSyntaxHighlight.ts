import { useCallback } from "react";
import hljs from "highlight.js/lib/core";
import javascript from "highlight.js/lib/languages/javascript";
import typescript from "highlight.js/lib/languages/typescript";
import python from "highlight.js/lib/languages/python";
import DOMPurify from "dompurify";

hljs.registerLanguage("javascript", javascript);
hljs.registerLanguage("typescript", typescript);
hljs.registerLanguage("python", python);

export function useSyntaxHighlight() {
  const highlight = useCallback((code: string, lang?: string) => {
    try {
      let rawHtml;
      if (lang && hljs.getLanguage(lang)) {
        rawHtml = hljs.highlight(code, { language: lang }).value;
      } else {
        rawHtml = hljs.highlightAuto(code).value;
      }
      // sanitize HTML untuk mencegah XSS
      return DOMPurify.sanitize(rawHtml);
    } catch {
      return escapeHtml(code);
    }
  }, []);

  return { highlight };
}

function escapeHtml(s: string) {
  return s.replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;");
}
