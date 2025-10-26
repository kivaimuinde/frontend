import LoginForm from "../components/LoginForm";
import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

export default function LoginPage({ onLogin }) {
  
  const location = useLocation();
  const [flashMessage, setFlashMessage] = useState("");
  
  useEffect(() => {
    if (location.state?.successMessage) {
      setFlashMessage(location.state.successMessage);
      const timer = setTimeout(() => setFlashMessage(""), 4000); // hide after 4s
      return () => clearTimeout(timer);
    }
  }, [location.state]);
  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
    <div className="w-100" style={{ maxWidth: 400 }}>
    
    {flashMessage && (
      <div className="alert alert-success text-center py-2">
      {flashMessage}
      </div>
    )}
    <LoginForm onLogin={onLogin} />
    
    <div className="text-center mt-3">
    <div className="text-center mt-3">
    <Link
    to="/register"
    className="btn btn-outline-link me-2 text-decoration-none"
    >
    Sign Up
    </Link>
    <Link
    to="/reset-password"
    className="btn btn-outline-link text-decoration-none"
    >
    Forgot Password?
    </Link>
    </div>
    
    </div>
    </div>
    </div>
  );
}
