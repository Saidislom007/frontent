import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    // 200ms ichida autentifikatsiyani tekshirish
    setTimeout(() => {
      setIsAuthenticated(!!token);
    }, 200);
  }, []);

  if (isAuthenticated === null) {
    return <div>Loading...</div>; // ⏳ Authenticationni tekshiryapmiz
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
