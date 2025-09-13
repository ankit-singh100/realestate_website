import { useParams } from "react-router-dom";

export default function PropertyDetail() {
  const { id } = useParams();

  // Fetch property by id
  const property = {
    id: 1,
    title: "Luxury villa in ktm",
    description: "wowwwwwww",
    price: 150000,
    address: "Lazimpat, ktm",
    imagesUrl: "https://via.placeholder.com/400x250",
    status: "Available",
    type: "Apartment",
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">{property.title}</h1>
      <img
        src={property.imagesUrl}
        alt={property.title}
        className="w-full rounded-lg mb-6"
      />
      <p className="text-gray-700 mb-4">{property.description}</p>
      <p className="text-lg font-semibold">{property.price}</p>
      <p className="text-gray-600">{property.address}</p>
      <p className="text-gray-600">{property.type}</p>
      <p className="text-gray-600">{property.status}</p>
    </div>
  );
}
