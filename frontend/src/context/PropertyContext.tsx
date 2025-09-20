import { createContext, useContext, useEffect, useState } from "react";
import type { Property } from "../api/PropertyApi";
import { useAuth } from "./AuthContext";
import propertyApi from "../api/PropertyApi";

interface PropertyContextType {
  properties: Property[];
  loading: boolean;
  fetchProperties: () => Promise<void>;
  getProperty: (id: number) => Promise<Property | null>;
  createProperty: (
    data: Partial<Property>,
    file?: File
  ) => Promise<Property | null>;
  updateProperty: (
    id: number,
    data: Partial<Property>
  ) => Promise<Property | null>;
  // deleteProperty: (id: number) => Promise<void>;
}

const PropertyContext = createContext<PropertyContextType | undefined>(
  undefined
);

export const PropertyProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const { token } = useAuth(); // if you store JWT in AuthContext

  // Fetch all properties
  const fetchProperties = async () => {
    if (!token) return; // Only fetch if user is logged in
    setLoading(true);
    try {
      const data = await propertyApi.getAll();
      setProperties(data.data);
    } catch (err) {
      console.error("Failed to fetch properties:", err);
    } finally {
      setLoading(false);
    }
  };

  // Get a single property
  const getProperty = async (id: number) => {
    try {
      const property = await propertyApi.getById(id);
      return property;
    } catch (err) {
      console.error("Failed to get property:", err);
      return null;
    }
  };

  // Create a property (with optional image)
  const createProperty = async (data: Partial<Property>, file?: File) => {
    try {
      let formData: any;
      if (file) {
        formData = new FormData();
        Object.entries(data).forEach(([key, value]) => {
          formData.append(key, value as any);
        });
        formData.append("file", file);
      }

      const created = file
        ? await propertyApi.create(formData)
        : await propertyApi.create(data as any);

      setProperties((prev) => [...prev, created]);
      return created;
    } catch (err) {
      console.error("Failed to create property:", err);
      return null;
    }
  };

  // Update property
  const updateProperty = async (id: number, data: Partial<Property>) => {
    try {
      const updated = await propertyApi.update(id, data);
      setProperties((prev) => prev.map((p) => (p.id === id ? updated : p)));
      return updated;
    } catch (err) {
      console.error("Failed to update property:", err);
      return null;
    }
  };

//   // Delete property
//   const deleteProperty = async (id: number) => {
//     try {
//       await propertyApi.delete(id);
//       setProperties((prev) => prev.filter((p) => p.id !== id));
//     } catch (err) {
//       console.error("Failed to delete property:", err);
//     }
//   };

  useEffect(() => {
    if (token) fetchProperties();
  }, [token]);

  return (
    <PropertyContext.Provider
      value={{
        properties,
        loading,
        fetchProperties,
        getProperty,
        createProperty,
        updateProperty,
      }}
    >
      {children}
    </PropertyContext.Provider>
  );
};

export const useProperty = () => {
  const context = useContext(PropertyContext);
  if (!context)
    throw new Error("useProperty must be used within PropertyProvider");
  return context;
};
