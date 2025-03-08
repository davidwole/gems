import { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || "");

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);

        // Check token expiration
        const currentTime = Date.now() / 1000;
        if (decoded.exp && decoded.exp < currentTime) {
          console.log("Token expired");
          logout();
          return;
        }

        setUser(decoded);
      } catch (error) {
        console.error("Invalid token:", error);
        logout();
      }
    }
  }, [token]);

  const login = (newToken) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);

    try {
      const decoded = jwtDecode(newToken);
      setUser(decoded);
    } catch (error) {
      console.error("Error decoding token:", error);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken("");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
