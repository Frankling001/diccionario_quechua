import { useMemo, useState } from 'react';
import SearchBar from '../components/search/SearchBar';
import ResultsList from '../components/results/ResultsList';
import SuggestionForm from '../components/suggestion/SuggestionForm';
import { mockWords } from '../data/mockWords';
import type { Suggestion } from '../types/Suggestion';
import type { TranslationDirection, Word } from '../types/Word';

export default function HomePage() {
  const [query, setQuery] = useState('');
  const [direction, setDirection] = useState<TranslationDirection>('es-qu');
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [results, setResults] = useState<Word[]>([]);
  const [lastSearchTerm, setLastSearchTerm] = useState('');
  const [lastSearchLanguage, setLastSearchLanguage] = useState<'es' | 'qu'>('es');

  const handleSearch = () => {
    const normalizedQuery = query.trim().toLowerCase();
    const sourceLanguage = direction === 'es-qu' ? 'es' : 'qu';
    const found = mockWords.filter(
      (word) => word.language === sourceLanguage && word.term.toLowerCase() === normalizedQuery
    );

    setSearchPerformed(true);
    setResults(found);
    setLastSearchTerm(normalizedQuery);
    setLastSearchLanguage(sourceLanguage);
  };

  const handleSuggestionSubmit = (suggestion: Suggestion) => {
    console.log('Sugerencia enviada:', suggestion);
    alert('Sugerencia enviada correctamente. Luego la conectaremos al backend.');
  };

  const title = useMemo(() => {
    return direction === 'es-qu' ? 'Español → Quechua' : 'Quechua → Español';
  }, [direction]);

  return (
    <main className="app">
      <h1>Diccionario Quechua - Español</h1>
      <p>Aplicación web para buscar palabras en Quechua y español</p>
      <p className="subtitle">{title}</p>

      <SearchBar
        query={query}
        direction={direction}
        onQueryChange={setQuery}
        onDirectionChange={setDirection}
        onSearch={handleSearch}
      />

      <section className="content">
        {searchPerformed && results.length > 0 && <ResultsList results={results} />}

        {searchPerformed && results.length === 0 && (
          <SuggestionForm
            term={lastSearchTerm}
            language={lastSearchLanguage}
            onSubmitSuggestion={handleSuggestionSubmit}
          />
        )}
      </section>
    </main>
  );
}