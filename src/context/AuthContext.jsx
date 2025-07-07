import React, { createContext, useContext, useState, useEffect } from "react";
import * as jwt_decode from "jwt-decode";

function decodeToken(token) {
  return jwt_decode.default ? jwt_decode.default(token) : jwt_decode(token);
}

const AuthContext = createContext();

function getUserFromToken() {
  const match = document.cookie.match(/(?:^|; )token=([^;]*)/);
  console.log('getUserFromToken: cookie match', match);
  if (match) {
    try {
      const decoded = decodeToken(match[1]);
      console.log('getUserFromToken: decoded', decoded);
      return decoded;
    } catch (e) {
      console.log('getUserFromToken: erro ao decodificar', e);
      return null;
    }
  }
  return null;
}

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(() => {
    const salvo = localStorage.getItem("usuario");
    if (salvo) return JSON.parse(salvo);
    return getUserFromToken();
  });

  function login(userFromToken) {
    if (userFromToken) {
      setUsuario(userFromToken);
      localStorage.setItem("usuario", JSON.stringify(userFromToken));
    }
  }

  function logout() {
    setUsuario(null);
    localStorage.removeItem("usuario");
  }

  useEffect(() => {
    console.log('AuthContext useEffect rodou, usuario:', usuario);
    if (!usuario) {
      const userFromToken = getUserFromToken();
      if (userFromToken) {
        setUsuario(userFromToken);
        localStorage.setItem("usuario", JSON.stringify(userFromToken));
      }
    }
  }, []);

  return (
    <AuthContext.Provider value={{ usuario, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
} 