import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { loginUser } from "../services/api";
import { useNavigate } from "react-router-dom";
import "../styles/login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const data = await loginUser(email, password);

      if (data.token) {
        login(data.token);
        navigate("/dashboard");
      } else if (data.isSuspended) {
        // Special handling for suspended accounts
        setError(
          data.error ||
            "Your account has been suspended. Please contact an administrator."
        );
      } else {
        setError(data.error || "Login failed");
      }
    } catch (err) {
      setError("An error occurred during login");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <h1>Welcome Back</h1>
          <p>Enter your credentials to access your account</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {error && (
            <div
              className={
                error.includes("suspended")
                  ? "warning-message"
                  : "error-message"
              }
            >
              {error}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>

          <button type="submit" className="login-button" disabled={isLoading}>
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
