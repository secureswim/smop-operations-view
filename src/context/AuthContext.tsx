import React, { createContext, useContext, useState, ReactNode } from "react";

export type UserRole = "admin" | "purchase" | "stores" | "manufacturing" | "sales";

interface AuthContextType {
  isLoggedIn: boolean;
  username: string;
  role: UserRole;
  login: (username: string, role: UserRole) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [role, setRole] = useState<UserRole>("admin");

  const login = (u: string, r: UserRole) => {
    setUsername(u);
    setRole(r);
    setIsLoggedIn(true);
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUsername("");
    setRole("admin");
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, username, role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
