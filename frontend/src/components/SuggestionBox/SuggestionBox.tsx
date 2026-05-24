import { useState, type FormEvent } from "react";
import type { CreateSuggestionDTO } from "../../types";
import { Category } from "../../types";
import "./SuggestionBox.css";
 
interface SuggestionBoxProps {
  onSubmitSuggestion: (suggestion: CreateSuggestionDTO) => Promise<boolean>;
}
 
const formatCategoryName = (category: string): string => {
  return category
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (l) => l.toUpperCase());
};
 
export function SuggestionBox({ onSubmitSuggestion }: SuggestionBoxProps) {
  const [quechua, setQuechua] = useState("");
  const [spanish, setSpanish] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<Category | "">("");
  const [pronunciation, setPronunciation] = useState("");
  const [contributorName, setContributorName] = useState("");
  const [contributorPlace, setContributorPlace] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
 
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
 
    if (!quechua.trim() || !spanish.trim()) {
      setError("Completa al menos la palabra en quechua y su significado en español");
      return;
    }
 
    setLoading(true);
    setError("");
 
    const success = await onSubmitSuggestion({
      quechua: quechua.trim(),
      spanish: spanish.split(",").map((s) => s.trim()).filter(Boolean),
      description: description.trim() || undefined,
      pronunciation: pronunciation.trim() || undefined,
      contributorName: contributorName.trim() || undefined,
      contributorPlace: contributorPlace.trim() || undefined,
      category: category || undefined,
    });
 
    setLoading(false);
 
    if (success) {
      setSubmitted(true);
      setQuechua("");
      setSpanish("");
      setDescription("");
      setPronunciation("");
      setContributorName("");
      setContributorPlace("");
      setCategory("");
    } else {
      setError("Error al enviar. Intenta de nuevo.");
    }
  };
 
  if (submitted) {
    return (
      <div className="suggestion-box suggestion-box--success">
        <p className="suggestion-box__success-message">
          ✅ ¡Gracias! Tu sugerencia será revisada pronto.
        </p>
        <button
          className="suggestion-box__add-another"
          onClick={() => setSubmitted(false)}
        >
          Sugerir otra palabra
        </button>
      </div>
    );
  }
 
  return (
    <div className="suggestion-box">
      {/* Header */}
      <div className="suggestion-box__header">
        <span className="suggestion-box__title-icon">📝</span>
        <h3 className="suggestion-box__title">¿Falta alguna palabra?</h3>
        <span className="suggestion-box__hint">Sugiérela a la comunidad</span>
      </div>
 
      {/* Formulario siempre visible */}
      <form onSubmit={handleSubmit} className="suggestion-box__form">
 
        {/* Fila 1: Palabra y significado */}
        <div className="suggestion-box__row">
          <div className="suggestion-box__field">
            <label htmlFor="quechua">
              <span className="suggestion-box__required" />
              Palabra en Quechua
            </label>
            <input
              id="quechua"
              type="text"
              value={quechua}
              onChange={(e) => setQuechua(e.target.value)}
              placeholder="Ej: wasi"
              required
            />
          </div>
 
          <div className="suggestion-box__field">
            <label htmlFor="spanish">
              <span className="suggestion-box__required" />
              Significado en Español
            </label>
            <input
              id="spanish"
              type="text"
              value={spanish}
              onChange={(e) => setSpanish(e.target.value)}
              placeholder="Ej: casa, hogar, vivienda"
              required
            />
            <small>Separa múltiples significados con comas</small>
          </div>
        </div>
 
        {/* Fila 2: Pronunciación y Categoría */}
        <div className="suggestion-box__row">
          <div className="suggestion-box__field">
            <label htmlFor="pronunciation">Pronunciación (opcional)</label>
            <input
              id="pronunciation"
              type="text"
              value={pronunciation}
              onChange={(e) => setPronunciation(e.target.value)}
              placeholder="Ej: wa-si"
            />
            <small>Escribe cómo se pronuncia la palabra</small>
          </div>
 
          <div className="suggestion-box__field">
            <label htmlFor="category">Categoría gramatical (opcional)</label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value as Category | "")}
            >
              <option value="">Seleccionar categoría...</option>
              {Object.values(Category).map((cat) => (
                <option key={cat} value={cat}>
                  {formatCategoryName(cat)}
                </option>
              ))}
            </select>
          </div>
        </div>
 
        {/* Fila 3: Nombre y lugar */}
        <div className="suggestion-box__row">
          <div className="suggestion-box__field">
            <label htmlFor="contributorName">Tu nombre (opcional)</label>
            <input
              id="contributorName"
              type="text"
              value={contributorName}
              onChange={(e) => setContributorName(e.target.value)}
              placeholder="Ej: Juan Quispe"
            />
          </div>
 
          <div className="suggestion-box__field">
            <label htmlFor="contributorPlace">Lugar de procedencia (opcional)</label>
            <input
              id="contributorPlace"
              type="text"
              value={contributorPlace}
              onChange={(e) => setContributorPlace(e.target.value)}
              placeholder="Ej: Huánuco, Junín..."
            />
          </div>
        </div>
 
        {/* Descripción */}
        <div className="suggestion-box__field">
          <label htmlFor="description">Descripción (opcional)</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Contexto, uso o información adicional sobre la palabra..."
            rows={3}
          />
        </div>
 
        {error && <p className="suggestion-box__error">{error}</p>}
 
        <button
          type="submit"
          className="suggestion-box__submit"
          disabled={loading}
        >
          {loading ? "Enviando..." : "Enviar sugerencia"}
        </button>
      </form>
    </div>
  );
}