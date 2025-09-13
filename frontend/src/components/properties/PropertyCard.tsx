import { Link } from "react-router-dom";
import image from "../../assets/image/image.jpg";

interface PropertyCardProps {
  id: number;
  title: string;
  description?: number;
  price: number;
  address: string;
  imagesUrl?: string;
  status: "Available" | "Sold" | "Rented" | "Pending";
  type: "House" | "Apartment" | "Land";
  owner?: {
    name: string;
    avatarUrl?: string;
  };
}

const PropertyCard: React.FC<PropertyCardProps> = ({
  id,
  title,
  price,
  address,
  imagesUrl,
  status = "Available",
  type,
  owner,
}) => {
  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition p-4 flex flex-col">
      {/* Property Image */}
      <Link to={`properties/${id}`}>
        <img
          src={image}
          alt="House"
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
          Type
        </span>
      </Link>
      {/* Content */}
      <div className="flex-1 flex flex-col justify-betweenmt-3">
        <div>
          <h3 className="text-lg font-semibold line-clamp-1">title</h3>
          <h3 className="text-black text-sm">Description</h3>
          <p className="text-gray-500 text-sm">address</p>
        </div>

        {/* Price & status */}
        <div className="mt-3 flex items-center justify-between">
          <span className="text-blue-600 font-bold">Rs.20000</span>
          <span
            className={`text-xs px-2 py-1 rounded-full ${
              status === "Available"
                ? "bg-green-100 text-green-700"
                : status === "Sold"
                ? "bg-red-100 text-red-700"
                : status === "Pending"
                ? "bg-yellow-100 text-yellow-700"
                : status === "Rented"
                ? "bg-red-100 text-red-100"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            Status
          </span>
        </div>

        {/* Owner Info */}
        {owner && (
          <div>
            <img
              src={owner.avatarUrl || "https://via.placeholder.com/40"}
              alt="Jhone Doe"
              className="w-8 h-8 rounded-full object-cover"
            />
            <span className="text-sm text-gray-700">Jhon Doe</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertyCard;
