import { authApi } from "./authApi";

export const ProfileApi = {
  getProfile: async () => {
    const res = await authApi.getProfile();
    return res.data;
  },
  
};
