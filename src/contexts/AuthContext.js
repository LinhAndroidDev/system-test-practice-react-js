import React, { createContext, useContext, useState, useEffect } from "react";
import AuthController from "../controllers/AuthController";

const AuthContext = createContext(null);

const authController = new AuthController();

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    user: null,
    isAuthenticated: false,
    loading: true,
  });

  useEffect(() => {
    // Subscribe to auth controller updates
    authController.onUpdate((newState) => {
      setAuthState({
        user: newState.user,
        isAuthenticated: newState.isAuthenticated,
        loading: newState.loading,
      });
    });

    // Initial check
    authController.checkAuth();
    setAuthState({
      user: authController.user,
      isAuthenticated: authController.isAuthenticated,
      loading: false,
    });

    return () => {
      authController.onUpdate(null);
    };
  }, []);

  const logout = () => {
    authController.logout();
  };

  return (
    <AuthContext.Provider value={{ ...authState, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

