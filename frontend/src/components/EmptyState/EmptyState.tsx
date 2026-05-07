import "./EmptyState.css";

interface EmptyStateProps {
  query: string;
}

export function EmptyState({ query }: EmptyStateProps) {
  return (
    <div className="empty-state">
      <div className="empty-state__icon">📖</div>
      <h2 className="empty-state__title">
        No se encontró "{query}"
      </h2>
      <p className="empty-state__message">
        Esta palabra no está en nuestro diccionario todavía.
        <br />
        ¡Ayúdanos a mejorarlo sugiriendo su significado abajo!
      </p>
    </div>
  );
}