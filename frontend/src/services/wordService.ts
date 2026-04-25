import { API_BASE_URL } from "./api";
import type { Word, TranslationDirection } from "../types/Word";

export async function searchWords(
  term: string,
  direction: TranslationDirection
): Promise<Word[]> {
  const response = await fetch(
    `${API_BASE_URL}/api/words/search?term=${encodeURIComponent(term)}&direction=${direction}`
  );

  if (!response.ok) {
    throw new Error("Error al buscar palabra");
  }

  return response.json();
}