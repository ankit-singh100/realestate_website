import propertyApi, { type Property } from "../../api/PropertyApi";
import PropertyCard from "../../components/properties/PropertyCard";
import { useEffect, useState } from "react";

// interface Property {
//   id: number;
//   title: string;
//   description?: number;
//   price: number;
//   address: string;
//   imagesUrl?: string;
//   status: "Available" | "Sold" | "Pending";
//   type: "House" | "Apartment" | "Land";
// }

export default function PropertyList() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Pagination states
  const [pages, setPages] = useState(1);
  const [limit] = useState(10);
  const [totalpages, setTotalPages] = useState(1);

  useEffect(() => {
    // Replcae with api call
    const fetchProperties = async () => {
      try {
        setLoading(true);
        const data = await propertyApi.getAll(pages, limit);
        setProperties(data.data);
        setTotalPages(data.totalPages);
        setError(null);
      } catch (error: any) {
        setError(error.message || "Failed to ltatusoad properties");
      } finally {
        setLoading(false);
      }
    };
    fetchProperties();
  }, [pages, limit]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Available Properties</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties.map((property) => (
          <PropertyCard
            key={property.id}
            id={property.id}
            title={property.title}
            description={property.description}
            price={property.price}
            address={property.address}
            status={property.status}
            type={property.type}
            imagesUrl={property.images} // pass the array from backend
          />
        ))}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-center gap-4 mt-6">
        <button
          disabled={pages === 1}
          onClick={() => setPages((p) => p - 1)}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Prev
        </button>
        <span>
          Page {pages} of {totalpages}
        </span>
        <button
          disabled={pages === totalpages}
          onClick={() => setPages((p) => p + 1)}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
