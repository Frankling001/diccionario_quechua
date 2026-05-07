export const Category = {
  SUSTANTIVO: "SUSTANTIVO",
  VERBO: "VERBO",
  ADJETIVO: "ADJETIVO",
  ADVERBIO: "ADVERBIO",
  PRONOMBRE: "PRONOMBRE",
  PREPOSICION: "PREPOSICION",
  CONJUNCION: "CONJUNCION",
  INTERJECCION: "INTERJECCION",
} as const;

export type Category = (typeof Category)[keyof typeof Category];

export const SuggestionStatus = {
  PENDING: "PENDING",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
} as const;

export type SuggestionStatus = (typeof SuggestionStatus)[keyof typeof SuggestionStatus];

export interface Example {
  id: number;
  quechua: string;
  spanish: string;
  wordId: number;
}

export interface Word {
  id: number;
  quechua: string;
  spanish: string[];
  description?: string | null;
  category: Category;
  examples: Example[];
  createdAt: string;
  updatedAt: string;
}

export interface Suggestion {
  id: number;
  quechua: string;
  spanish: string[];
  description?: string | null;
  category?: Category | null;
  status: SuggestionStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateWordDTO {
  quechua: string;
  spanish: string[];
  description?: string;
  category: Category;
  examples?: {
    quechua: string;
    spanish: string;
  }[];
}

export interface CreateSuggestionDTO {
  quechua: string;
  spanish: string[];
  description?: string;
}

export interface UpdateSuggestionDTO {
  description?: string;
  category?: Category;
  examples?: {
    quechua: string;
    spanish: string;
  }[];
}

export type SearchState = "idle" | "loading" | "success" | "error" | "empty";

export interface DictionaryState {
  query: string;
  results: Word[];
  state: SearchState;
  error: string | null;
}