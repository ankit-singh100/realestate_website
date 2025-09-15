import type { Property, PropertyImage } from "@/api/PropertyApi";
import propertyApi from "@/api/PropertyApi";
import { useAuth } from "@/context/AuthContext";
import type React from "react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export const PropertyDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (!id) return;
    const fetchProperty = async () => {
      try {
        const data = await propertyApi.getById(Number(id));
        setProperty(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id]);

  const handleDelete = async () => {
    if (!id) return;
    if (user?.role !== "Admin") {
      alert("Only admins can delete properties.");
      return;
    }
    if (!window.confirm("Are you sure you want to delete this property?"))
      return;

    setDeleting(true);
    try {
      await propertyApi.delete(Number(id));
      navigate("/"); // back to list after deleting
    } catch (error) {
      console.error("Error deleting property", error);
    } finally {
      setDeleting(false);
    }
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (!property)
    return <p className="text-center mt-10">Property not found.</p>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      {/* Title and address */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex flex-col">
          <h1 className="text-3xl sm:text-3xl md:text-4xl font-bold mb-1">
            {property.title}
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">
            {property.address}
          </p>
        </div>

        {/* Edit Button */}

        <div className="flex gap-4">
          <button
            onClick={() => navigate(`/properties/edit/${property.id}`)}
            className="mt-3 sm:mt-0 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Edit Property
          </button>

          {/* Delete Button */}
          {(user?.role === "Admin" || user?.role === "Owner") && (
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 disabled:opacity-50 text-sm sm:text-base"
            >
              {deleting ? "Deleting" : "Delete"}
            </button>
          )}
        </div>
      </div>

      {/* Price, status, Type */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-6">
        <p className="text-gray-800 font-semibold text-lg sm:text-xl">
          Rs.{property.price.toLocaleString()}
        </p>
        <div className="flex gap-2">
          <span className="px-3 py-1 rounded-full bg-green-200 text-green-800 text-sm sm:text-base">
            {property.status}
          </span>
          <span className="px-3 py-1 rounded-full bg-green-200 text-green-800 text-sm sm:text-base">
            {property.type}
          </span>
        </div>
      </div>

      {/* Description */}
      {property.description && (
        <div className="mb-6 text-gray-700 text-sm sm:text-base">
          {property.description}
        </div>
      )}

      {/* Images */}
      {property.images && property.images.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {property.images.map((img: PropertyImage) => (
            <img
              key={img.id}
              src={img.url}
              alt="Property"
              className="w-full h-64 sm:h-48 md:h-56 object-cover rounded-lg border shadow-sm"
            />
          ))}{" "}
        </div>
      )}
    </div>
  );
};
