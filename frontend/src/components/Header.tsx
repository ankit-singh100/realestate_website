// import { api } from "@/api/api";
// import { useState, useEffect } from "react";
// import { NavLink, useNavigate } from "react-router-dom";
// import { HomeIcon, Search, User } from "lucide-react";
// import Profile from "@/components/Profile";

// interface User {
//   name: string;
//   avatarUrl?: string;
// }
// export default function Header() {
//   const [menuOpen, setMenuOpen] = useState(false);
//   const [search, setSearch] = useState("");
//   const [propertyType, setPropertyType] = useState("");
//   const [user, setUser] = useState<User | null>(null);
//   const navigate = useNavigate();

//   // Check if user is logged in
//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     if (token) {
//       // fetching user info from token/backend
//       api
//         .get<HTMLFormElement>("/users/profile")
//         .then((res) => {
//           setUser(res.data);
//         })
//         .catch((error: any) => {
//           console.error("Failed to fetch user:", error);
//           localStorage.removeItem("token");
//         });
//     }
//   }, []);

//   const handleSearch = (e: React.FormEvent) => {
//     e.preventDefault();
//     console.log("Searching for:", search, "Property:", propertyType);
//     // Call backend API with search + propertyType
//   };

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     setUser(null);
//     navigate("/login");
//   };

//   const defaultAvatar = "/default-avatar.png";

//   return (
//     <header className="bg-blue-600 text-white shadow-lg border-b-0">
//       <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
//         {/* Logo */}

//         <h1
//           className="text-xl font-bold cursor-pointer"
//           onClick={() => navigate("/")}
//         >
//           <div className="flex justify-between gap-2">
//             <HomeIcon />
//             MyApp
//           </div>
//         </h1>

//         {/* Desktop Nav */}
//         <nav className="hidden md:flex items-center gap-6">
//           <NavLink to="/" className="hover:underline">
//             Home
//           </NavLink>
//           <NavLink to="/about" className="hover:underline">
//             About
//           </NavLink>
//           <NavLink to="/contact" className="hover:underline">
//             Contact
//           </NavLink>
//           <NavLink to="/property" className="hover:underline">
//             Property
//           </NavLink>
//         </nav>

//         {/* Desktop Right Section */}
//         <div className="hidden sm:flex items-center gap-3">
//           <form onSubmit={handleSearch} className="flex items-center gap-2">
//             <div className="flex items-center bg-white rounded-lg overflow-hidden">
//               <input
//                 type="text"
//                 value={search}
//                 onChange={(e) => setSearch(e.target.value)}
//                 placeholder="Search..."
//                 className="px-3 py-2 text-black outline-none w-40 md:w-64"
//               />

//               <button
//                 type="submit"
//                 className="bg-blue-700 px-4 py-2 text-white font-medium"
//               >
//                 <Search size={24} />
//               </button>
//             </div>
//           </form>

//           {!user ? (
//             <NavLink
//               to="/register"
//               className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded-lg font-medium text-white"
//             >
//               <User />
//               Register
//             </NavLink>
//           ) : (
//             <Profile />
//           )}
//         </div>

//         {/* Mobile Menu Button */}
//         <button
//           className="md:hidden p-2 rounded-lg hover:bg-blue-700"
//           onClick={() => setMenuOpen(!menuOpen)}
//         >
//           ☰
//         </button>
//       </div>

//       {/* Mobile Menu */}
//       {menuOpen && (
//         <div className="md:hidden bg-blue-700 px-4 py-3 space-y-3">
//           <nav className="flex flex-col gap-2">
//             <NavLink
//               to="/"
//               className="hover:underline"
//               onClick={() => setMenuOpen(false)}
//             >
//               Home
//             </NavLink>
//             <NavLink
//               to="/about"
//               className="hover:underline"
//               onClick={() => setMenuOpen(false)}
//             >
//               About
//             </NavLink>
//             <NavLink
//               to="/contact"
//               className="hover:underline"
//               onClick={() => setMenuOpen(false)}
//             >
//               Contact
//             </NavLink>

//             <select
//               value={propertyType}
//               onChange={(e) => setPropertyType(e.target.value)}
//               className="px-3 py-2 rounded-lg text-black outline-none"
//             >
//               <option value="">Property</option>
//               <option value="house">House</option>
//               <option value="apartment">Apartment</option>
//               <option value="land">Land</option>
//             </select>
//           </nav>

//           <form onSubmit={handleSearch} className="flex flex-col gap-2 mt-3">
//             <div className="flex items-center bg-white rounded-lg overflow-hidden">
//               <input
//                 type="text"
//                 value={search}
//                 onChange={(e) => setSearch(e.target.value)}
//                 placeholder="Search..."
//                 className="px-3 py-2 text-black outline-none w-full"
//               />
//               <button
//                 type="submit"
//                 className="bg-blue-800 px-4 py-2 text-white font-medium"
//               >
//                 Go
//               </button>
//             </div>

//             {!user ? (
//               <NavLink
//                 to="/register"
//                 className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded-lg text-center font-medium text-white"
//               >
//                 Register
//               </NavLink>
//             ) : (
//               <NavLink to="/profile"/>
//             )}
//           </form>
//         </div>
//       )}
//     </header>
//   );
// }
