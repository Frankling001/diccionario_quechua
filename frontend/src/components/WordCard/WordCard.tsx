import type { Word } from "../../types";
import "./WordCard.css";

interface WordCardProps {
  word: Word;
  searchQuery: string;
}

// Mapeo de categorías con nombres legibles
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

// Colores para cada categoría
const getCategoryColor = (category: string): string => {
  const colors: Record<string, string> = {
    SUSTANTIVO: "#93b3e6",
    VERBO: "#10b981",
    VERBO_REFLEXIVO: "#059669",
    VERBO_TRANSITIVO: "#55c7a3",
    VERBO_INTRANSITIVO: "#059669",
    VERBO_RECIPROCO: "#059669",
    ADJETIVO: "#f59e0b",
    ADVERBIO: "#8b5cf6",
    PRONOMBRE: "#ec4898",
    PREPOSICION: "#6b7280",
    CONJUNCION: "#6b7280",
    INTERJECCION: "#ef4444",
    ONOMATOPEYA: "#14b8a6",
    EXPRESION: "#f97316",
    PARTICULA: "#a855f7",
  };
  return colors[category] || "#6b7280";
};

export function WordCard({ word, searchQuery }: WordCardProps) {
  const isSpanishSearch = word.spanish.some((s) =>
    s.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Si busca en español, el título es el español, sino el quechua
  const title = isSpanishSearch
    ? word.spanish.find((s) => s.toLowerCase().includes(searchQuery.toLowerCase())) || word.spanish[0]
    : word.quechua;

  // Las traducciones son lo contrario
  const translations = isSpanishSearch ? [word.quechua] : word.spanish;

  const categoryDisplayName = categoryNames[word.category] || word.category;
  const categoryColor = getCategoryColor(word.category);

  return (
    <article className="word-card">
      <header className="word-card__header">
        <div className="word-card__title-row">
          <h2 className="word-card__title">{title}</h2>
          <span className="word-card__lang-tag">
            {isSpanishSearch ? "Español → Quechua" : "Quechua → Español"}
          </span>
        </div>
        <span 
          className="word-card__category"
          style={{ backgroundColor: categoryColor }}
        >
          {categoryDisplayName}
        </span>
      </header>

      <div className="word-card__meanings">
        {translations.map((meaning, index) => (
          <span key={index} className="word-card__meaning">
            {meaning}
          </span>
        ))}
      </div>

      {word.description && (
        <p className="word-card__description">{word.description}</p>
      )}

      {word.examples.length > 0 && (
        <div className="word-card__examples">
          <h3 className="word-card__examples-title">📝 Ejemplos:</h3>
          {word.examples.map((example) => (
            <div key={example.id} className="word-card__example">
              <p className="word-card__example-quechua">🗣️ {example.quechua}</p>
              <p className="word-card__example-spanish">→ {example.spanish}</p>
            </div>
          ))}
        </div>
      )}
    </article>
  );
}