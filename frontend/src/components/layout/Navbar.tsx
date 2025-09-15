import { useAuth } from "../../context/AuthContext";
import { ChevronDown, HomeIcon, Menu, X } from "lucide-react";
import { useState } from "react";
import { Link, NavLink } from "react-router-dom";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <nav className=" bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <HomeIcon />
          <div className="text-2xl font-bold text-blue-600 ">
            <Link to="/">BiratEstate</Link>
          </div>

          {/* Search Bar Desktop */}
          <div className="hidden md:block flex-1 mx-6">
            <input
              type="text"
              placeholder="search property..."
              className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Desktop Menu */}
          <div className=" hidden md:flex space-x-6">
            <Link to="/" className="text-gray-700 hover:text-blue-600">
              Home
            </Link>
            <Link to="/about" className="text-gray-700 hover:text-blue-600">
              About
            </Link>
            <Link to="/contact" className="text-gray-700 hover:text-blue-600">
              Contact
            </Link>
            <Link
              to="/properties"
              className="text-gray-700 hover:text-blue-600"
            >
              Property
            </Link>

            {/* Auth button */}
            {!user ? (
              <NavLink
                to="/login"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Login
              </NavLink>
            ) : (
              <div className="relative">
                <button
                  className="flex items-center space-x-2 px-3 py-1 bg-gray-100 rounded-lg hover:bg-gray-200 "
                  onClick={() => setOpen(!open)}
                >
                  <img
                    src={user?.avatarUrl}
                    alt={user?.name}
                    className="w-8 h-6 rounded-full"
                  />
                  <span className="text-gray-700 font-medium">{user.name}</span>
                  <ChevronDown className="w-4 h-4" />
                </button>

                {/* Desktop dropdown */}
                {open && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg z-10">
                    <NavLink
                      to="/profile"
                      className="block px-4 py-2 hover:bg-gray-100"
                      onClick={() => setOpen(false)}
                    >
                      Profile
                    </NavLink>
                    <button
                      onClick={() => {
                        logout();
                        setOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-500"
                    >
                      Logout
                    </button>

                    {/* Show only if role = admin or owner */}
                    {user &&
                      (user.role === "Admin" || user.role === "Owner") && (
                        <NavLink
                          to="/properties-add"
                          className="block px-4 py-2 hover:bg-gray-100"
                          onClick={() => setOpen(false)}
                        >
                          Add Property
                        </NavLink>
                      )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-blue-600 focus:outline-none"
            >
              {isOpen ? (
                <span>
                  <X />
                </span>
              ) : (
                <span>
                  <Menu />
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t shadow-sm">
          {/* Search Bar */}
          <input
            type="text"
            placeholder="search property"
            className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
          />
          <Link
            to="/"
            className="block px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-blue-600"
          >
            Home
          </Link>
          <Link
            to="/about"
            className="block px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-blue-600"
          >
            About
          </Link>
          <Link
            to="/contact"
            className="block px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-blue-600"
          >
            Contact
          </Link>
          <Link
            to="/properties"
            className="block px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-blue-600"
          >
            Property
          </Link>

          {/* user auth */}
          {!user ? (
            <NavLink
              to="/login"
              className="block w-full text-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Login
            </NavLink>
          ) : (
            <div className="mt-2 border-t py-1">
              <button
                onClick={() => setOpen(!open)}
                className="flex items-center gap-2 py-1 px-1  rounded-full bg-gray-200 hover:bg-gray-300 transition"
              >
                <img
                  src={user.avatarUrl}
                  alt={user.name}
                  className="w-9.5 h-9.5 rounded-2xl"
                />
                <span className="font-medium">{user.name}</span>
                <ChevronDown className="w-4 h-4" />
              </button>

              {/* Dropdown menu */}
              {open && (
                <div className="mt-2 space-y-1">
                  <NavLink
                    to="/profile"
                    className="block py-2 px-2 hover:bg-gray-100 rounded-lg"
                    onClick={() => setOpen(false)}
                  >
                    Profile
                  </NavLink>
                  <button
                    onClick={() => {
                      logout();
                      setOpen(false);
                    }}
                    className="w-full text-left py-2 px-2 text-red-500 hover:bg-gray-100 rounded-lg"
                  >
                    Logout
                  </button>
                  {/* Show only if role = admin or owner */}
                  {user && (user.role === "Admin" || user.role === "Owner") && (
                    <NavLink
                      to="/properties-add"
                      className="block px-4 py-2 hover:bg-gray-100 rounded-lg"
                      onClick={() => setOpen(false)}
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
