import * as pdfjsLib from 'pdfjs-dist';
import hljs from 'highlight.js';
import { Marked } from 'marked';
import { markedHighlight } from 'marked-highlight';
import PdfJsWorker from 'pdfjs-dist/build/pdf.worker.mjs?worker';
import { TextItem } from 'pdfjs-dist/types/src/display/api';

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
    cMapUrl: './cmaps/',
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
    const items = textContent.items.filter(
      item => 'str' in item && 'dir' in item && 'width' in item && 'height' in item && item.str !== '',
    ) as TextItem[];

    fileContent += items.map(item => item.str).join('\n');
  }

  return fileContent;
}
