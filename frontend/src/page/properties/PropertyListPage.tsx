import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import propertyApi, { type Property } from "@/api/PropertyApi";

export default function PropertyList() {
  const { user, favorites, toggleFavorite } = useAuth();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Pagination
  const [page, setPage] = useState(1);
  const [limit] = useState(9);
  const [totalPage, setTotalPage] = useState(1);

  // Filters
  const [type, setType] = useState("");
  const [status, setStatus] = useState("");
  const [minPrice, setMinPrice] = useState<number | "">("");
  const [maxPrice, setMaxPrice] = useState<number | "">("");

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        const data = await propertyApi.getAll(page, limit);
        let all = data.data;

        // Hide SOLD properties for non-admins
        if (user?.role !== "Admin") {
          all = all.filter(
            (p: Property) => p.status !== "Sold" && p.status !== "Rented"
          );
        }

        setProperties(all);
        setTotalPage(data.totalPages);
        setError(null);
      } catch (err: any) {
        setError(err.message || "Failed to load properties");
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, [page, limit, user]);

  if (loading)
    return <p className="text-center mt-10">Loading properties...</p>;
  if (error) return <p className="text-red-500 text-center">{error}</p>;

  const filteredProperties = properties
    .filter((property) => {
      if (type && property.type !== type) return false;
      if (status && property.status !== status) return false;
      if (minPrice !== "" && property.price < minPrice) return false;
      if (maxPrice !== "" && property.price > maxPrice) return false;
      return true;
    })
    .sort((a, b) => b.id - a.id); // Newest first

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-xl shadow-md my-6">
      {/* Header + Filters */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold">Available Properties</h1>

        <div className="flex flex-wrap gap-3 items-center">
          {/* Filters */}
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="border rounded px-3 py-2"
          >
            <option value="">All Types</option>
            <option value="House">House</option>
            <option value="Apartment">Apartment</option>
            <option value="Land">Land</option>
          </select>

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="border rounded px-3 py-2"
          >
            <option value="">All Status</option>
            <option value="onSale">on Sale</option>
            <option value="Sold">Sold</option>
            <option value="forRental">for Rental</option>
            <option value="Rented">Rented</option>
          </select>

          <input
            type="number"
            placeholder="Min Price"
            value={minPrice}
            onChange={(e) =>
              setMinPrice(e.target.value === "" ? "" : Number(e.target.value))
            }
            className="border rounded px-3 py-2 w-24"
          />
          <input
            type="number"
            placeholder="Max Price"
            value={maxPrice}
            onChange={(e) =>
              setMaxPrice(e.target.value === "" ? "" : Number(e.target.value))
            }
            className="border rounded px-3 py-2 w-24"
          />

          {/* Add Property Button for Admin/Owner */}
          {user && (user.role === "Admin" || user.role === "Owner") && (
            <Link
              to="/properties/add"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Add Property
            </Link>
          )}
        </div>
      </div>

      {/* Property Cards Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredProperties.length > 0 ? (
          filteredProperties.map((property) => {
            const isFavorite = favorites.some((fav) => fav.id === property.id);
            return (
              <div
                key={property.id}
                className="bg-white shadow-lg rounded-xl overflow-hidden hover:shadow-2xl transition relative"
              >
                {/* Image */}
                <div className="w-full h-48 relative overflow-hidden rounded-t-xl">
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

                  {/* Favorite Heart */}
                  <button
                    onClick={() => toggleFavorite(property)}
                    className="absolute bottom-2 right-2 p-2 rounded-full bg-white shadow hover:bg-gray-100"
                  >
                    <Heart
                      size={20}
                      className={`${
                        isFavorite
                          ? "fill-red-500 text-red-500"
                          : "text-gray-900"
                      }`}
                    />
                  </button>
                </div>

                {/* Content */}
                <div className="p-4">
                  <h2 className="text-lg font-semibold mb-1">
                    {property.title}
                  </h2>
                  <p className="text-sm text-gray-600 line-clamp-3">
                    {property.description || "No description available."}
                  </p>
                  <p className="text-blue-600 font-bold mt-2">
                    Rs. {property.price.toLocaleString()}
                  </p>

                  {/* Action Buttons */}
                  <div className="flex justify-between mt-4 text-sm">
                    <Link
                      to={`/properties/get/${property.id}`}
                      className="text-blue-500 hover:underline"
                    >
                      View
                    </Link>

                    {/* Edit only for owner/admin */}
                    {user &&
                      (user.role === "Admin" ||
                        property.ownerId?.toString() ===
                          user.id.toString()) && (
                        <Link
                          to={`/properties/edit/${property.id}`}
                          className="text-green-500 hover:underline"
                        >
                          Edit
                        </Link>
                      )}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <p className="col-span-full text-center text-gray-500">
            No properties match your filters.
          </p>
        )}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-center gap-4 mt-6">
        <button
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Prev
        </button>
        <span>
          Page {page} of {totalPage}
        </span>
        <button
          disabled={page === totalPage}
          onClick={() => setPage((p) => p + 1)}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
