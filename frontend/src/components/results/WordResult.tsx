import type { Word } from '../../types/Word';

interface WordResultProps {
  word: Word;
}

export default function WordResult({ word }: WordResultProps) {
  return (
    <article className="result-card">
      <h3>{word.term}</h3>
      <p><strong>Idioma:</strong> {word.language === 'es' ? 'Español' : 'Quechua'}</p>
      <p><strong>Traducción:</strong> {word.translation}</p>
    </article>
  );
}