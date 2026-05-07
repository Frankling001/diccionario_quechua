import { useState, useCallback } from "react";
import type { Word, CreateSuggestionDTO } from "../types";
import { wordApi, suggestionApi } from "../services/api";

export function useDictionary() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Word[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const search = useCallback(async (searchQuery: string) => {
    const trimmed = searchQuery.trim();
    
    if (!trimmed) {
      setResults([]);
      setHasSearched(false);
      return;
    }

    setQuery(trimmed);
    setLoading(true);
    setError(null);
    setHasSearched(true);

    try {
      const data = await wordApi.search(trimmed);
      setResults(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al buscar");
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const submitSuggestion = useCallback(
    async (suggestion: CreateSuggestionDTO): Promise<boolean> => {
      try {
        await suggestionApi.create(suggestion);
        return true;
      } catch (err) {
        console.error("Error al enviar sugerencia:", err);
        return false;
      }
    },
    []
  );

  return {
    query,
    results,
    loading,
    error,
    hasSearched,
    search,
    submitSuggestion,
  };
}