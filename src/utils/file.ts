import hljs from 'highlight.js';
import { Marked } from 'marked';
import { markedHighlight } from 'marked-highlight';

export async function getUrl(file: File) {
  return await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
}

export const marked = new Marked(
  markedHighlight({
    highlight(code, lang, _info) {
      return lang && hljs.getLanguage(lang)
        ? hljs.highlight(code, {
            language: lang,
            ignoreIllegals: true,
          }).value
        : code;
    },
  }),
);
