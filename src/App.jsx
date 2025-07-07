import React, { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Cadastro from "./pages/Cadastro";
import Cursos from "./pages/Cursos";
import Dashboard from "./pages/Dashboard";
import Navbar from "./components/Navbar";
import { useAuth } from "./context/AuthContext";

function App() {
  const { usuario } = useAuth();

  useEffect(() => {
    console.log('AuthContext usuario:', usuario);
  }, [usuario]);

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Cursos />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
}

export default App;
