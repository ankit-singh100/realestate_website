import { useAuth } from "../../context/AuthContext";
import { ChevronDown, HomeIcon, Menu, X } from "lucide-react";
import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);
  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  return (
    <nav className="bg-gray-400 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <HomeIcon className="w-6 h-6 text-blue-600" />
            <h1 className="font-bold text-lg sm:text-xl">
              <span className="text-slate-500">Birat</span>
              <span className="text-slate-700">Estate</span>
            </h1>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-6 items-center">
            <NavLink to="/" className="hover:text-blue-600">
              Home
            </NavLink>
            <NavLink to="/about" className="hover:text-blue-600">
              About
            </NavLink>
            <NavLink to="/contact" className="hover:text-blue-600">
              Contact
            </NavLink>
            <NavLink to="/properties" className="hover:text-blue-600">
              Property
            </NavLink>

            {!user ? (
              <NavLink
                to="/login"
                className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
              >
                Login
              </NavLink>
            ) : (
              <div className="relative inline-block text-left">
                <button
                  onClick={toggleDropdown}
                  className="flex items-center gap-2 px-3 py-1 bg-gray-200 rounded-lg hover:bg-gray-300"
                >
                  <img
                    src={user.avatarUrl || "https://via.placeholder.com/40"}
                    alt={user.name}
                    className="w-8 h-8 rounded-full"
                  />
                  <span>{user.name}</span>
                  <ChevronDown className="w-4 h-4" />
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-44 origin-top-right bg-white border rounded-lg shadow-lg z-20">
                    <button
                      onClick={() => {
                        navigate(`/users/profile/${user.id}`);
                        setIsDropdownOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                    >
                      Profile
                    </button>
                    <NavLink
                      to="/favourites"
                      className="block px-4 py-2 hover:bg-gray-100"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      Favorites
                    </NavLink>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="text-gray-700 hover:text-blue-600 focus:outline-none"
            >
              {isMobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t shadow-sm p-4 space-y-3">
          <input
            type="text"
            placeholder="Search property"
            className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <NavLink
            to="/"
            className="block hover:text-blue-600"
            onClick={toggleMobileMenu}
          >
            Home
          </NavLink>
          <NavLink
            to="/about"
            className="block hover:text-blue-600"
            onClick={toggleMobileMenu}
          >
            About
          </NavLink>
          <NavLink
            to="/contact"
            className="block hover:text-blue-600"
            onClick={toggleMobileMenu}
          >
            Contact
          </NavLink>
          <NavLink
            to="/properties"
            className="block hover:text-blue-600"
            onClick={toggleMobileMenu}
          >
            Property
          </NavLink>

          {!user ? (
            <NavLink
              to="/login"
              className="block w-full text-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              onClick={toggleMobileMenu}
            >
              Login
            </NavLink>
          ) : (
            <div className="space-y-2 border-t pt-2">
              <button
                onClick={toggleDropdown}
                className="flex items-center gap-2 py-1 px-1 rounded-lg bg-gray-200 hover:bg-gray-300 w-full justify-between"
              >
                <div className="flex items-center gap-2">
                  <img
                    src={user.avatarUrl || "https://via.placeholder.com/40"}
                    alt={user.name}
                    className="w-8 h-8 rounded-full"
                  />
                  <span>{user.name}</span>
                </div>
                <ChevronDown className="w-4 h-4" />
              </button>

              {isDropdownOpen && (
                <div className="space-y-2 pt-2">
                  <button
                    onClick={() => {
                      navigate(`/users/profile/${user.id}`);
                      setIsDropdownOpen(false);
                      setIsMobileMenuOpen(false);
                    }}
                    className="block w-full text-left py-2 px-2 hover:bg-gray-100 rounded-lg"
                  >
                    Profile
                  </button>
                  <NavLink
                    to="/favorites"
                    className="block py-2 px-2 hover:bg-gray-100 rounded-lg"
                    onClick={() => {
                      setIsDropdownOpen(false);
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    Favorites
                  </NavLink>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsDropdownOpen(false);
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full text-left py-2 px-2 text-red-500 hover:bg-gray-100 rounded-lg"
                  >
                    Logout
                  </button>
                  {(user.role === "Admin" || user.role === "Owner") && (
                    <NavLink
                      to="/properties/add"
                      className="block py-2 px-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Add Property
                    </NavLink>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
