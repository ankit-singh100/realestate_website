import { getAllFavorite } from "../../api/favoriteApi";
import { type Property } from "../../api/PropertyApi";
import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import PropertyCard from "../../components/properties/PropertyCard";

export default function FavoritePage() {
  const { user, favorites } = useAuth();
  const navigate = useNavigate();
  const [favorite, setFavorite] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    const fetchFavorites = async () => {
      try {
        // call backend to fetch favorites for logged-in user
        const data = await getAllFavorite();
        setFavorite(data);
      } catch (err) {
        console.error("Failed to load favorites", err);
      } finally {
        setLoading(false);
      }
    };
    fetchFavorites();
  }, [user, navigate]);

  if (loading) return <p className="text-center mt-6">Loading favorites...</p>;

  if (favorite.length === 0) {
    return (
      <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {favorites.map((property) => (
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
            isFavorite={favorites.some((p) => p.id === property.id)}
            onToggleFavorite={() => {}}
          />
        ))}
      </div>
    );
  }
}
