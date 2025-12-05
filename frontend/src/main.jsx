import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

// ✅ YOU MISSED THIS LINE — REQUIRED FOR TAILWIND
import "./index.css";  

import { AuthProvider } from "./context/AuthContext";
import { BrowserRouter } from "react-router-dom";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <AuthProvider>
      <App />
    </AuthProvider>
  </BrowserRouter>
);
