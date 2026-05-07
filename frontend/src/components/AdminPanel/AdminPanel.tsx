import { useState, useEffect } from "react";
import type { Suggestion, UpdateSuggestionDTO } from "../../types";
import { Category } from "../../types";
import { suggestionApi } from "../../services/api";
import "./AdminPanel.css";

interface ExampleInput {
  quechua: string;
  spanish: string;
}

export function AdminPanel() {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editData, setEditData] = useState<UpdateSuggestionDTO>({});
  const [examples, setExamples] = useState<ExampleInput[]>([]);

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
    try {
      const updateData: UpdateSuggestionDTO = {
        description: editData.description || undefined,
        category: editData.category || undefined,
      };

      const validExamples = examples.filter((ex) => ex.quechua && ex.spanish);

      await suggestionApi.update(id, updateData);
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
    }
  };

  const handleReject = async (id: number, quechua: string) => {
    if (!confirm(`¿Rechazar "${quechua}"?`)) return;
    
    try {
      await suggestionApi.reject(id);
      setMessage(`❌ "${quechua}" rechazada`);
      await reloadSuggestions();
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      console.error("Error rechazando:", err);
      setMessage("❌ Error al rechazar");
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
                    >
                      <option value="">Seleccionar...</option>
                      {Object.values(Category).map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
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
                        />
                        <input
                          placeholder="Español"
                          value={ex.spanish}
                          onChange={(e) =>
                            updateExample(i, "spanish", e.target.value)
                          }
                        />
                        <button
                          type="button"
                          className="admin-panel__remove-btn"
                          onClick={() => removeExample(i)}
                        >
                          ✕
                        </button>
                      </div>
                    ))}

                    <button
                      type="button"
                      className="admin-panel__add-example"
                      onClick={addExample}
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
                    >
                      ✅ Guardar y aprobar
                    </button>

                    <button
                      className="admin-panel__cancel-btn"
                      onClick={handleCancelEdit}
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
                    >
                      ✏️ Editar
                    </button>

                    <button
                      className="admin-panel__approve-btn"
                      onClick={() =>
                        handleSaveAndApprove(sug.id, sug.quechua)
                      }
                    >
                      ✅ Aprobar
                    </button>

                    <button
                      className="admin-panel__reject-btn"
                      onClick={() => handleReject(sug.id, sug.quechua)}
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