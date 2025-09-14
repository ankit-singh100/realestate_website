import api from "./api";

export interface Property {
  id: number;
  title: string;
  description?: string;
  price: number;
  address: string;
  status: "Available" | "Sold" | "Pending";
  type: "House" | "Apartment" | "Land";
  images?: { id: number; url: string }[];
  createdAt?: string;
  updatedAt?: string;
}

//interface for image
interface PropertyImage {
  id: number;
  url: string;
  publicId: string;
}

interface paginationProperties {
  data: Property[];
  totalPages: number;
  currentPages: number;
}

const propertyApi = {
  // get all properties with optional filters
  getAll: async (page = 1, limit = 10): Promise<paginationProperties> => {
    const res = await api.get<paginationProperties>("/properties", {
      params: { page, limit },
    });
    return res.data;
  },

  //   get single property by id
  getById: async (id: number) => {
    const res = await api.get<Property>(`/properties/${id}`);
    return res.data;
  },

  // Create property
  create: async (data: Omit<Property, "id" | "createdAt" | "updatedAt">) => {
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

  // get propertyImage
  findAll: async () => {
    const res = await api.post<PropertyImage>("/property-image");
    return res.data;
  },
};

export default propertyApi;
