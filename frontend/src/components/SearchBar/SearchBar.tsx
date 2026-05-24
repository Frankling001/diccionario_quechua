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
        {/* Lupa SVG dentro del input */}
        <svg
          className="search-bar__input-icon"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
 
        <input
          type="text"
          className="search-bar__input"
          placeholder="Buscar palabra en quechua o español..."
          value={value}
          onChange={(e) => setValue(e.target.value)}
          aria-label="Buscar palabra"
        />
 
        <button type="submit" className="search-bar__button">
          {/* Lupa SVG profesional en el botón */}
          <svg
            className="search-bar__button-icon"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <span className="search-bar__text">Buscar</span>
        </button>
      </div>
    </form>
  );
}