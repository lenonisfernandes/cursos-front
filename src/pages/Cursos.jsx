import React, { useEffect, useState } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Cursos() {
  const { usuario } = useAuth();
  const [cursos, setCursos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [cancelando, setCancelando] = useState(null);
  const navigate = useNavigate();

  async function buscarCursos() {
    setCarregando(true);
    setErro("");
    try {
      const { data } = await api.get(`/${usuario.id}`);
      setCursos(data);
    } catch (err) {
      setErro("Erro ao buscar seus cursos.");
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    if (!usuario) {
      setCarregando(false);
      return;
    }
    buscarCursos();
    // eslint-disable-next-line
  }, [usuario]);

  async function cancelarInscricao(idCurso) {
    setMensagem("");
    setErro("");
    setCancelando(idCurso);
    try {
      await api.patch(`/cursos/${idCurso}`);
      setMensagem("Inscrição cancelada com sucesso!");
      await buscarCursos();
    } catch (err) {
      setErro(err.response?.data?.mensagem || "Erro ao cancelar inscrição.");
    } finally {
      setCancelando(null);
    }
  }

  if (!usuario) {
    return (
      <div style={{ maxWidth: 400, margin: "40px auto" }}>
        <h2>Meus Cursos</h2>
        <p>Você precisa <button onClick={() => navigate('/login')}>fazer login</button> para ver seus cursos.</p>
      </div>
    );
  }

  if (carregando) return <p>Carregando seus cursos...</p>;
  if (erro) return <p style={{ color: "red" }}>{erro}</p>;

  return (
    <div style={{ maxWidth: 800, margin: "40px auto" }}>
      <h2>Meus Cursos</h2>
      {mensagem && <p style={{ color: 'green' }}>{mensagem}</p>}
      {cursos.length === 0 && <p>Você não está inscrito em nenhum curso.</p>}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 24 }}>
        {cursos.map(curso => (
          <div key={curso.id} className="card" style={{ width: 320, minHeight: 340, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            {curso.capa && (
              <img src={curso.capa} alt={curso.nome} style={{ width: "100%", height: 140, objectFit: "cover", borderRadius: 8, marginBottom: 16, border: '1px solid var(--color-border)' }} />
            )}
            <div style={{ flex: 1 }}>
              <h3 style={{ fontSize: 22, margin: '0 0 8px 0', color: 'var(--color-primary)' }}>{curso.nome}</h3>
              <p style={{ color: 'var(--color-text-secondary)', margin: '0 0 12px 0', fontSize: 15 }}>{curso.descricao}</p>
              <p style={{ fontSize: 14, margin: '0 0 6px 0' }}><b>Início:</b> {curso.inicio}</p>
              <p style={{ fontSize: 14, margin: 0 }}><b>Inscritos:</b> {curso.inscricoes}</p>
            </div>
            <div style={{ marginTop: 18 }}>
              {curso.inscricao_cancelada ? (
                <p style={{ color: 'orange', fontWeight: 600, margin: 0 }}>Inscrição cancelada</p>
              ) : (
                <button onClick={() => cancelarInscricao(curso.id)} disabled={cancelando === curso.id} style={{ width: '100%', fontSize: 16 }}>
                  {cancelando === curso.id ? 'Cancelando...' : 'Cancelar inscrição'}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 