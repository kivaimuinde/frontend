import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import Dashboard from "./pages/Dashboard";
import TripDetail from "./pages/TripDetail";
import ELDLogViewer from "./components/ELDLogViewer"; // ✅ NEW IMPORT

// Token validation utility
const isTokenValid = () => {
  const token = localStorage.getItem("access");
  if (!token) return false;

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const expirationTime = payload.exp * 1000; 
    return Date.now() < expirationTime;
  } catch (error) {
    return false;
  }
};

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(isTokenValid());

  useEffect(() => {
    const checkAuth = () => {
      const valid = isTokenValid();
      if (!valid && isAuthenticated) {
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        setIsAuthenticated(false);
      }
    };

    checkAuth();
    const interval = setInterval(checkAuth, 30000);
    return () => clearInterval(interval);
  }, [isAuthenticated]);

  useEffect(() => {
    const originalFetch = window.fetch;
    
    window.fetch = async (...args) => {
      let response = await originalFetch(...args);
      if (response.status === 401) {
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        setIsAuthenticated(false);
        return response;
      }
      return response;
    };

    return () => {
      window.fetch = originalFetch;
    };
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    setIsAuthenticated(false);
  };

  return (
    <BrowserRouter>
      <Routes>
        {!isAuthenticated ? (
          <>
            <Route path="/" element={<LoginPage onLogin={handleLogin} />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </>
        ) : (
          <>
            <Route path="/" element={<Dashboard onLogout={handleLogout} />} />
            <Route path="/trip/:id" element={<TripDetail onLogout={handleLogout} />} />
            <Route path="/trip/:id/logs" element={<ELDLogViewer />} /> 
            <Route path="*" element={<Navigate to="/" replace />} />
          </>
        )}
      </Routes>
    </BrowserRouter>
  );
}
