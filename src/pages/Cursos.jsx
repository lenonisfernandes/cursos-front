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
          <div key={curso.id} style={{ border: "1px solid #ccc", borderRadius: 8, padding: 16, width: 300 }}>
            {curso.capa && (
              <img src={curso.capa} alt={curso.nome} style={{ width: "100%", height: 120, objectFit: "cover", borderRadius: 4 }} />
            )}
            <h3>{curso.nome}</h3>
            <p>{curso.descricao}</p>
            <p><b>Início:</b> {curso.inicio}</p>
            <p><b>Inscritos:</b> {curso.inscricoes}</p>
            {curso.inscricao_cancelada ? (
              <p style={{ color: 'orange' }}>Inscrição cancelada</p>
            ) : (
              <button onClick={() => cancelarInscricao(curso.id)} disabled={cancelando === curso.id}>
                {cancelando === curso.id ? 'Cancelando...' : 'Cancelar inscrição'}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
} 