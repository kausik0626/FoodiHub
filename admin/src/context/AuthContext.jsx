import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("ownerToken") || "");
  const [owner, setOwner] = useState(() => {
    const raw = localStorage.getItem("ownerProfile");
    return raw ? JSON.parse(raw) : null;
  });
  const [loading, setLoading] = useState(Boolean(token));

  const persistSession = (nextToken, nextOwner) => {
    setToken(nextToken);
    setOwner(nextOwner);
    localStorage.setItem("ownerToken", nextToken);
    localStorage.setItem("ownerProfile", JSON.stringify(nextOwner));
  };

  const logout = () => {
    setToken("");
    setOwner(null);
    localStorage.removeItem("ownerToken");
    localStorage.removeItem("ownerProfile");
  };

  const fetchProfile = async (activeToken = token) => {
    if (!activeToken) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/api/user/owner/profile`, {
        headers: { token: activeToken },
      });

      if (res.data.success) {
        setOwner(res.data.owner);
        localStorage.setItem("ownerProfile", JSON.stringify(res.data.owner));
      } else {
        logout();
      }
    } catch (error) {
      console.error("Failed to fetch owner profile:", error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile(token);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        apiUrl: API_URL,
        token,
        owner,
        loading,
        persistSession,
        fetchProfile,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
