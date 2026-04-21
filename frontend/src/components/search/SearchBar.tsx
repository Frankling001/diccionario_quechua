import type { TranslationDirection } from '../../types/Word';

interface SearchBarProps {
  query: string;
  direction: TranslationDirection;
  onQueryChange: (value: string) => void;
  onDirectionChange: (value: TranslationDirection) => void;
  onSearch: () => void;
}

export default function SearchBar({
  query,
  direction,
  onQueryChange,
  onDirectionChange,
  onSearch,
}: SearchBarProps) {
  return (
    <div className="search-box">
      <input
        type="text"
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
        placeholder="Escribe una palabra..."
      />

      <select
        value={direction}
        onChange={(e) => onDirectionChange(e.target.value as TranslationDirection)}
      >
        <option value="es-qu">Español → Quechua</option>
        <option value="qu-es">Quechua → Español</option>
      </select>

      <button onClick={onSearch}>Buscar</button>
    </div>
  );
}