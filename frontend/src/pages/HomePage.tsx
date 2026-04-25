import { useState } from "react";
import SearchBar from "../components/search/SearchBar";
import ResultsList from "../components/results/ResultsList";
import SuggestionForm from "../components/suggestion/SuggestionForm";
import { sendSuggestion } from "../services/suggestionService";
import { searchWords } from "../services/wordService";
import type { Suggestion } from "../types/Suggestion";
import type { TranslationDirection, Word } from "../types/Word";


export default function HomePage() {
  const [query, setQuery] = useState("");
  const [direction, setDirection] = useState<TranslationDirection>("es-qu");
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [results, setResults] = useState<Word[]>([]);
  const [lastSearchTerm, setLastSearchTerm] = useState("");
  const [lastSearchLanguage, setLastSearchLanguage] = useState<"es" | "qu">("es");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [suggestionFeedback, setSuggestionFeedback] = useState("");
  const [suggestionFeedbackType, setSuggestionFeedbackType] = useState<"success" | "error" | "">("");

  const handleSearch = async () => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      setError("Escribe una palabra para buscar.");
      setSearchPerformed(false);
      setResults([]);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const sourceLanguage = direction === "es-qu" ? "es" : "qu";
      const found = await searchWords(normalizedQuery, direction);

      setSearchPerformed(true);
      setResults(found);
      setLastSearchTerm(normalizedQuery);
      setLastSearchLanguage(sourceLanguage);
    } catch (err) {
      setError("No se pudo realizar la búsqueda.");
      setSearchPerformed(false);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestionSubmit = async (suggestion: Suggestion) => {
  try {
    await sendSuggestion(suggestion);
    setSuggestionFeedbackType("success");
    setSuggestionFeedback("Sugerencia enviada correctamente. Gracias por ayudarnos a mejorar el diccionario.");
  } catch (error) {
    setSuggestionFeedbackType("error");
    setSuggestionFeedback("No se pudo enviar la sugerencia. Intenta nuevamente.");
  }

  setTimeout(() => {
    setSuggestionFeedback("");
    setSuggestionFeedbackType("");
  }, 3000);
};

  return (
    <main className="app">
      <h1>Diccionario Quechua - Español</h1>
      <p className="subtitle">
        {direction === "es-qu" ? "Español → Quechua" : "Quechua → Español"}
      </p>

      <SearchBar
        query={query}
        direction={direction}
        onQueryChange={setQuery}
        onDirectionChange={setDirection}
        onSearch={handleSearch}
      />

      {loading && <p className="empty-message">Buscando...</p>}
      {error && <p className="empty-message">{error}</p>}

      <section className="content">
        {searchPerformed && results.length > 0 && <ResultsList results={results} />}

        {searchPerformed && results.length === 0 && !loading && !error && (
          <SuggestionForm
            term={lastSearchTerm}
            language={lastSearchLanguage}
            onSubmitSuggestion={handleSuggestionSubmit}
            feedbackMessage={suggestionFeedback}
            feedbackType={suggestionFeedbackType}
          />
        )}
      </section>
    </main>
  );
}