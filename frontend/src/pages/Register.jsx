import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      await register(name, email, password);
      alert("Registration successful!");
      navigate("/");
    } catch (error) {
      alert(error.response?.data?.error || "Registration failed");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 px-4">
      <form
        onSubmit={handleRegister}
        className="bg-gray-800 p-8 rounded-xl shadow-xl w-full max-w-sm"
      >
        <h1 className="text-3xl text-white font-bold text-center mb-6">
          Register
        </h1>

        <input
          type="text"
          placeholder="Name"
          className="w-full p-3 mb-4 rounded bg-gray-700 text-white"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 mb-4 rounded bg-gray-700 text-white"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 mb-4 rounded bg-gray-700 text-white"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded"
        >
          Register
        </button>

        <p className="text-gray-300 text-sm text-center mt-4">
          Already have an account?{" "}
          <Link to="/" className="text-blue-400 hover:underline">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}
