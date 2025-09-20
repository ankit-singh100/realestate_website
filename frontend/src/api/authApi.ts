import api from "./api";

export interface User {
  id: number;
  name: string;
  email: string;
  password?: string;
  contact?: string;
  avatarUrl?: string;
  role?: "Owner" | "Admin" | "Customer";
  createdAt?: string;
  updatedAt?: string;
  verified?: boolean;
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
    contact?: string;
    role?: string;
  }) => api.post<AuthResponse>("/auth/register", data),

  logout: async () => {
    localStorage.removeItem("token");
  },

  getProfile: (id: number) => api.get<User>(`/users/profile/${id}`),

  getAllUser: () => api.get<User[]>("/users"),

  updateUser: (id: string, data: Partial<User>) =>
    api.patch<AuthResponse>(`/users/${id}`, data),

  uploadImage: (id: string, fileData: FormData) =>
    api.post<User>(`/users/avatar/${id}`, fileData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),

  deleteAvatar: (id: string | number) =>
    api.delete(`/users/${id}/deleteavatar`),

  getUser: (id: number) => api.get<User>(`/users/${id}`),
};
