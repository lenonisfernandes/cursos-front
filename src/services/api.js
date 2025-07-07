import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000", // Altere para a URL da sua API se necessário
  withCredentials: true, // Para enviar cookies (JWT)
});

export default api; 