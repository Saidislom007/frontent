import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css"; // external CSS fayl

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false); // 👈 show/hide password uchun

  const navigate = useNavigate();

  const handleLogin = async () => {
    setError("");

    try {
      const response = await fetch("http://192.168.100.99:5050/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      localStorage.setItem("token", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);
      localStorage.setItem("userId", data.user?.id || "");

      navigate("/profile");
      window.location.reload();
    } catch (err) {
      console.error("Login Error:", err);
      setError(err.message);
    }
  };

  return (
    <div className="container">
      <h1 className="title">Welcome back!</h1>

      <div className="paper">
        {error && <p className="error-text">{error}</p>}

        <div className="input-field">
          <label><strong>Email</strong></label>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="input-field password-field">
          <label><strong>Password</strong></label>
          <div className="password-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <span
              className="toggle-password"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? "🙈" : "👁️"}
            </span>
          </div>
        </div>

        <button
          className="button"
          onClick={handleLogin}
          disabled={!email || !password}
        >
          Sign in
        </button>
      </div>
    </div>
  );
};

export default Login;
