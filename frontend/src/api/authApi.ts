import api from "./api";

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  role?: "user" | "admin" | "Customer";
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

  getProfile: () => api.get<User>("/users/profile"),

  updateUser: (id: string) => api.get<AuthResponse>(`/users/${id}`),
};
