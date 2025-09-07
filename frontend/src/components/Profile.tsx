// import { useAuth } from "@/context/AuthContext";
// import { useState } from "react";
// import { useNavigate } from "react-router-dom";

export default function Profile() {
  // const [open, setOpen] = useState(false);
  // const { user, logout } = useAuth();
  // const navigate = useNavigate();

  // if (!user) return null; //donst show

  // const handleProfile = () => {
  //   setOpen(false);
  //   navigate("/profile");
  // };

  // const handleLogout = () => {
  //   logout();
  //   navigate("/login");
  // };

  return (
    <div className="relative inline-block text-left">
      {/* Profile Button */}
      <button
        // onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-2 rounded-full bg-gray-200 hover:bg-gray-300 transition"
      >
        {/* <img
          src={user.avatarUrl || "https://i.pravatar.cc/40"}
          alt={user.name} */}
        {/* className="w-8 h-8 rounded-full"
        /> */}
        {/* <span className="font-medium">{user.name}</span> */}
      </button>

      {/* Dropdown menu */}
      {/* {open && (
        <div className="absolute right-0 mt-2 w-40 bg-white border rounded-lg shadow-lg z-50">
          <button
            onClick={handleProfile}
            className="w-full text-left px-4 py-2 text-black font-bold hover:bg-gray-100"
          >
            Profile
          </button>
          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-2 text-red-500 hover:bgg-gray-100"
          >
            Logout
          </button> */}
      {/* </div>
      )} */}
    </div>
  );
}
