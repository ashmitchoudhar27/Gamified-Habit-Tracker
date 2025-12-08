// src/context/AuthContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [user, setUser] = useState(null);

  // login(token, userData)
  const login = (tokenValue, userData = null) => {
    if (!tokenValue) return;
    localStorage.setItem("token", tokenValue);
    setToken(tokenValue);
    if (userData) setUser(userData);
    // navigate to dashboard
    navigate("/dashboard", { replace: true });
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    // redirect to root login page
    navigate("/", { replace: true });
    // fallback full reload to ensure all state cleared
    window.location.href = "/";
  };

  // fetch current user when token changes
  useEffect(() => {
    if (!token) return;
    const fetchMe = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        // if server returns HTML (error), avoid crash
        const ct = res.headers.get("content-type") || "";
        if (!res.ok) {
          // if unauthorized or server error -> clear token
          console.warn("Auth fetchMe not ok", res.status);
          logout();
          return;
        }
        const data = ct.includes("application/json") ? await res.json() : null;
        if (data?.user) setUser(data.user);
      } catch (err) {
        console.error("Auth fetchMe error:", err);
        // clear token on fetch error
        logout();
      }
    };
    fetchMe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  return (
    <AuthContext.Provider value={{ token, user, setUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
