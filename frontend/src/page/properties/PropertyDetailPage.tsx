// import propertyApi, { type Property } from "../../api/PropertyApi";
// import { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";

// export default function PropertyDetail() {
//   const { id } = useParams();
//   const [loading, setLoading] = useState(true);
//   const [property, setProperty] = useState<Property | null>(null);
//   const [error, setError] = useState<string | null>(null);

//   // Fetch property by id
//   useEffect(() => {
//     if (!id) return;
//     const fetchProperties = async () => {
//       try {
//         setLoading(true);
//         const res = await propertyApi.getById(Number(id));
//         setProperty(res);
//         setError(null);
//       } catch (err: any) {
//         setError(err.message || "Failed to load property");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProperties();
//   }, [id]);

//   if (loading) return <p>Loading...</p>;
//   if (error) return <p>{error}</p>;
//   if (!property) return <p>Property not found</p>;

//   return (
//     <div className="max-w-4xl mx-auto p-6">
//       <h1 className="text-3xl font-bold mb-4">{property.title}</h1>
//       {/* Display all images */}
//       <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
//         {property.images?.map((img) => (
//           <img
//             key={img.id}
//             src={img.url}
//             alt={property.title}
//             className="w-full rounded-lg"
//           />
//         ))}
//       </div>
//       <p className="text-gray-700 mb-4">{property.description}</p>
//       <p className="text-lg font-semibold">{property.price}</p>
//       <p className="text-gray-600">{property.address}</p>
//       <p className="text-gray-600">{property.type}</p>
//       <p className="text-gray-600">{property.status}</p>
//     </div>
//   );
// }
