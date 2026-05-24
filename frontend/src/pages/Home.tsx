import { useDictionary } from "../hooks/useDictionary";
import { SearchBar } from "../components/SearchBar/SearchBar";
import { WordCard } from "../components/WordCard/WordCard";
import { EmptyState } from "../components/EmptyState/EmptyState";
import { SuggestionBox } from "../components/SuggestionBox/SuggestionBox";
import "./Home.css";
import logo from "../assets/logoAntes.jpeg";
 
export function Home() {
  const {
    query,
    results,
    loading,
    hasSearched,
    hasExactMatch,
    search,
    submitSuggestion,
  } = useDictionary();
 
  const showNoResults = hasSearched && !loading && results.length === 0;
  const showResults = results.length > 0;
 
  return (
    <div className="home">
      <header className="home__header">
        <img className="home__logo" src={logo} alt="Logo Panorama Quechua Central" />
        <h1 className="home__title">Diccionario Quechua Central</h1>
        <p className="home__subtitle">
          Uso para las regiones Huánuco - Ancash - Pasco - Junin - Lima provincias
        </p>
      </header>
 
      <SearchBar onSearch={search} />
 
      <main className="home__content">
        {loading && <div className="home__loading" />}
 
        {showNoResults && <EmptyState query={query} />}
 
        {showResults && (
          <>
            {!hasExactMatch && (
              <div className="home__no-exact-match-warning">
                <p className="home__warning-message">
                  ⚠️ No se encontró una coincidencia exacta para "{query}".
                  Mostrando palabras relacionadas:
                </p>
              </div>
            )}
            <div className="home__results">
              {results.map((word) => (
                <WordCard key={word.id} word={word} searchQuery={query} />
              ))}
            </div>
          </>
        )}
 
        <SuggestionBox onSubmitSuggestion={submitSuggestion} />
      </main>
    </div>
  );
}