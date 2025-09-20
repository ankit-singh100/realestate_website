import api from "@/api/api";
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
  const [interested, setInterested] = useState(false);
  const [userInterests, setUserInterests] = useState<number[]>([]);
  // const [deleting, setDeleting] = useState(false);
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

  useEffect(() => {
    if (!user) {
      alert("Please login to mark interest");
      navigate("/login");
      return;
    }
    const fetchUserInterests = async () => {
      try {
        const interests = await api.get("/interests");
        const interestData = interests.data as any[];
        if (interestData.map((i: any) => i.propertyId === Number(id))) {
          setInterested(true);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchUserInterests();
  }, [user, id]);

  const handleInterestedClick = async () => {
    if (!user) {
      alert("Please login to mark interest");
      navigate("/login");
      return;
    }
    if (!property) return;

    try {
      await api.post(`/interests/${property.id}`);
      setInterested(true);
      alert("Your interest has been noted!");
      alert("Your interest has been noted!");
    } catch (error: any) {
      alert(error.response?.data?.message || "Failed to mark interest");
    }
  };

  // const handleDelete = async () => {
  //   if (!id) return;
  //   if (user?.role !== "Admin") {
  //     alert("Only admins can delete properties.");
  //     return;
  //   }
  //   if (!window.confirm("Are you sure you want to delete this property?"))
  //     return;

  //   setDeleting(true);
  //   try {
  //     await propertyApi.delete(Number(id));
  //     navigate("/"); // back to list after deleting
  //   } catch (error) {
  //     console.error("Error deleting property", error);
  //   } finally {
  //     setDeleting(false);
  //   }
  // };

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (!property)
    return <p className="text-center mt-10">Property not found.</p>;

  return (
    <div className="relative max-w-5xl mx-auto p-4 sm:p-6 bg-white rounded-xl shadow-md">
      {/* Title + Address + Action */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 border-b pb-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            {property.title}
          </h1>
          <p className="text-gray-600 text-sm sm:text-base mt-1">
            {property.address}
          </p>

          {/* Created Date */}
          {property.createdAt && (
            <p className="text-gray-500 text-xs mt-1">
              Listed on{" "}
              {new Date(property.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          )}
        </div>

        {/* Owner Actions */}
        {user?.id === property.ownerId ||
          (user?.role === "Admin" && (
            <div className="flex gap-3">
              <button
                onClick={() => navigate(`/properties/edit/${property.id}`)}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
              >
                Edit
              </button>
            </div>
          ))}
      </div>

      {/* Price + Badges */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-4">
        <p className="text-xl md:text-2xl font-semibold text-gray-900">
          Rs.{property.price.toLocaleString()}
        </p>
        <div className="flex flex-wrap gap-2">
          <span className="px-3 py-1 rounded-full bg-green-100 text-green-800 text-sm font-medium">
            {property.status}
          </span>
          <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-sm font-medium">
            {property.type}
          </span>
        </div>
      </div>

      {/* Description */}
      {property.description && (
        <div className="mt-4 text-gray-700 text-sm sm:text-base leading-relaxed">
          {property.description}
        </div>
      )}

      {/* Images */}
      {property.images && property.images.length > 0 && (
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {property.images.map((img: PropertyImage) => (
            <img
              key={img.id}
              src={img.url}
              alt="Property"
              className="w-full h-56 object-cover rounded-lg border shadow-sm hover:scale-[1.02] transition-transform"
            />
          ))}
        </div>
      )}

      {/* Interested Button */}
      <button
        onClick={handleInterestedClick}
        disabled={userInterests.length >= 3}
        className={`absolute bottom-6 right-6 px-6 py-3 rounded-lg text-white font-semibold shadow-lg transition
            ${
              interested || userInterests.length >= 3
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
      >
        {interested
          ? "Interested"
          : userInterests.length >= 3
          ? "Maximum Interests Reached"
          : "Show Interest"}
      </button>
    </div>
  );
};
