import type { Word } from '../../types/Word';
import WordResult from './WordResult';

interface ResultsListProps {
  results: Word[];
}

export default function ResultsList({ results }: ResultsListProps) {
  if (results.length === 0) {
    return <p className="empty-message">No se encontraron resultados.</p>;
  }

  return (
    <section className="results-list">
      {results.map((word) => (
        <WordResult key={word.id} word={word} />
      ))}
    </section>
  );
}