import { useEffect, useState, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import { Users, Home, User2, LogOutIcon, Bell, X } from "lucide-react";

// User interface
interface UserData {
  id: number;
  name: string;
  email: string;
  role: string;
  avatarUrl?: string | null;
  isActive: boolean;
}

// Admin notification interfaces
interface User {
  id: number;
  name: string;
  email: string;
  contact?: string;
  avatarUrl?: string;
}

interface Owner {
  id: number;
  name: string;
  email: string;
  contact?: string;
  avatarUrl: File | null;
}

interface Property {
  id: number;
  title: string;
  description: string;
  price: number;
  address: string;
  status: string;
  type: string;
  ownerId: number;
  createdAt: string;
  updatedAt: string;
  owner: Owner;
}

interface Interest {
  id: number;
  userId: number;
  propertyId: number;
  user: User;
  property: Property;
}

// Transformed data for admin dashboard
interface AdminInterest {
  property: Property;
  interestedUsers: User[];
}

export default function AdminDashboard() {
  const { user, token, fetchProfile, logout } = useAuth();
  const [users, setUsers] = useState<UserData[]>([]);
  const [interestedRequests, setInterestedRequests] = useState<AdminInterest[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const usersSectionRef = useRef<HTMLDivElement>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const [totalCustomer, setTotalCustomer] = useState(0);
  const [totalOwners, setTotalOwners] = useState(0);

  useEffect(() => {
    const init = async () => {
      if (!user || !token) return;

      try {
        const profile = await fetchProfile(user.id);
        if (!profile || profile.role !== "Admin") {
          navigate("/");
          return;
        }

        const [resUsers, resInterests] = await Promise.all([
          api.get<UserData[]>("/users", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          api.get<Interest[]>("/interests/admin", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        // Filter users
        const allUsers = resUsers.data.filter(
          (u) => u.role === "Owner" || u.role === "Customer"
        );
        setUsers(allUsers);
        setTotalCustomer(allUsers.filter((u) => u.role === "Customer").length);
        setTotalOwners(allUsers.filter((u) => u.role === "Owner").length);

        // Transform interests to group by property
        const grouped: Record<number, AdminInterest> = {};
        resInterests.data.forEach((interest) => {
          const propId = interest.property.id;
          if (!grouped[propId]) {
            grouped[propId] = {
              property: interest.property,
              interestedUsers: [],
            };
          }
          grouped[propId].interestedUsers.push(interest.user);
        });
        setInterestedRequests(Object.values(grouped));
      } catch (err) {
        console.error("Failed to fetch data:", err);
      } finally {
        setLoading(false);
      }
    };

    init();
  }, [user?.id, token]);

  // Remove an interested user (mark notification as read)
  const handleNotificationRead = async (propertyId: number, userId: number) => {
    try {
      await api.patch(
        `/interests/${propertyId}/${userId}/read`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setInterestedRequests((prev) =>
        prev
          .map((p) => ({
            ...p,
            interestedUsers: p.interestedUsers.filter((u) => u.id !== userId),
          }))
          .filter((p) => p.interestedUsers.length > 0)
      );
    } catch (error) {
      console.error("Failed to remove interest:", error);
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;
  if (!user || user.role !== "Admin")
    return <div className="p-6">Access Denied</div>;

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-blue-100 via-blue-200 to-blue-300">
      {/* Navbar */}
      <nav className="w-full bg-blue-200 shadow-md px-6 py-3 flex items-center justify-between">
        <div
          className="text-xl font-bold text-blue-700 cursor-pointer"
          onClick={() => navigate("/users/admin-dashboard")}
        >
          Admin Dashboard
        </div>

        <div className="flex items-center gap-4 relative">
          {/* Interested Requests Bell */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen((prev) => !prev)}
              className="relative p-2 rounded-full hover:bg-gray-200 transition"
            >
              <Bell size={24} />
              {interestedRequests?.length > 0 && (
                <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
              )}
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white shadow-xl rounded-lg z-50 overflow-hidden">
                <div className="flex items-center justify-between p-3 border-b">
                  <span className="font-semibold">Interested Requests</span>
                  <button
                    onClick={() => setDropdownOpen(false)}
                    className="p-1 hover:bg-gray-100 rounded-full"
                  >
                    <X size={16} />
                  </button>
                </div>

                <div className="max-h-72 overflow-y-auto">
                  {interestedRequests.length === 0 ? (
                    <p className="p-4 text-gray-500 text-sm text-center">
                      No requests yet
                    </p>
                  ) : (
                    interestedRequests.map((req) => (
                      <div
                        key={req.property.id}
                        className="p-4 border-b hover:bg-gray-50 transition"
                      >
                        <div className="text-sm font-medium text-blue-700">
                          Property: {req.property.title}
                          <p className="text-xs text-gray-600">
                            Owner: {req.property.owner.name} (
                            {req.property.owner.email}) (
                            {req.property.owner.contact})
                          </p>
                        </div>

                        {req.interestedUsers.map((u) => (
                          <div
                            key={u.id}
                            className="mt-2 bg-gray-100 rounded-lg p-2 flex justify-between items-center"
                          >
                            <div>
                              <p className="text-xs font-medium text-gray-800">
                                {u.name} ({u.email})
                              </p>
                              <p className="text-xs text-gray-600">
                                Contact: {u?.contact || "N/A"}
                              </p>
                            </div>
                            <button
                              onClick={() =>
                                handleNotificationRead(req.property.id, u.id)
                              }
                              className="text-red-600 hover:text-red-800 p-1 rounded-full transition"
                            >
                              <X size={16} />
                            </button>
                          </div>
                        ))}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Admin Profile */}
          <button className="flex items-center gap-2 px-3 py-2 bg-gray-200 rounded-xl hover:bg-gray-300">
            {user.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt={user.name}
                className="w-8 h-8 rounded-full"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-gray-400 flex items-center justify-center text-white">
                {user.name[0].toUpperCase()}
              </div>
            )}
            <span className="hidden sm:inline">{user.name}</span>
          </button>
        </div>
      </nav>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-full md:w-72 bg-slate-400 shadow-lg p-6 flex flex-col">
          <nav className="flex flex-col space-y-2">
            <button
              onClick={() => navigate(`/users/profile/${user.id}`)}
              className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-100 text-gray-700"
            >
              <User2 className="w-5 h-5" /> Profile
            </button>
            <button
              onClick={() =>
                usersSectionRef.current?.scrollIntoView({ behavior: "smooth" })
              }
              className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-100 text-gray-700"
            >
              <Users className="w-5 h-5" /> Manage Users
            </button>
            <button
              onClick={() => navigate("/properties")}
              className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-100 text-gray-700"
            >
              <Home className="w-5 h-5" /> Manage Properties
            </button>
            <button
              onClick={logout}
              className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-100 hover:text-red-600 text-gray-700"
            >
              <LogOutIcon className="w-5 h-5" /> Logout
            </button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 overflow-auto flex flex-col gap-6">
          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white p-5 rounded-lg shadow flex flex-col items-center">
              <Users className="w-8 h-8 text-blue-500 mb-2" />
              <p className="text-gray-600 text-sm">Total Customers</p>
              <p className="text-2xl font-bold">{totalCustomer}</p>
            </div>
            <div className="bg-white p-5 rounded-lg shadow flex flex-col items-center">
              <Home className="w-8 h-8 text-green-500 mb-2" />
              <p className="text-gray-600 text-sm">Total Owners</p>
              <p className="text-2xl font-bold">{totalOwners}</p>
            </div>
          </div>

          {/* Users Section */}
          <div
            ref={usersSectionRef}
            className="bg-slate-200 rounded-xl shadow p-4"
          >
            <h2 className="text-lg font-semibold mb-4">Users</h2>
            {users.length === 0 ? (
              <div className="text-center text-gray-500 py-10">
                No users found
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {users.map((u) => (
                  <div
                    key={u.id}
                    className="bg-gradient-to-br from-white to-gray-50 rounded-lg shadow hover:shadow-lg transition p-4 flex justify-between items-center"
                  >
                    <div className="flex items-center gap-4">
                      {u.avatarUrl ? (
                        <img
                          src={u.avatarUrl}
                          alt={u.name}
                          className="w-10 h-10 rounded-full shadow"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-700 font-medium">
                          {u.name[0].toUpperCase()}
                        </div>
                      )}
                      <div>
                        <h3 className="font-semibold text-lg">{u.name}</h3>
                        <p className="text-sm text-gray-600">{u.email}</p>
                        <span className="mt-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium inline-block">
                          {u.role}
                        </span>
                        <span
                          className={`ml-2 px-3 py-1 rounded-full text-xs font-medium ${
                            u.isActive
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-200 text-gray-700"
                          }`}
                        >
                          {u.isActive ? "Active" : "Inactive"}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
