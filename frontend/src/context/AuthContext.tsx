import type { Property } from "@/api/PropertyApi";
import { authApi, type User } from "../api/authApi";
import { createContext, useContext, useEffect, useState } from "react";

interface AuthContextType {
  user: User | null;
  setUser: (user: User) => void;
  loading: boolean;
  token: string | null;
  login: (name: string, password: string) => Promise<User>;
  register: (
    name: string,
    email: string,
    password: string,
    contact?: string,
    role?: "Customer" | "Owner" | "Admin"
  ) => Promise<void>;
  logout: () => Promise<void>;
  fetchProfile: (id: number) => Promise<User | null>;
  getUser: (id: string) => Promise<User>;
  favorites: Property[];
  toggleFavorite: (property: Property) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [favorites, setFavorites] = useState<Property[]>([]);
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );
  const [loading, setLoading] = useState(true);

  // load user on app start
  useEffect(() => {
    const init = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      setLoading(false);
    };
    init();
  }, [token]);

  // login
  const login = async (email: string, password: string): Promise<User> => {
    const res = await authApi.login({ email, password });
    const loggedUser = res.data.user;
    setUser(loggedUser);
    setToken(res.data.token);
    localStorage.setItem("token", res.data.token);
    return loggedUser;
  };

  // register
  const register = async (
    name: string,
    email: string,
    password: string,
    contact?: string,
    role?: "Customer" | "Admin" | "Owner"
  ): Promise<void> => {
    const res = await authApi.register({
      name,
      email,
      password,
      role,
      contact,
    });
    setUser(res.data.user);
    setToken(res.data.token);
    localStorage.setItem("token", res.data.token);
  };

  const logout = async () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    setFavorites([]);
  };

  const toggleFavorite = (property: Property) => {
    setFavorites((prev) => {
      const exists = prev.some((p) => p.id === property.id);
      if (exists) {
        return prev.filter((p) => p.id !== property.id);
      } else {
        return [...prev, property];
      }
    });
  };

  // fetch logged-in user's profile
  const fetchProfile = async (id: number): Promise<User | null> => {
    if (!token) return null;
    // const userId = user?.id;
    // if (!userId) return null;
    try {
      const res = await authApi.getProfile(id);
      setUser(res.data);
      return res.data;
    } catch (err) {
      console.error("Failed to fetch profile:", err);
      logout();
      return null;
    }
  };

  // get user by id
  const getUser = async (id: string): Promise<User> => {
    const res = await authApi.getUser(Number(id));
    return res.data;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        token,
        loading,
        login,
        register,
        logout,
        fetchProfile,
        getUser,
        favorites,
        toggleFavorite,
      }}
    >
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
