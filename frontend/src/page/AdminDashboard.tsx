import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "@/api/api";

interface UserData {
  id: number;
  name: string;
  email: string;
  role: string;
  avatarUrl?: string | null;
  isActive: boolean;
}

export default function AdminDashboard() {
  const { user, token, fetchProfile } = useAuth();
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const [totalCustomer, setTotalCustomer] = useState(0);
  const [totalOwners, setTotalOwners] = useState(0);

  useEffect(() => {
    const init = async () => {
      if (!user || !token) return;

      // Fetch profile to ensure we have latest role info
      const profile = await fetchProfile(user.id);
      if (!profile || profile.role !== "Admin") {
        navigate("/"); // redirect non-admins
        return;
      }

      try {
        const res = await api.get<UserData[]>("/users", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const allUsers = res.data.filter(
          (u) => u.role === "Owner" || u.role === "Customer"
        );
        setUsers(res.data);
        setTotalCustomer(allUsers.filter((u) => u.role === "Customer").length);
        setTotalOwners(allUsers.filter((u) => u.role === "Owner").length);
      } catch (err) {
        console.error("Failed to fetch users:", err);
      } finally {
        setLoading(false);
      }
    };

    init();
  }, [user, token, fetchProfile, navigate]);

  if (loading) return <div>Loading...</div>;
  if (!user || user.role !== "Admin") return <div>Access Denied</div>;

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-full md:w-72 bg-white shadow-md flex-shrink-0 p-6">
        {/* Admin Profile */}
        <div className="flex flex-col items-center mb-8">
          {user.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt={user.name}
              className="w-24 h-24 rounded-full mb-4"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center text-gray-700 text-3xl mb-4">
              {user.name[0].toUpperCase()}
            </div>
          )}
          <h2 className="text-xl font-bold text-center">{user.name}</h2>
          <p className="text-gray-600 text-sm text-center">{user.email}</p>
          <span className="mt-2 px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium">
            {user.role}
          </span>
        </div>

        {/* Admin Navigation */}
        <nav className="flex flex-col space-y-3">
          <button className="px-3 py-2 rounded hover:bg-gray-100 w-full text-left">
            Dashboard
          </button>
          <button className="text-left px-3 py-2 rounded hover:bg-gray-100 w-full">
            Manage Users
          </button>
          <button className="text-left px-3 py-2 rounded hover:bg-gray-100 w-full">
            Settings
          </button>
          <button
            className="text-left px-3 py-2 rounded hover:bg-gray-100"
            onClick={() => navigate(`/profile/edit/${user.id}`)}
          >
            Edit Profile
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-auto flex flex-col gap-6">
        {/* Quick Stats */}
        <div className="flex flex-wrap gap-4 justify-center md:justify-start">
          <div className="bg-blue-100 text-blue-800 p-4 rounded-lg shadow flex-1 min-w-[150px] text-center">
            <p className="text-sm">Total Customers</p>
            <p className="text-2xl font-bold">{totalCustomer}</p>
          </div>
          <div className="bg-green-100 text-green-800 p-4 rounded-lg shadow flex-1 min-w-[150px] text-center">
            <p className="text-sm">Total Owners</p>
            <p className="text-2xl font-bold">{totalOwners}</p>
          </div>
        </div>
        {/* Users Table */}
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-3 border">Name</th>
                <th className="p-3 border">Email</th>
                <th className="p-3 border">Role</th>
                <th className="p-3 border">Status</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-gray-50">
                  <td className="p-3 border flex items-center gap-3">
                    {u.avatarUrl ? (
                      <img
                        src={u.avatarUrl}
                        alt={u.name}
                        className="w-10 h-10 rounded-full"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-700">
                        {u.name[0].toUpperCase()}
                      </div>
                    )}
                    {u.name}
                  </td>
                  <td className="p-3 border">{u.email}</td>
                  <td className="p-3 border">{u.role}</td>
                  <td className="p-3 border">
                    <span
                      className={`px-2 py-1 rounded-full text-sm font-medium ${
                        u.isActive
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {u.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan={4} className="text-center p-4 text-gray-500">
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
