// src/pages/Login.jsx
import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const API = import.meta.env.VITE_BACKEND_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`${API}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Login failed");
        setLoading(false);
        return;
      }

      login(data.token, data.user);
    } catch (err) {
      console.error(err);
      alert("Error connecting to server.");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F5F5F7]">
      <div className="w-full max-w-md bg-white rounded-3xl p-10 shadow-[0_10px_40px_rgba(0,0,0,0.08)] border border-[#E5E5E5]">
        
        {/* Apple-like Header */}
        <h2 className="text-3xl font-semibold text-center mb-8 text-[#1D1D1F] tracking-tight">
          Welcome back
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-[#555] mb-1">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="
                w-full px-4 py-3 rounded-xl 
                bg-[#F8F8F9] border border-[#D1D1D6] 
                focus:outline-none focus:ring-2 focus:ring-[#A970FF] focus:border-transparent 
                transition-all
              "
              placeholder="you@example.com"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-[#555] mb-1">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="
                w-full px-4 py-3 rounded-xl 
                bg-[#F8F8F9] border border-[#D1D1D6] 
                focus:outline-none focus:ring-2 focus:ring-[#A970FF] focus:border-transparent 
                transition-all
              "
              placeholder="••••••••"
            />
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className="
              w-full py-3 rounded-xl 
              bg-gradient-to-r from-[#A970FF] to-[#8754F3] 
              text-white text-lg font-medium tracking-wide 
              shadow-[0_4px_14px_rgba(135,84,243,0.35)]
              hover:shadow-[0_6px_20px_rgba(135,84,243,0.45)]
              active:scale-[0.98] 
              transition-all
            "
          >
            {loading ? "Logging in…" : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
