import { useState, type FormEvent } from "react";
import "./SearchBar.css";

interface SearchBarProps {
  onSearch: (query: string) => void;
  initialValue?: string;
}

export function SearchBar({ onSearch, initialValue = "" }: SearchBarProps) {
  const [value, setValue] = useState(initialValue);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSearch(value);
  };

  return (
    <form onSubmit={handleSubmit} className="search-bar">
      <div className="search-bar__container">
        <input
          type="text"
          className="search-bar__input"
          placeholder="Buscar palabra en quechua o español..."
          value={value}
          onChange={(e) => setValue(e.target.value)}
          aria-label="Buscar palabra"
        />
        <button type="submit" className="search-bar__button">
          <span className="search-bar__icon">🔍</span>
          <span className="search-bar__text">Buscar</span>
        </button>
      </div>
    </form>
  );
}