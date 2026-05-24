// Tipos para el diccionario Quechua
 
export const Category = {
  SUSTANTIVO: "SUSTANTIVO",
  VERBO: "VERBO",
  VERBO_REFLEXIVO: "VERBO_REFLEXIVO",
  VERBO_TRANSITIVO: "VERBO_TRANSITIVO",
  VERBO_INTRANSITIVO: "VERBO_INTRANSITIVO",
  VERBO_RECIPROCO: "VERBO_RECIPROCO",
  ADJETIVO: "ADJETIVO",
  ADVERBIO: "ADVERBIO",
  PRONOMBRE: "PRONOMBRE",
  PREPOSICION: "PREPOSICION",
  CONJUNCION: "CONJUNCION",
  INTERJECCION: "INTERJECCION",
  ONOMATOPEYA: "ONOMATOPEYA",
  EXPRESION: "EXPRESION",
  PARTICULA: "PARTICULA",
} as const;
 
export type Category = typeof Category[keyof typeof Category];
 
export const SuggestionStatus = {
  PENDING: "PENDING",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
} as const;
 
export type SuggestionStatus = typeof SuggestionStatus[keyof typeof SuggestionStatus];
 
export interface Example {
  id: number;
  quechua: string;
  spanish: string;
  wordId: number;
}
 
export interface Word {
  id: number;
  quechua: string[];
  spanish: string[];
  description?: string;
  category: Category;
  examples: Example[];
  createdAt: string;
  updatedAt: string;
}
 
export interface Suggestion {
  id: number;
  quechua: string[];
  spanish: string[];
  description?: string;
  pronunciation?: string;       // ✅ Nuevo
  contributorName?: string;     // ✅ Nuevo
  contributorPlace?: string;    // ✅ Nuevo
  category?: Category;
  status: SuggestionStatus;
  createdAt: string;
  updatedAt: string;
}
 
export interface CreateWordDTO {
  quechua: string | string[];
  spanish: string[];
  category: Category;
  description?: string;
  examples?: Omit<Example, "id" | "wordId">[];
}
 
export interface CreateSuggestionDTO {
  quechua: string | string[];
  spanish: string[];
  description?: string;
  pronunciation?: string;       // ✅ Nuevo
  contributorName?: string;     // ✅ Nuevo
  contributorPlace?: string;    // ✅ Nuevo
  category?: Category;
}
 
export interface UpdateSuggestionDTO {
  quechua?: string[];
  spanish?: string[];
  description?: string;
  pronunciation?: string;       // ✅ Nuevo
  contributorName?: string;     // ✅ Nuevo
  contributorPlace?: string;    // ✅ Nuevo
  category?: Category;
}
 
export interface SearchResponse {
  results: Word[];
  query: string;
  exactMatch: boolean;
  exactMatchWord: Word | null;
  total: number;
}