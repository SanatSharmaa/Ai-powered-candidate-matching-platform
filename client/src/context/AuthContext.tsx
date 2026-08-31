import { createContext, useState, useEffect, ReactNode } from "react";
import api from "../api/client";
import { User, AuthResponse } from "../types";

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role: "EMPLOYER" | "CANDIDATE") => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  loading: true,
  login: async () => {},
  register: async () => {},
  logout: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem("devhire_token");
    const savedUser = localStorage.getItem("devhire_user");
    if (savedToken && savedUser) {
      try {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem("devhire_token");
        localStorage.removeItem("devhire_user");
      }
    }
    setLoading(false);
  }, []);

  const handleAuth = (data: AuthResponse["data"]) => {
    setUser(data.user);
    setToken(data.token);
    localStorage.setItem("devhire_token", data.token);
    localStorage.setItem("devhire_user", JSON.stringify(data.user));
  };

  const login = async (email: string, password: string) => {
    const res = await api.post<AuthResponse>("/auth/login", { email, password });
    handleAuth(res.data.data);
  };

  const register = async (name: string, email: string, password: string, role: "EMPLOYER" | "CANDIDATE") => {
    const res = await api.post<AuthResponse>("/auth/register", { name, email, password, role });
    handleAuth(res.data.data);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("devhire_token");
    localStorage.removeItem("devhire_user");
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
