import { useState } from "react";
import api from "../api/axios";

export default function LoginForm({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Always clear any stale tokens before attempting login
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");

      const res = await api.post("token/", { username, password });

      // Save new tokens
      localStorage.setItem("access", res.data.access);
      localStorage.setItem("refresh", res.data.refresh);

      setLoading(false);
      onLogin();
    } catch (err) {
      setLoading(false);
      // On failure, clear tokens to avoid "unauthorized" reuse
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");

      // Display error message
      if (err.response?.status === 401) {
        setError("Invalid username or password.");
      } else {
        setError("An error occurred. Please try again later.");
      }
    }
  };

  return (
    <div className="card p-4 shadow-sm">
      <h4 className="text-center mb-3">Driver Login</h4>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <input
            type="password"
            className="form-control"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {error && <p className="text-danger text-center small">{error}</p>}

        <button
          type="submit"
          className="btn btn-primary w-100"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}
