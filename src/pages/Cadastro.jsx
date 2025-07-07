import React, { useState } from "react";
import api from "../services/api";

export default function Cadastro() {
  const [form, setForm] = useState({
    nome: "",
    email: "",
    senha: "",
    nascimento: ""
  });
  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setMensagem("");
    setErro("");
    setCarregando(true);
    try {
      // Ajustar data para formato dd/mm/aaaa
      const nascimento = form.nascimento.split("-").reverse().join("/");
      const payload = { ...form, nascimento };
      await api.post("/usuarios", payload);
      setMensagem("Cadastro realizado com sucesso!");
      setForm({ nome: "", email: "", senha: "", nascimento: "" });
    } catch (err) {
      setErro(err.response?.data?.mensagem || "Erro ao cadastrar.");
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <form onSubmit={handleSubmit} className="card" style={{ maxWidth: 400, width: '100%', margin: '40px auto', background: 'var(--color-bg-card)', boxShadow: '0 2px 12px rgba(0,0,0,0.18)' }}>
        <h2 style={{ textAlign: 'center', marginBottom: 24, color: 'var(--color-primary)' }}>Cadastro de Aluno</h2>
        <div>
          <label>Nome:</label>
          <input name="nome" type="text" value={form.nome} onChange={handleChange} required />
        </div>
        <div>
          <label>Email:</label>
          <input name="email" type="email" value={form.email} onChange={handleChange} required />
        </div>
        <div>
          <label>Senha:</label>
          <input name="senha" type="password" value={form.senha} onChange={handleChange} required />
        </div>
        <div>
          <label>Data de Nascimento:</label>
          <input name="nascimento" type="date" value={form.nascimento} onChange={handleChange} required />
        </div>
        <button type="submit" style={{ width: '100%', fontSize: 16 }} disabled={carregando}>
          {carregando ? "Cadastrando..." : "Cadastrar"}
        </button>
        {mensagem && <p className="success" style={{ textAlign: 'center', marginTop: 18 }}>{mensagem}</p>}
        {erro && <p className="error" style={{ textAlign: 'center', marginTop: 18 }}>{erro}</p>}
      </form>
    </div>
  );
} 