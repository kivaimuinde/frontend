import ResetPasswordForm from "../components/ResetPasswordForm";
import { useNavigate, Link } from "react-router-dom";

export default function ResetPasswordPage() {
  const navigate = useNavigate();

  const handleSuccess = (message) => {
    navigate("/", { state: { successMessage: message } });
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="w-100" style={{ maxWidth: 400 }}>
        <ResetPasswordForm onSuccess={handleSuccess} />

        <div className="text-center mt-3">
          <Link
            to="/"
            className="btn btn-outline-link me-2 text-decoration-none"
          >
            Back to Login
          </Link>
          <Link
            to="/register"
            className="btn btn-outline-link text-decoration-none"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
}
