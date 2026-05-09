import { useState, useEffect } from "react";
import type { Suggestion, UpdateSuggestionDTO } from "../../types";
import { Category } from "../../types";
import { suggestionApi } from "../../services/api";
import "./AdminPanel.css";

interface ExampleInput {
  quechua: string;
  spanish: string;
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

// Función para formatear nombre de categoría
const formatCategoryName = (category: string): string => {
  return categoryNames[category] || category.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
};

export function AdminPanel() {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editData, setEditData] = useState<UpdateSuggestionDTO>({});
  const [examples, setExamples] = useState<ExampleInput[]>([]);
  const [approving, setApproving] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        const data = await suggestionApi.getPending();
        if (isMounted) {
          setSuggestions(data);
        }
      } catch (err) {
        console.error("Error cargando sugerencias:", err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, []);

  const reloadSuggestions = async () => {
    setLoading(true);
    try {
      const data = await suggestionApi.getPending();
      setSuggestions(data);
    } catch (err) {
      console.error("Error cargando sugerencias:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (sug: Suggestion) => {
    setEditingId(sug.id);
    setEditData({
      description: sug.description || "",
      category: sug.category || undefined,
      examples: [],
    });
    setExamples([]);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditData({});
    setExamples([]);
  };

  const addExample = () => {
    setExamples([...examples, { quechua: "", spanish: "" }]);
  };

  const updateExample = (
    index: number,
    field: keyof ExampleInput,
    value: string
  ) => {
    const updated = [...examples];
    updated[index][field] = value;
    setExamples(updated);
  };

  const removeExample = (index: number) => {
    setExamples(examples.filter((_, i) => i !== index));
  };

  const handleSaveAndApprove = async (id: number, quechua: string) => {
    setApproving(true);
    try {
      const updateData: UpdateSuggestionDTO = {
        description: editData.description || undefined,
        category: editData.category || undefined,
      };

      const validExamples = examples.filter((ex) => ex.quechua && ex.spanish);

      // Actualizar la sugerencia si hay cambios
      if (updateData.description || updateData.category) {
        await suggestionApi.update(id, updateData);
      }

      // Aprobar la sugerencia (sin guardar el resultado si no lo necesitas)
      await suggestionApi.approve(id, validExamples);

      setMessage(`✅ "${quechua}" aprobada y agregada al diccionario`);
      setEditingId(null);
      setEditData({});
      setExamples([]);

      await reloadSuggestions();

      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      console.error("Error aprobando:", err);
      setMessage("❌ Error al aprobar");
    } finally {
      setApproving(false);
    }
  };

  const handleReject = async (id: number, quechua: string) => {
    if (!confirm(`¿Rechazar "${quechua}"?`)) return;
    
    setApproving(true);
    try {
      await suggestionApi.reject(id);
      setMessage(`❌ "${quechua}" rechazada`);
      await reloadSuggestions();
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      console.error("Error rechazando:", err);
      setMessage("❌ Error al rechazar");
    } finally {
      setApproving(false);
    }
  };

  if (loading) {
    return (
      <p className="admin-panel__loading">
        Cargando sugerencias...
      </p>
    );
  }

  return (
    <div className="admin-panel">
      <h3 className="admin-panel__title">
        📋 Sugerencias Pendientes
      </h3>

      {message && (
        <p className="admin-panel__message">{message}</p>
      )}

      {suggestions.length === 0 ? (
        <p className="admin-panel__empty">
          No hay sugerencias pendientes
        </p>
      ) : (
        <div className="admin-panel__list">
          {suggestions.map((sug) => (
            <div key={sug.id} className="admin-panel__item">
              {editingId === sug.id ? (
                <div className="admin-panel__edit-form">
                  <div className="admin-panel__edit-header">
                    <strong>{sug.quechua}</strong> →{" "}
                    {sug.spanish.join(", ")}
                  </div>

                  <div className="admin-panel__field">
                    <label>Categoría</label>
                    <select
                      value={editData.category || ""}
                      onChange={(e) =>
                        setEditData({
                          ...editData,
                          category: e.target.value as Category,
                        })
                      }
                      disabled={approving}
                    >
                      <option value="">Seleccionar...</option>
                      {Object.values(Category).map((cat) => (
                        <option key={cat} value={cat}>
                          {formatCategoryName(cat)}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="admin-panel__field">
                    <label>Descripción</label>
                    <textarea
                      value={editData.description || ""}
                      onChange={(e) =>
                        setEditData({
                          ...editData,
                          description: e.target.value,
                        })
                      }
                      placeholder="Descripción de la palabra..."
                      rows={2}
                      disabled={approving}
                    />
                  </div>

                  <div className="admin-panel__field">
                    <label>Ejemplos</label>

                    {examples.map((ex, i) => (
                      <div
                        key={i}
                        className="admin-panel__example-row"
                      >
                        <input
                          placeholder="Quechua"
                          value={ex.quechua}
                          onChange={(e) =>
                            updateExample(i, "quechua", e.target.value)
                          }
                          disabled={approving}
                        />
                        <input
                          placeholder="Español"
                          value={ex.spanish}
                          onChange={(e) =>
                            updateExample(i, "spanish", e.target.value)
                          }
                          disabled={approving}
                        />
                        <button
                          type="button"
                          className="admin-panel__remove-btn"
                          onClick={() => removeExample(i)}
                          disabled={approving}
                        >
                          ✕
                        </button>
                      </div>
                    ))}

                    <button
                      type="button"
                      className="admin-panel__add-example"
                      onClick={addExample}
                      disabled={approving}
                    >
                      + Agregar ejemplo
                    </button>
                  </div>

                  <div className="admin-panel__edit-actions">
                    <button
                      className="admin-panel__approve-btn"
                      onClick={() =>
                        handleSaveAndApprove(sug.id, sug.quechua)
                      }
                      disabled={approving}
                    >
                      {approving ? "Aprobando..." : "✅ Guardar y aprobar"}
                    </button>

                    <button
                      className="admin-panel__cancel-btn"
                      onClick={handleCancelEdit}
                      disabled={approving}
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="admin-panel__item-info">
                    <strong>{sug.quechua}</strong> →{" "}
                    {sug.spanish.join(", ")}

                    {sug.category && (
                      <span className="admin-panel__item-category">
                        Categoría: {formatCategoryName(sug.category)}
                      </span>
                    )}

                    {sug.description && (
                      <p className="admin-panel__item-desc">
                        {sug.description}
                      </p>
                    )}
                  </div>

                  <div className="admin-panel__item-actions">
                    <button
                      className="admin-panel__edit-btn"
                      onClick={() => handleEdit(sug)}
                      disabled={approving}
                    >
                      ✏️ Editar
                    </button>

                    <button
                      className="admin-panel__approve-btn"
                      onClick={() =>
                        handleSaveAndApprove(sug.id, sug.quechua)
                      }
                      disabled={approving}
                    >
                      {approving ? "..." : "✅ Aprobar"}
                    </button>

                    <button
                      className="admin-panel__reject-btn"
                      onClick={() => handleReject(sug.id, sug.quechua)}
                      disabled={approving}
                    >
                      ❌ Rechazar
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}