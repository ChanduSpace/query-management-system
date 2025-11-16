import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Set up axios interceptor for auth
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }

    // Check if user is logged in on app start
    const checkLoggedIn = async () => {
      try {
        if (token) {
          const response = await axios.get("http://localhost:5000/api/auth/me");
          setUser(response.data);
        }
      } catch (error) {
        localStorage.removeItem("token");
        delete axios.defaults.headers.common["Authorization"];
      } finally {
        setLoading(false);
      }
    };

    checkLoggedIn();
  }, []);

  const login = async (email, password) => {
    const response = await axios.post("http://localhost:5000/api/auth/login", {
      email,
      password,
    });

    if (response.data) {
      localStorage.setItem("token", response.data.token);
      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${response.data.token}`;
      setUser(response.data);
    }

    return response.data;
  };

  const register = async (userData) => {
    const response = await axios.post(
      "http://localhost:5000/api/auth/register",
      userData
    );

    if (response.data) {
      localStorage.setItem("token", response.data.token);
      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${response.data.token}`;
      setUser(response.data);
    }

    return response.data;
  };

  const logout = () => {
    localStorage.removeItem("token");
    delete axios.defaults.headers.common["Authorization"];
    setUser(null);
  };

  const updateProfile = async (userData) => {
    const response = await axios.put(
      "http://localhost:5000/api/auth/profile",
      userData
    );
    setUser(response.data);
    return response.data;
  };

  const value = {
    user,
    login,
    register,
    logout,
    updateProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
