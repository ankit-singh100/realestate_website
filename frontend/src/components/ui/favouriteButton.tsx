import { addFavorite, removeFavorite } from "@/api/favoriteApi";
import { useState } from "react";

type props = {
  userId: number;
  propertyId: number;
  isInitiallyFavourite?: boolean;
  onChange?: (isFavorite: boolean) => void;
};

export default function FavouriteButton({
  userId,
  propertyId,
  isInitiallyFavourite = false,
  onChange,
}: props) {
  const [isFavourite, setIsFavourite] = useState(isInitiallyFavourite);
  const [loading, setLoading] = useState(false);

  const toogleFavorite = async () => {
    if (loading) return;
    setLoading(true);

    try {
      if (isFavourite) {
        await removeFavorite(userId, propertyId);
        setIsFavourite(false);
        onChange?.(false);
      } else {
        await addFavorite(userId, propertyId);
        setIsFavourite(true);
        onChange?.(true);
      }
    } catch (error: any) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={toogleFavorite}
      disabled={loading}
      className={`p-2 rounded-full border transition ${
        isFavourite ? "bg-red-500 text-white" : "bg-gray-200 text-gray-600"
      }`}
    >
      {isFavourite ? "♥" : "♡"}
    </button>
  );
}
