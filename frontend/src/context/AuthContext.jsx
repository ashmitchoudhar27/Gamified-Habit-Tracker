import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [user, setUser] = useState(null);

  // Login → save token & user
  const login = (tokenValue, userData) => {
    localStorage.setItem("token", tokenValue);
    setToken(tokenValue);
    setUser(userData);
  };

  // Logout
  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  // Load user if token exists
  useEffect(() => {
    if (!token) return;

    const fetchUser = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/auth/me`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();

        // Backend returns: { user: { ...fields } }
        setUser(data.user ?? data);
      } catch (err) {
        console.error("Failed to load user:", err);
        logout();
      }
    };

    fetchUser();
  }, [token]);

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        setUser,     // 🔥 FIX ADDED
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
