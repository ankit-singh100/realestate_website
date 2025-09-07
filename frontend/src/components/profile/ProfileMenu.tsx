import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";

export default function ProfileMenu() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center p-6">
      <div className="bg-white shadow-lg rounded-2xl w-full max-w-3xl p-8">
        {/* Profile Header */}
        <div className="flex items-center gap-6 border-b pb-6 overflow-hidden">
          <img
            src={user?.avatarUrl || "default.png"}
            alt={user?.name}
            className="w-20 h-20 rounded-full border-4 border-blue-500"
          />
          <div>
            <h1 className="text-2xl font-bold">{user?.name}</h1>
            <p className="text-gray-600">{user?.email}</p>
            <p className="text-gray-500">{user?.role}</p>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-50 p-4 rounded-lg shasow-sm">
            <h3 className="font-semibold text-gray-800 mb-2">Contact Info</h3>
            <p className="text-gray-600">Biratnagar, Nepal</p>
            <p className="text-gray-600">📞 +977 9800000000</p>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
            <h3 className="font-semibold text-gray-800 mb-2">Account Info</h3>
            <p className="text-gray-600">Member Since: Jan 2025</p>
            <p className="text-gray-600">Role: {user?.role}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-8 flex gap-4">
          <Link
            to="/profile/edit"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Edit profile
          </Link>
          <button className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600">
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
