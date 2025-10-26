import RegisterForm from "../components/RegisterForm";
import { Link, useNavigate } from "react-router-dom";

export default function RegisterPage() {
  const navigate = useNavigate();

  const handleRegistered = () => {
    navigate("/", {
      state: { successMessage: "Registration successful! Please log in." },
    });
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="w-100" style={{ maxWidth: 400 }}>
        <RegisterForm onRegistered={handleRegistered} />
        <div className="text-center mt-3">
          <Link
            to="/"
            className="btn btn-outline-link text-decoration-none"
          >
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}
