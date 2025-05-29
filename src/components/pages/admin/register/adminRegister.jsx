import React, { useState } from "react";
import "./AdminRegistration.css"; // CSS faylini import qilish
import { useNavigate } from "react-router-dom";
const AdminRegistration = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Loading holati
  const [error, setError] = useState(""); // Xatolikni ko'rsatish uchun

  const handleRegister = async (e) => {
    e.preventDefault();

    // Foydalanuvchi username yoki passwordni kiritmagan bo'lsa, xato chiqarish
    if (!username || !password) {
      setError("Please fill in both fields.");
      return;
    }

    setIsLoading(true); // Loading boshlanadi

    try {
      const response = await fetch("http://192.168.100.99:5050/api/admin/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage("Admin registered successfully");
        setError(""); // Xatolikni tozalash
        navigate("/adminPage");
      } else {
        setMessage(""); // Message'ni tozalash
        setError(data.message); // Xatolikni ko'rsatish
      }
    } catch (err) {
      console.error("Error:", err);
      setMessage(""); // Message'ni tozalash
      setError("Server error"); // Server xatosi
    } finally {
      setIsLoading(false); // Loading tugadi
    }
  };

  return (
    <div className="container">
      <div className="form-container">
        <h2 className="heading">Admin Registration</h2>
        <form onSubmit={handleRegister} className="form">
          <div className="form-group">
            <label htmlFor="username" className="label">Username</label>
            <input
              type="text"
              id="username"
              className="input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password" className="label">Password</label>
            <input
              type="password"
              id="password"
              className="input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="submit-btn" disabled={isLoading}>
            {isLoading ? "Registering..." : "Register Admin"}
          </button>
        </form>
        {message && <p className="message success">{message}</p>}
        {error && <p className="message error">{error}</p>}
      </div>
    </div>
  );
};

export default AdminRegistration;
