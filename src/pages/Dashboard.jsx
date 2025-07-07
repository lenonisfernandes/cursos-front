import React, { useEffect, useState, useRef } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const { usuario } = useAuth();
  const [cursos, setCursos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [inscrevendo, setInscrevendo] = useState(null);
  const [filtro, setFiltro] = useState("");
  const [buscando, setBuscando] = useState(false);
  const debounceRef = useRef();
  const navigate = useNavigate();

  async function buscarCursos(filtroBusca = "") {
    setBuscando(true);
    setErro("");
    try {
      const { data } = await api.get("/cursos", { params: { filtro: filtroBusca } });
      const hoje = new Date();
      hoje.setHours(0, 0, 0, 0);
      const cursosFuturos = data.filter(curso => {
        const [dia, mes, ano] = curso.inicio.split("/");
        const dataInicio = new Date(`${ano}-${mes}-${dia}`);
        dataInicio.setHours(0, 0, 0, 0);
        return dataInicio > hoje;
      });
      setCursos(cursosFuturos);
    } catch (err) {
      setErro("Erro ao buscar cursos.");
    } finally {
      setBuscando(false);
      setCarregando(false);
    }
  }

  useEffect(() => {
    if (!usuario) {
      navigate("/login");
      return;
    }
    buscarCursos();
    // eslint-disable-next-line
  }, [usuario]);

  useEffect(() => {
    if (!usuario) return;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      buscarCursos(filtro);
    }, 250);
    // eslint-disable-next-line
  }, [filtro]);

  async function inscrever(idCurso) {
    setMensagem("");
    setErro("");
    setInscrevendo(idCurso);
    try {
      await api.post(`/cursos/${idCurso}`);
      setMensagem("Inscrição realizada com sucesso!");
      await buscarCursos(filtro);
    } catch (err) {
      setErro(err.response?.data?.mensagem || "Erro ao inscrever.");
    } finally {
      setInscrevendo(null);
    }
  }

  if (!usuario) return null;
  if (carregando) return <p>Carregando cursos...</p>;
  if (erro) return <p style={{ color: "red" }}>{erro}</p>;

  return (
    <div style={{ maxWidth: 800, margin: "40px auto" }}>
      <h2>Todos os Cursos</h2>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
        <input
          type="text"
          placeholder="Buscar cursos..."
          value={filtro}
          onChange={e => setFiltro(e.target.value)}
          style={{ width: "100%", padding: 8, fontSize: 16 }}
        />
        {buscando && <span style={{ fontSize: 14, color: '#888' }}>Buscando...</span>}
      </div>
      {mensagem && <p style={{ color: 'green' }}>{mensagem}</p>}
      {cursos.length === 0 && !buscando && <p>Nenhum curso disponível no momento.</p>}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 24 }}>
        {cursos.map(curso => (
          <div key={curso.id} style={{ border: "1px solid #ccc", borderRadius: 8, padding: 16, width: 300, transition: 'opacity 0.2s' }}>
            {curso.capa && (
              <img src={curso.capa} alt={curso.nome} style={{ width: "100%", height: 120, objectFit: "cover", borderRadius: 4 }} />
            )}
            <h3>{curso.nome}</h3>
            <p>{curso.descricao}</p>
            <p><b>Início:</b> {curso.inicio}</p>
            <p><b>Inscritos:</b> {curso.inscricoes}</p>
            {curso.inscrito ? (
              <p style={{ color: 'blue' }}>Você já está inscrito</p>
            ) : (
              <button onClick={() => inscrever(curso.id)} disabled={inscrevendo === curso.id}>
                {inscrevendo === curso.id ? 'Inscrevendo...' : 'Inscrever-se'}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
} 