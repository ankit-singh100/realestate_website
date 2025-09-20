import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Link } from "react-router-dom";
import propertyApi, { type Property } from "@/api/PropertyApi";

export default function OwnerDashboard() {
  const { user } = useAuth(); // logged-in user
  const [loading, setLoading] = useState(true);
  const [properties, setProperties] = useState<Property[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    const fetchProperties = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await propertyApi.getByOwner(user.id);
        console.log("Fetched properties:", data);

        const filtered =
          user.role === "Admin"
            ? data
            : data.filter(
                (p: Property) => p.status !== "Sold" && p.status !== "Rented"
              );

        setProperties(filtered);
      } catch (err: any) {
        console.error("Failed to fetch owner properties:", err);

        // Handle 404 from backend gracefully
        if (err.response?.status === 404) {
          setProperties([]);
        } else {
          setError("Failed to load properties. Please try again later.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, [user]);

  if (loading)
    return <div className="text-center mt-10">Loading your properties...</div>;

  if (error)
    return <div className="text-center mt-10 text-red-500">{error}</div>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Add property button */}
      {user && (user.role === "Admin" || user.role === "Owner") && (
        <Link
          to="/properties/add"
          className="mb-6 inline-block px-5 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition"
        >
          Add Property
        </Link>
      )}

      <h1 className="text-2xl font-bold mb-6">
        Welcome, {user?.name}! Here are your properties:
      </h1>

      {properties.length === 0 ? (
        <p className="text-gray-600">You haven’t added any properties yet.</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {properties.map((property) => (
            <div
              key={property.id}
              className="bg-white shadow-lg rounded-xl overflow-hidden hover:shadow-2xl transition"
            >
              <div className="relative aspect-w-4 aspect-h-3">
                <img
                  src={
                    property.images && property.images.length > 0
                      ? property.images[0].url
                      : "https://via.placeholder.com/400x250?text=No+Image"
                  }
                  alt={property.title}
                  className="w-full h-full object-cover rounded-t-xl"
                />
                <span className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
                  {property.status}
                </span>
                <span className="absolute top-2 right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                  {property.type}
                </span>
              </div>

              <div className="p-4">
                <h2 className="text-lg font-semibold mb-1">{property.title}</h2>
                <p className="text-sm text-gray-600 line-clamp-3">
                  {property.description || "No description available."}
                </p>
                <p className="text-blue-600 font-bold mt-2">
                  Rs. {property.price.toLocaleString()}
                </p>

                <div className="flex justify-between mt-4 text-sm">
                  <Link
                    to={`/properties/get/${property.id}`}
                    className="text-blue-500 hover:underline"
                  >
                    View
                  </Link>
                  <Link
                    to={`/properties/edit/${property.id}`}
                    className="text-green-500 hover:underline"
                  >
                    Edit
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
