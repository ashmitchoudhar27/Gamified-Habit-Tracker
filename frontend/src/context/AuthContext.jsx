// src/context/AuthContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [user, setUser] = useState(null);

  // login expects (token, userData) OR (responseObject) depending on your login flow
  const login = (tokenValue, userData) => {
    if (!tokenValue) return;
    localStorage.setItem("token", tokenValue);
    setToken(tokenValue);
    if (userData) setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    // optional: redirect handled by components
  };

  // Fetch current user when token exists
  useEffect(() => {
    if (!token) return;
    const fetchMe = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.user) setUser(data.user);
      } catch (err) {
        console.error("Auth fetchMe error:", err);
        // if error, clear token
        // logout();
      }
    };
    fetchMe();
  }, [token]);

  return (
    <AuthContext.Provider value={{ token, user, setUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
