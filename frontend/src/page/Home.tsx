import PropertyList from "./properties/PropertyListPage";
import image from "../assets/image/image.jpg";
import { useEffect, useRef, useState } from "react";
import type { Property } from "@/api/PropertyApi";
import propertyApi from "@/api/PropertyApi";
import { Link } from "react-router-dom";

export default function Home() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Property[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
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

  // Fetch search results (debounced)
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const fetchResults = async () => {
      try {
        setLoading(true);
        const data = await propertyApi.getAllFiltered({ search: query }); // pass object
        // filter out Sold and Rented properties
        const availableOnly = (data.data || []).filter(
          (p: Property) => p.status === "onSale" || p.status === "forRental"
        );
        setResults(availableOnly);
        setShowDropdown(true);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    const timeout = setTimeout(fetchResults, 300);
    return () => clearTimeout(timeout);
  }, [query]);

  return (
    <div className="w-full min-h-screen bg-slate-300">
      {/* Hero Section */}
      <section className="relative w-full h-screen">
        <div className="relative w-full h-96 md:h-[500px] rounded-lg overflow-hidden">
          {/* Background Image */}
          <img
            src={image}
            alt="BiratEstate"
            className="absolute inset-0 w-full h-full object-cover"
          />

          {/* Overlay */}
          <div className="absolute inset-0 bg-black/50"></div>

          {/* Text */}
          <div className="relative z-10 flex flex-col justify-center h-full max-w-6xl mx-auto px-6 md:px-12 text-left">
            <h1 className="text-white text-4xl md:text-6xl font-bold mb-4 text-center">
              Welcome to <span className="text-blue-400 ml-2">BiratEstate</span>
            </h1>
            <p className="text-white max-w-2xl mx-auto mb-6">
              Find your perfect property to rent or buy. Explore listings,
              compare prices, and connect directly with property owners.
            </p>

            {/* Search Bar */}
            <div
              className="relative w-full md:w-2/3 lg:w-1/2 mx-auto"
              ref={dropdownRef}
            >
              <input
                type="text"
                placeholder="Search property..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => results.length > 0 && setShowDropdown(true)}
                className="px-4 py-2 border text-black rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-200 w-full"
              />
              {showDropdown && results.length > 0 && (
                <div className="absolute left-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-md max-h-64 overflow-auto w-full z-50">
                  {results.map((property) => (
                    <Link
                      key={property.id}
                      to={`/properties/get/${property.id}`}
                      className="px-4 py-2 hover:bg-gray-100 flex justify-between items-center"
                      onClick={() => setShowDropdown(false)}
                    >
                      <span>{property.title}</span>
                      <span className="text-xs text-green-600 font-semibold">
                        {property.status}
                      </span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
            {loading && (
              <p className="absolute mt-1 text-gray-500">Loading...</p>
            )}
          </div>
        </div>
      </section>

      {/* Property Listings */}
      <section className="px-3 py-2">
        <PropertyList />
      </section>
    </div>
  );
}
