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
    <div style={{ maxWidth: 400, margin: "40px auto" }}>
      <h2>Cadastro de Aluno</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Nome:</label>
          <input name="nome" value={form.nome} onChange={handleChange} required />
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
        <button type="submit" style={{ marginTop: 16 }} disabled={carregando}>
          {carregando ? "Cadastrando..." : "Cadastrar"}
        </button>
      </form>
      {mensagem && <p style={{ color: "green" }}>{mensagem}</p>}
      {erro && <p style={{ color: "red" }}>{erro}</p>}
    </div>
  );
} 