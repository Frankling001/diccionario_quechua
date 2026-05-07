import type { Word } from "../../types";
import "./WordCard.css";

interface WordCardProps {
  word: Word;
}

export function WordCard({ word }: WordCardProps) {
  return (
    <article className="word-card">
      <header className="word-card__header">
        <h2 className="word-card__quechua">{word.quechua}</h2>
        <span className="word-card__category">{word.category}</span>
      </header>

      <div className="word-card__meanings">
        {word.spanish.map((meaning, index) => (
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