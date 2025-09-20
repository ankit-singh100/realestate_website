import { useState, useEffect, useRef } from "react";
import propertyApi, { type Property } from "../api/PropertyApi";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

export default function SearchDropdown() {
  const { favorites } = useAuth();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Property[]>([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch results as user types (debounced)
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const fetchResults = async () => {
      try {
        setLoading(true);
        const data = await propertyApi.getAllFiltered({ search: query }); // API should search title + description
        setResults(data.data || []);
        setShowDropdown(true);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    const timeout = setTimeout(fetchResults, 300); // debounce 300ms
    return () => clearTimeout(timeout);
  }, [query]);

  return (
    <div className="relative w-full max-w-md" ref={dropdownRef}>
      <input
        type="text"
        placeholder="Search properties..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => results.length > 0 && setShowDropdown(true)}
        className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
      />

      {showDropdown && results.length > 0 && (
        <div className="absolute z-10 w-full bg-white border rounded-lg shadow-lg mt-1 max-h-80 overflow-auto">
          {results.map((property) => (
            <Link
              key={property.id}
              to={`/properties/${property.id}`}
              className="px-4 py-2 hover:bg-gray-100 flex justify-between items-center"
              onClick={() => setShowDropdown(false)}
            >
              <span>{property.title}</span>
              <span className="text-sm text-gray-500">
                {favorites.some((fav: any) => fav.id === property.id)
                  ? "★"
                  : ""}
              </span>
            </Link>
          ))}
        </div>
      )}

      {loading && <p className="absolute mt-1 text-gray-500">Loading...</p>}
    </div>
  );
}
