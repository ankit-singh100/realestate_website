import api from "./api";

export interface User {
  id: number;
  name: string;
  email: string;
  avatarUrl?: string;
  role?: "Owner" | "Admin" | "Customer";
}

interface AuthResponse {
  user: User;
  token: string;
}

export const authApi = {
  login: (data: { email: string; password: string }) =>
    api.post<AuthResponse>("/auth/login", data),

  register: (data: {
    name: string;
    email: string;
    password: string;
    role?: string;
  }) => api.post<AuthResponse>("/auth/register", data),

  logout: async () => {
    localStorage.removeItem("token");
  },

  fetchProfile: () => api.get<User>("/users/profile"),

  getProfile: (id: number) => api.get<User>(`/users/profile/${id}`),

  updateUser: (id: string) => api.patch<AuthResponse>(`/users/${id}`),

  getUser: (id: number) => api.get<User>(`/users/${id}`),
};
