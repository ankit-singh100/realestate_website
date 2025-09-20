import api from "@/api/api";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { type User } from "@/api/authApi";
import { CheckCircle } from "lucide-react";

export default function ProfileMenu() {
  const { user, token, logout } = useAuth();
  const [avatarSrc, setAvatarSrc] = useState<string>("/default.png");

  useEffect(() => {
    async function loadAvatar() {
      if (!user || !token) return;

      try {
        // Fetch the latest profile from backend
        const res = await api.get<User>(`/users/profile/${user.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Use the avatar URL from backend if available
        setAvatarSrc(res.data.avatarUrl || "/default.png");
      } catch (err) {
        console.error("Failed to load avatar:", err);
        setAvatarSrc("/default.png");
      }
    }

    loadAvatar();
  }, [user, token]);
  const isVerifiedUser =
    (user?.role === "Owner" || user?.role === "Customer") && user.verified;

  return (
    <div className="bg-white shadow-lg rounded-2xl w-full max-w-3xl p-8 mx-auto">
      {/* Profile Header */}
      <div className="flex items-center gap-6 border-b pb-6 overflow-hidden">
        <img
          src={avatarSrc}
          alt={user?.name || "User Avatar"}
          className="w-20 h-20 rounded-full border-3 border-blue-500"
        />
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            {user?.name}
            {isVerifiedUser && (
              <CheckCircle className="text-green-500 w-5 h-5" />
            )}
          </h1>
          <p className="text-gray-600">{user?.email}</p>
          <p className="text-gray-500">Role: {user?.role}</p>
          <p className="text-gray-500">Contact: {user?.contact}</p>
        </div>
      </div>

      {/* Additional Info */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
          <h3 className="font-semibold text-gray-800 mb-2">Contact Info</h3>
          <p className="text-gray-600">{user?.contact}</p>
          <p className="text-gray-600">Biratnagar, Nepal</p>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
          <h3 className="font-semibold text-gray-800 mb-2">Account Info</h3>
          <p className="text-gray-600">
            Created at: {new Date(user?.createdAt || "").toLocaleDateString()}
          </p>
          <p className="text-gray-600">
            Role: {user?.role}{" "}
            {(user?.role === "Customer" || user?.role === "Owner") &&
              user?.verified && (
                <span className="text-green-600 font-medium text-sm bg-green-100 px-2 py-0.5 rounded-full">
                  Verified
                </span>
              )}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-8 flex gap-4">
        <Link
          to={`/users/${user?.id}`}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Edit profile
        </Link>
        <button
          onClick={logout}
          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
