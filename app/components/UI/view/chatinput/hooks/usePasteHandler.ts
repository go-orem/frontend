import { useState } from "react";

export function usePasteHandler() {
  const [pasteCandidate, setPasteCandidate] = useState<string | null>(null);
  const [pasteIsCodeLike, setPasteIsCodeLike] = useState(false);
  const [selStart, setSelStart] = useState<number | null>(null);
  const [selEnd, setSelEnd] = useState<number | null>(null);

  const onPaste = (e: React.ClipboardEvent<HTMLTextAreaElement>, ref?: React.RefObject<HTMLTextAreaElement | null>) => {
    const pasted = e.clipboardData.getData("text");
    if (!pasted) return;

    const lines = pasted.split(/\r|\n/);
    const isLong = lines.length >= 6;
    const codeTokens = /;|\{|\}|=>|function|class|import|export|def |console\.|printf/.test(pasted);

    if (isLong || codeTokens) {
      e.preventDefault();
      setPasteCandidate(pasted);
      setPasteIsCodeLike(codeTokens || isLong);
      const el = ref?.current;
      setSelStart(el?.selectionStart ?? null);
      setSelEnd(el?.selectionEnd ?? null);
      return true;
    }
    return false;
  };

  const acceptPasteAsCode = (value: string, replaceRange: (t:string,s:number,e:number,i:string)=>string, setValue: (v:string)=>void, ref?: React.RefObject<HTMLTextAreaElement | null>) => {
    if (!pasteCandidate) return;
    const el = ref?.current;
    let start = selStart ?? el?.selectionStart ?? value.length;
    let end = selEnd ?? el?.selectionEnd ?? value.length;

    const insert = "```\n" + pasteCandidate + "\n``` ";
    const newText = replaceRange(value, start, end, insert);

    setValue(newText);
    setPasteCandidate(null);
    return { newText, pos: start + insert.length };
  };

  const rejectPasteAsCode = (value: string, replaceRange: (t:string,s:number,e:number,i:string)=>string, setValue: (v:string)=>void, ref?: React.RefObject<HTMLTextAreaElement | null>) => {
    if (!pasteCandidate) return;
    const el = ref?.current;
    let start = selStart ?? el?.selectionStart ?? value.length;
    let end = selEnd ?? el?.selectionEnd ?? value.length;

    const newText = replaceRange(value, start, end, pasteCandidate);
    setValue(newText);
    setPasteCandidate(null);
    return { newText, pos: start + pasteCandidate.length };
  };

  return {
    pasteCandidate,
    pasteIsCodeLike,
    onPaste,
    acceptPasteAsCode,
    rejectPasteAsCode,
    setPasteCandidate,
  } as const;
}
