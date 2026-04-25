import { useState } from 'react';
import type { Suggestion } from '../../types/Suggestion';
interface SuggestionFormProps {
  term: string;
  language: 'es' | 'qu';
  onSubmitSuggestion: (suggestion: Suggestion) => void;
  feedbackMessage?: string;
  feedbackType?: 'success' | 'error' | '';
}

export default function SuggestionForm({
  term,
  language,
  onSubmitSuggestion,
  feedbackMessage,
  feedbackType,
}: SuggestionFormProps) {
  const [suggestedMeaning, setSuggestedMeaning] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    onSubmitSuggestion({
      term,
      language,
      suggestedMeaning,
    });

    setSuggestedMeaning('');
  };

  return (
    <form className="suggestion-form" onSubmit={handleSubmit}>
      <h2>Sugerir palabra</h2>

      <p>
        No encontramos la palabra <strong>{term}</strong> en el diccionario.
      </p>

      <input
        type="text"
        value={suggestedMeaning}
        onChange={(e) => setSuggestedMeaning(e.target.value)}
        placeholder="Escribe una sugerencia de significado"
      />

      <button type="submit">Enviar sugerencia</button>
      {feedbackMessage && (
  <p className={`feedback-message ${feedbackType}`}>
    {feedbackMessage}
  </p>
)}
      
    </form>
  );
}