import hljs from 'highlight.js';
import { Marked } from 'marked';
import { markedHighlight } from 'marked-highlight';
import * as pdfjsLib from 'pdfjs-dist';
import PdfJsWorker from 'pdfjs-dist/build/pdf.worker.mjs?worker';

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

pdfjsLib.GlobalWorkerOptions.workerPort = new PdfJsWorker();

export function getPDFDocument(url: string) {
  return pdfjsLib.getDocument({
    url: url,
    cMapUrl: import.meta.env.DEV ? '../../node_modules/pdfjs-dist/cmaps/' : './assets/cmaps/',
    cMapPacked: true,
    useWorkerFetch: false,
  }).promise;
}

export async function getPDFContent(url: string) {
  const pdf = await getPDFDocument(url);
  let fileContent = '';
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    fileContent += textContent.items
      .map(item => {
        if ('str' in item) {
          return item.str;
        }
        return '';
      })
      .filter(str => str !== '')
      .join('\n');
  }

  return fileContent;
}
