import type { Word, CreateWordDTO, CreateSuggestionDTO, Suggestion, UpdateSuggestionDTO } from "../types";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

class ApiError extends Error {
  status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new ApiError(
      errorData.message || `Error ${response.status}`,
      response.status
    );
  }
  return response.json();
}

export const wordApi = {
  getAll: async (): Promise<Word[]> => {
    const response = await fetch(`${API_URL}/api/words`);
    return handleResponse<Word[]>(response);
  },

  search: async (query: string): Promise<{ results: Word[]; query: string; exactMatch: boolean; total: number }> => {
    const response = await fetch(
      `${API_URL}/api/words/search?q=${encodeURIComponent(query)}`
    );
    return handleResponse<{ results: Word[]; query: string; exactMatch: boolean; total: number }>(response);
  },

  create: async (word: CreateWordDTO): Promise<Word> => {
    const response = await fetch(`${API_URL}/api/words`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(word),
    });
    return handleResponse<Word>(response);
  },
};

export const suggestionApi = {
  create: async (suggestion: CreateSuggestionDTO): Promise<Suggestion> => {
    const response = await fetch(`${API_URL}/api/suggestions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(suggestion),
    });
    return handleResponse<Suggestion>(response);
  },

  getPending: async (): Promise<Suggestion[]> => {
    const response = await fetch(`${API_URL}/api/suggestions/pending`);
    return handleResponse<Suggestion[]>(response);
  },

  update: async (id: number, data: UpdateSuggestionDTO): Promise<Suggestion> => {
    const response = await fetch(`${API_URL}/api/suggestions/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    return handleResponse<Suggestion>(response);
  },

  // ✅ CORREGIDO: Retorna un objeto con message y data
  approve: async (id: number, examples?: { quechua: string; spanish: string }[]): Promise<{ message: string; data: Word }> => {
    const response = await fetch(`${API_URL}/api/suggestions/${id}/approve`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ examples: examples || [] }),
    });
    return handleResponse<{ message: string; data: Word }>(response);
  },

  reject: async (id: number): Promise<{ message: string; data: Suggestion }> => {
    const response = await fetch(`${API_URL}/api/suggestions/${id}/reject`, {
      method: "PUT",
    });
    return handleResponse<{ message: string; data: Suggestion }>(response);
  },
};