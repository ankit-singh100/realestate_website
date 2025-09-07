import api from "./api";

export const adminApi = {
  //User management
  getUsers: () => api.get("/users/admin"),
  getUserById: (id: string) => api.get(`users/${id}`),
  updateUser: (id: string, data: any) => api.patch(`/users/admin/${id}`, data),
  deleteUser: (id: string) => api.delete(`/users/admin/${id}`),

  // Property management
  getProperties: () => api.get("/properties"),
  approveProperty: (id: string) => api.patch(`/properties/${id}/approve`),
  rejectProperty: (id: string) => api.patch(`/properties/${id}/reject`),

  //   Reports / analytics
  getReports: () => api.get("/admin/reports"),
};
