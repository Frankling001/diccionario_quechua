import { useState } from "react";
import { AdminPanel } from "../components/AdminPanel/AdminPanel";
import "./Admin.css";

export function Admin() {
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return sessionStorage.getItem("admin_logged") === "true";
  });
  const [error, setError] = useState("");

  const ADMIN_PASSWORD = "quechua123";

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsLoggedIn(true);
      sessionStorage.setItem("admin_logged", "true");
      setError("");
    } else {
      setError("Contraseña incorrecta");
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    sessionStorage.removeItem("admin_logged");
    setPassword("");
  };

  if (!isLoggedIn) {
    return (
      <div className="admin-login">
        <form onSubmit={handleLogin} className="admin-login__form">
          <h2 className="admin-login__title">🔐 Acceso Administrador</h2>
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="admin-login__input"
            autoFocus
          />
          {error && <p className="admin-login__error">{error}</p>}
          <button type="submit" className="admin-login__btn">
            Ingresar
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="admin-page__header">
        <h2>Panel de Administración</h2>
        <button onClick={handleLogout} className="admin-page__logout">
          Cerrar sesión
        </button>
      </div>
      <div className="admin-page__body">
        <AdminPanel />
      </div>
    </div>
  );
}