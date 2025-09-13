import PropertyCard from "@/components/properties/PropertyCard";
import { useEffect, useState } from "react";

interface Property {
  id: number;
  title: string;
  description?: number;
  price: number;
  address: string;
  imagesUrl?: string;
  status: "Available" | "Sold" | "Rented" | "Pending";
  type: "House" | "Apartment" | "Land";
}

export default function PropertyList() {
  const [properties, setProperties] = useState<Property[]>([]);

  useEffect(() => {
    // Replcae with api call
    setProperties([
      {
        id: 1,
        title: "Luxury villa in ktm",
        price: 150000,
        address: "Lazimpat, ktm",
        imagesUrl: "https://via.placeholder.com/400x250",
        status: "Available",
        type: "Apartment",
      },

      {
        id: 2,
        title: "Modern Apartment in brt",
        price: 8000,
        address: "Bargachi , brt",
        imagesUrl: "https://via.placeholder.com/400x250",
        status: "Available",
        type: "Apartment",
      },
    ]);
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Available Properties</h1>
      <div>
        {properties.map((property) => (
          <PropertyCard key={property.id} {...property} />
        ))}
      </div>
    </div>
  );
}
