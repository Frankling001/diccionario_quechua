import { useState, type FormEvent } from "react";
import type { CreateSuggestionDTO } from "../../types";
import { Category } from "../../types";
import "./SuggestionBox.css";

interface SuggestionBoxProps {
  onSubmitSuggestion: (suggestion: CreateSuggestionDTO) => Promise<boolean>;
}

// Función para formatear nombres de categorías
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
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!quechua.trim() || !spanish.trim()) {
      setError("Completa al menos la palabra en quechua y español");
      return;
    }

    setLoading(true);
    setError("");

    const success = await onSubmitSuggestion({
      quechua: quechua.trim(),
      spanish: spanish.split(",").map((s) => s.trim()).filter(Boolean),
      description: description.trim() || undefined,
      category: category || undefined,
    });

    setLoading(false);

    if (success) {
      setSubmitted(true);
      setQuechua("");
      setSpanish("");
      setDescription("");
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
      <h3 className="suggestion-box__title">
        📝 ¿Falta alguna palabra? ¡Sugiérela!
      </h3>
      
      <form onSubmit={handleSubmit} className="suggestion-box__form">
        <div className="suggestion-box__field">
          <label htmlFor="quechua">Palabra en Quechua *</label>
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
          <label htmlFor="spanish">Significado en Español *</label>
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
          <small>Ayuda a clasificar mejor la palabra</small>
        </div>

        <div className="suggestion-box__field">
          <label htmlFor="description">Descripción (opcional)</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Información adicional sobre la palabra..."
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