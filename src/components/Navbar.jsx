import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <nav style={{ display: "flex", gap: 16, padding: 16, borderBottom: "1px solid #ccc", marginBottom: 24 }}>
      <Link to="/">Meus Cursos</Link>
      {usuario ? (
        <>
          <Link to="/dashboard">Dashboard</Link>
          <span>Bem-vindo, {usuario.nome || usuario.email}</span>
          <button onClick={handleLogout}>Sair</button>
        </>
      ) : (
        <>
          <Link to="/login">Login</Link>
          <Link to="/cadastro">Cadastro</Link>
        </>
      )}
    </nav>
  );
} 