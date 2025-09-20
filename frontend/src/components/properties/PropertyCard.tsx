import { useAuth } from "@/context/AuthContext";
import { Heart, Edit } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

interface PropertyCardProps {
  id: number;
  title: string;
  description?: string;
  price: number;
  address: string;
  imagesUrl?: { url: string }[];
  status: "Available" | "Sold" | "Rented";
  type: "House" | "Apartment" | "Land";
  owner?: {
    id?: number; // owner ID needed for checking
    name: string;
    avatarUrl?: string;
  };
  isFavorite?: boolean;
  onToggleFavorite?: (id: number) => void;
}

const PropertyCard: React.FC<PropertyCardProps> = ({
  id,
  title,
  description,
  price,
  address,
  imagesUrl,
  status = "Available",
  type,
  owner,
  isFavorite = false,
  onToggleFavorite,
}) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [favorite, setFavorite] = useState(isFavorite);

  useEffect(() => {
    setFavorite(isFavorite);
  }, [isFavorite]);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    if (!user) {
      alert("Please login to add to favorites");
      navigate("/login");
      return;
    }
    e.preventDefault(); // prevent navigation when clicking the heart
    setFavorite((prev) => !prev);
    if (onToggleFavorite) onToggleFavorite(id);
  };

  const canEdit = user && (user.role === "Admin" || user.id === owner?.id); // only owner or admin

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition p-4 flex flex-col relative">
      {/* Property Image */}
      <Link to={`/properties/get/${id}`}>
        <img
          src={imagesUrl?.[0]?.url || "https://via.placeholder.com/400x300"}
          alt={title}
          className="w-full h-48 object-cover rounded-lg mb-2"
        />
        <span
          className={`text-xs px-2 py-1 rounded-full ${
            type === "House"
              ? "bg-green-100 text-green-700"
              : type === "Apartment"
              ? "bg-green-100 text-green-700"
              : type === "Land"
              ? "bg-green-100 text-green-700"
              : "bg-gray-100 text-gray-700"
          }`}
        >
          {type}
        </span>
      </Link>

      {/* Favorite Button */}
      <button
        onClick={handleFavoriteClick}
        className="absolute top-2 right-2 rounded-full p-2 shadow-md hover:bg-gray-300"
      >
        <Heart
          size={20}
          className={`${
            favorite ? "fill-red-500 text-red-500" : "text-gray-900 border"
          }`}
        />
      </button>

      {/* Content */}
      <div className="flex-1 flex flex-col justify-between mt-3">
        <h3 className="text-lg font-semibold line-clamp-2">{title}</h3>
        <p className="text-black text-sm mt-1">{description}</p>
        <p className="text-gray-500 text-sm mt-1">{address}</p>

        {/* Price & Status */}
        <div className="mt-3 flex items-center justify-between">
          <span className="text-blue-600 font-bold">
            Rs.{price.toLocaleString()}
          </span>
          <span
            className={`text-xs px-2 py-1 rounded-full ${
              status === "Available"
                ? "bg-green-100 text-green-700"
                : status === "Sold"
                ? "bg-red-100 text-red-700"
                : status === "Rented"
                ? "bg-purple-100 text-purple-700"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            {status}
          </span>
        </div>

        {/* Owner Info */}
        {owner && (
          <div className="flex items-center gap-2 mt-3">
            <img
              src={owner.avatarUrl || "https://via.placeholder.com/40"}
              alt={owner.name}
              className="w-8 h-8 rounded-full object-cover"
            />
            <span className="text-sm text-gray-700">{owner.name}</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2 mt-4">
          <button
            onClick={() => navigate(`/properties/get/${id}`)}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg flex-1"
          >
            View Details
          </button>

          {canEdit && (
            <button
              onClick={() => navigate(`/properties/edit/${id}`)}
              className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg flex-1 flex items-center justify-center gap-1"
            >
              <Edit size={16} /> Edit
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
