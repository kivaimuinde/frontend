import { useState } from "react";
import api from "../api/axios";

export default function ResetPasswordForm({ onSuccess }) {
  const [form, setForm] = useState({
    username: "",
    new_password: "",
    confirm_password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (form.new_password !== form.confirm_password) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const res = await api.post("password-reset/", form);
      setLoading(false);
      onSuccess(res.data.success || "Password reset successful! You can now log in.");
    } catch (err) {
      setLoading(false);
      if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError("Password reset failed. Please check your username and try again.");
      }
    }
  };

  return (
    <div className="card p-4 shadow-sm">
      <h4 className="text-center mb-3">Reset Password</h4>
      {error && <p className="text-danger text-center small">{error}</p>}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Enter your username"
            name="username"
            value={form.username}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <input
            type="password"
            className="form-control"
            placeholder="Enter new password"
            name="new_password"
            value={form.new_password}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <input
            type="password"
            className="form-control"
            placeholder="Confirm new password"
            name="confirm_password"
            value={form.confirm_password}
            onChange={handleChange}
            required
          />
        </div>

        <button
          type="submit"
          className="btn btn-primary w-100"
          disabled={loading}
        >
          {loading ? "Resetting..." : "Reset Password"}
        </button>
      </form>
    </div>
  );
}
