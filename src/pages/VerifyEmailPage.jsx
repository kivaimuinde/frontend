import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/axios";

export default function VerifyEmailPage() {
  const { uid, token } = useParams();
  const [message, setMessage] = useState("Verifying...");

  useEffect(() => {
    api
      .get(`verify-email/${uid}/${token}/`)
      .then(() => setMessage("Email verified successfully! You can now log in."))
      .catch(() => setMessage("Invalid or expired verification link."));
  }, [uid, token]);

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card p-4 shadow-sm text-center">
        <h4>{message}</h4>
      </div>
    </div>
  );
}
