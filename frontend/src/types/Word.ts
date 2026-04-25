export type TranslationDirection = "es-qu" | "qu-es";

export interface Word {
  id: number;
  term: string;
  language: "es" | "qu";
  translation: string;
}