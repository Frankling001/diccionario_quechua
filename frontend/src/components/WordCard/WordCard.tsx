import type { Word } from "../../types";
import "./WordCard.css";
 
interface WordCardProps {
  word: Word;
  searchQuery: string;
}
 
const categoryNames: Record<string, string> = {
  SUSTANTIVO: "Sustantivo",
  VERBO: "Verbo",
  VERBO_REFLEXIVO: "Verbo Reflexivo",
  VERBO_TRANSITIVO: "Verbo Transitivo",
  VERBO_INTRANSITIVO: "Verbo Intransitivo",
  VERBO_RECIPROCO: "Verbo Recíproco",
  ADJETIVO: "Adjetivo",
  ADVERBIO: "Adverbio",
  PRONOMBRE: "Pronombre",
  PREPOSICION: "Preposición",
  CONJUNCION: "Conjunción",
  INTERJECCION: "Interjección",
  ONOMATOPEYA: "Onomatopeya",
  EXPRESION: "Expresión",
  PARTICULA: "Partícula",
};
 
const getCategoryColor = (category: string): string => {
  const colors: Record<string, string> = {
    SUSTANTIVO: "#3b82f6",
    VERBO: "#10b981",
    VERBO_REFLEXIVO: "#059669",
    VERBO_TRANSITIVO: "#0d9488",
    VERBO_INTRANSITIVO: "#059669",
    VERBO_RECIPROCO: "#059669",
    ADJETIVO: "#d97706",
    ADVERBIO: "#7c3aed",
    PRONOMBRE: "#db2777",
    PREPOSICION: "#6b7280",
    CONJUNCION: "#6b7280",
    INTERJECCION: "#dc2626",
    ONOMATOPEYA: "#0891b2",
    EXPRESION: "#ea580c",
    PARTICULA: "#9333ea",
  };
  return colors[category] || "#6b7280";
};
 
export function WordCard({ word, searchQuery }: WordCardProps) {
  const lowerQuery = searchQuery.toLowerCase();
 
  const matchedQuechua = word.quechua.find((q) =>
    q.toLowerCase().includes(lowerQuery)
  );
  const matchedSpanish = word.spanish.find((s) =>
    s.toLowerCase().includes(lowerQuery)
  );
 
  const isSpanishSearch = !!matchedSpanish;
  const isQuechuaSearch = !!matchedQuechua;
 
  const title = isSpanishSearch && matchedSpanish
    ? matchedSpanish
    : isQuechuaSearch && matchedQuechua
      ? matchedQuechua
      : word.quechua[0] || word.spanish[0];
 
  const translations = isSpanishSearch ? word.quechua : word.spanish;
  const langTag = isSpanishSearch ? "Español → Quechua" : "Quechua → Español";
  const categoryDisplayName = categoryNames[word.category] || word.category;
  const categoryColor = getCategoryColor(word.category);
 
  return (
    <article className="word-card">
      {/* ── Header ── */}
      <div className="word-card__header">
        <div className="word-card__header-top">
          <div className="word-card__header-left">
            <h2 className="word-card__title">{title}</h2>
            <p className="word-card__phonetic">
              {isSpanishSearch ? "español" : "quechua"}
            </p>
          </div>
          <div className="word-card__header-right">
            <span className="word-card__lang-tag">{langTag}</span>
            <div className="word-card__actions-top">
              <button className="word-card__action-btn" title="Escuchar pronunciación">
                🔊
              </button>
              <button className="word-card__action-btn" title="Guardar palabra">
                🔖
              </button>
            </div>
          </div>
        </div>
 
        {/* Categoría */}
        <span
          className="word-card__category"
          style={{ backgroundColor: categoryColor }}
        >
          {categoryDisplayName}
        </span>
      </div>
 
      {/* ── Significados ── */}
      <div className="word-card__meanings">
        {translations.map((meaning, index) => (
          <span key={index} className="word-card__meaning">
            {meaning}
          </span>
        ))}
      </div>
 
      {/* ── Descripción ── */}
      {word.description && (
        <p className="word-card__description">{word.description}</p>
      )}
 
      {/* ── Ejemplos ── */}
      {word.examples.length > 0 && (
        <div className="word-card__examples">
          <p className="word-card__examples-title">Ejemplos</p>
          {word.examples.map((example) => (
            <div key={example.id} className="word-card__example">
              <p className="word-card__example-quechua">{example.quechua}</p>
              <p className="word-card__example-spanish">→ {example.spanish}</p>
            </div>
          ))}
        </div>
      )}
 
      {/* ── Footer ── */}
      <div className="word-card__footer">
        <button className="word-card__footer-btn">
          👍 Útil
        </button>
        <button className="word-card__footer-btn word-card__footer-btn--right">
          ⚑ Reportar
        </button>
      </div>
    </article>
  );
}
 