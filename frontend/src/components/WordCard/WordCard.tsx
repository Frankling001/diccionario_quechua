import type { Word } from "../../types";
import "./WordCard.css";

interface WordCardProps {
  word: Word;
  searchQuery: string;
}

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

  return (
    <article className="word-card">
      <header className="word-card__header">
        <div className="word-card__title-row">
          <h2 className="word-card__title">{title}</h2>
          <span className="word-card__lang-tag">
            {isSpanishSearch ? "Español → Quechua" : "Quechua → Español"}
          </span>
        </div>
        <span className="word-card__category">{word.category.toLowerCase()}</span>
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
          <h3 className="word-card__examples-title">Ejemplos:</h3>
          {word.examples.map((example) => (
            <div key={example.id} className="word-card__example">
              <p className="word-card__example-quechua">{example.quechua}</p>
              <p className="word-card__example-spanish">{example.spanish}</p>
            </div>
          ))}
        </div>
      )}
    </article>
  );
}