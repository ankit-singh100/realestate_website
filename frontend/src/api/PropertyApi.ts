import api from "./api";

export interface Property {
  id: number;
  title: string;
  description?: string;
  price: number;
  address: string;
  status: "onSale" | "Sold" | "forRental" | "Rented" | "Pending";
  type: "House" | "Apartment" | "Land";
  images?: { id: number; url: string; contact: string }[];
  ownerId?: [];
  createdAt?: string;
  updatedAt?: string;
}

//interface for image
export interface PropertyImage {
  id: number;
  url: string;
  publicId?: string;
  propertyId?: number;
}

interface paginationProperties {
  data: Property[];
  totalPages: number;
  currentPages: number;
}

const propertyApi = {
  // get all properties with optional filters
  getAll: async (
    page = 1,
    limit = 10,
    search?: string
  ): Promise<paginationProperties> => {
    const res = await api.get<paginationProperties>("/properties", {
      params: { page, limit, search },
    });
    return res.data;
  },

  // new filtered search API
  getAllFiltered: async (filters: { search?: string }) => {
    const query = new URLSearchParams(filters as any).toString();
    const res = await api.get<paginationProperties>(`/properties?${query}`);
    return res.data; // should return { data, totalProperties, ... } from backend
  },

  //   get single property by id
  getById: async (id: number) => {
    const res = await api.get<Property>(`/properties/get/${id}`);
    return res.data;
  },

  // Create property
  create: async (data: Omit<Property, "id" | "updatedAt">) => {
    const res = await api.post<Property>("/properties", data);
    return res.data;
  },

  // Update property
  update: async (
    id: number,
    data: Partial<Omit<Property, "id" | "createdAt" | "updatedAt">>
  ) => {
    const res = await api.patch<Property>(`/properties/${id}`, data);
    return res.data;
  },

  // Delete property
  delete: async (id: number) => {
    const res = await api.delete<{ message: string }>(`/properties/${id}`);
    return res.data;
  },

  // Fetch properties for a specific owner
  getByOwner: async (ownerId: number) => {
    const res = await api.get(`/properties/owner/${ownerId}`);
    return res.data as Property[];
  },

  // Add propertyimage
  upload: async (propertyId: number, file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    const res = await api.post<PropertyImage>(
      `/property-image/${propertyId}`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    return res.data;
  },
  // get propertyImage
  findAll: async () => {
    const res = await api.get<PropertyImage>("/property-image");
    return res.data;
  },

  // Delete image
  deleteImage: async (propertyId: number) => {
    const res = await api.delete<PropertyImage>(
      `/property-image/${propertyId}`
    );
    return res.data;
  },

  markInterested: async (propertyId: number) => {
    const res = await api.post(`/properties/${propertyId}/interested`);
    return res.data;
  },
};

export default propertyApi;
