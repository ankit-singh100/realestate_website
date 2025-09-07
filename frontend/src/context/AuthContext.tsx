import { authApi, type User } from "../api/authApi";
import { createContext, useContext, useEffect, useState } from "react";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (name: string, password: string) => Promise<void>;
  register: (
    name: string,
    email: string,
    password: string,
    role?: "Customer" | "Owner" | "Admin"
  ) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // load user on app start
  useEffect(() => {
    async () => {
      try {
        const profile = await authApi.getProfile();
        setUser(profile.data);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
  });

  // login
  const login = async (email: string, password: string): Promise<void> => {
    const res = await authApi.login({ email, password });
    const token = res.data.token;
    localStorage.setItem("token", token);
    setUser(res.data.user);
  };

  // register
  const register = async (
    name: string,
    email: string,
    password: string,
    role?: "Customer" | "Admin" | "Owner"
  ): Promise<void> => {
    const res = await authApi.register({ name, email, password, role });
    setUser(res.data.user);
  };

  const logout = async () => {
    await authApi.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook for easy usage
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
};
