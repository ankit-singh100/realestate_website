import api from "./api";
import { type Property } from "./PropertyApi";

export const addFavorite = async (userId: number, propertyId: number) => {
  try {
    const res = await api.post("/favourites", { userId, propertyId });
    return res.data;
  } catch (error) {
    console.error("Add Favorite error:", error);
    throw new Error("Failed to add favorite");
  }
};

export const removeFavorite = async (userId: number, propertyId: number) => {
  try {
    const res = await api.delete("/favourites", {
      params: { userId, propertyId },
    });
    return res.data;
  } catch (error) {
    console.error("Remove Favorite error:", error);
    throw new Error("Failed to remove favorite");
  }
};

export const getFavorite = async (userId: number) => {
  try {
    const res = await api.get<Property[]>(`/favourites/${userId}`);
    return res.data;
  } catch (error) {
    console.error("Get Favorite error:", error);
    throw new Error("Failed to fetch favorite");
  }
};
export const getAllFavorite = async () => {
  try {
    const res = await api.get<Property[]>("/favourites");
    return res.data;
  } catch (error) {
    console.error("Get Favorite error:", error);
    throw new Error("Failed to fetch favorite");
  }
};
