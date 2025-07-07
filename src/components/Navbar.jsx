import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  function navLink(path, label) {
    const isActive = location.pathname === path;
    return (
      <Link
        to={path}
        style={{
          color: isActive ? "var(--color-primary)" : "var(--color-text-secondary)",
          fontWeight: isActive ? 700 : 500,
          letterSpacing: 0.5,
          fontSize: 18,
          padding: "6px 12px",
          borderRadius: 6,
          background: isActive ? "rgba(229,9,20,0.08)" : "transparent",
          transition: "background 0.2s, color 0.2s"
        }}
      >
        {label}
      </Link>
    );
  }

  return (
    <nav
      className="navbar"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "20px 40px",
        background: "var(--color-bg-card)",
        borderBottom: "1px solid var(--color-border)",
        marginBottom: 32,
        boxShadow: "0 2px 8px rgba(0,0,0,0.10)",
        flexWrap: "wrap",
        gap: 16
      }}
    >
      <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
        <span style={{ color: "var(--color-primary)", fontWeight: 900, fontSize: 24, letterSpacing: 1.5 }}>
          CURSOS
        </span>
        {navLink("/", "Meus Cursos")}
        {navLink("/dashboard", "Dashboard")}
      </div>
      <div style={{ display: "flex", gap: 18, alignItems: "center" }}>
        {usuario ? (
          <>
            <span style={{ color: "var(--color-text-secondary)", fontSize: 16 }}>
              {usuario.nome || usuario.email}
            </span>
            <button
              onClick={handleLogout}
              style={{
                background: "var(--color-primary)",
                color: "#fff",
                border: "none",
                borderRadius: 6,
                padding: "8px 18px",
                fontWeight: 600,
                fontSize: 15,
                marginLeft: 8,
                cursor: "pointer",
                transition: "background 0.2s"
              }}
            >
              Sair
            </button>
          </>
        ) : (
          <>
            {navLink("/login", "Login")}
            {navLink("/cadastro", "Cadastro")}
          </>
        )}
      </div>
    </nav>
  );
} 