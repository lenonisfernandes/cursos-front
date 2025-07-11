import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

function decodeJwt(token) {
  try {
    const payload = token.split('.')[1];
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
}

export default function Login() {
  const [form, setForm] = useState({ email: "", senha: "" });
  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setMensagem("");
    setErro("");
    setCarregando(true);
    try {
      const { data } = await api.post("/login", form);
      const userFromToken = decodeJwt(data);
      console.log('Usuário decodificado manualmente:', userFromToken);
      login(userFromToken);
      setMensagem("Login realizado com sucesso!");
      setTimeout(() => navigate("/dashboard"), 1000);
    } catch (err) {
      console.log('Erro no login:', err, err.response?.data);
      setErro(err.response?.data?.mensagem || "Erro ao fazer login.");
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <form onSubmit={handleSubmit} className="card" style={{ maxWidth: 400, width: '100%', margin: '40px auto', background: 'var(--color-bg-card)', boxShadow: '0 2px 12px rgba(0,0,0,0.18)' }}>
        <h2 style={{ textAlign: 'center', marginBottom: 24, color: 'var(--color-primary)' }}>Login</h2>
        <div>
          <label>Email:</label>
          <input name="email" type="email" value={form.email} onChange={handleChange} required />
        </div>
        <div>
          <label>Senha:</label>
          <input name="senha" type="password" value={form.senha} onChange={handleChange} required />
        </div>
        <button type="submit" style={{ width: '100%', fontSize: 16 }} disabled={carregando}>
          {carregando ? "Entrando..." : "Entrar"}
        </button>
        {mensagem && <p className="success" style={{ textAlign: 'center', marginTop: 18 }}>{mensagem}</p>}
        {erro && <p className="error" style={{ textAlign: 'center', marginTop: 18 }}>{erro}</p>}
      </form>
    </div>
  );
} 