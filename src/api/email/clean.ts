import { JSDOM } from "jsdom";

function extractPlainTextFromHtml(htmlStr: string): string {
  const dom = new JSDOM(htmlStr);
  return dom.window.document.body.textContent || "";
}

function isHtml(text: string): boolean {
  const dom = new JSDOM(text);
  return dom.window.document.querySelectorAll("*").length > 0;
}

function extractPlainText(rawTexts: string[]): string {
  const texts: string[] = [];

  for (const rawText of rawTexts) {
    if (isHtml(rawText)) {
      texts.push(extractPlainTextFromHtml(rawText));
    } else {
      texts.push(rawText);
    }
  }

  return texts.join(" ");
}

function cleanSpecialCharacters(text: string): string {
  const specialChars = ["\r", "\n", "\xa0"];

  for (const c of specialChars) {
    text = text.replace(c, " ");
  }

  const subTexts = text
    .split(" ")
    .map((s) => s.trim())
    .filter(Boolean);

  return subTexts.join(" ");
}

export function cleanRawContent(rawTexts: string[]): string {
  let text = extractPlainText(rawTexts);
  text = cleanSpecialCharacters(text);
  return text;
}
