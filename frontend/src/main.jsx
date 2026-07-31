// import { StrictMode } from 'react'
import { AuthProvider } from "./context/AuthContext";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { Toaster } from "react-hot-toast";

createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <Toaster position="top-right" />
    <App />
  </AuthProvider>,
);
