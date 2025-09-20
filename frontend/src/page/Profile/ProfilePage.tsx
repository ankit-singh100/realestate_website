import { useAuth } from "../../context/AuthContext";

export default function ProfilePage() {
  const { user } = useAuth();

  if (!user) {
    return (
      <p className="text-center mt-10">Please login to view your profile.</p>
    );
  }

  return (
    <div className="flex flex-col justify-center items-center mt-10 space-y-4">
      <img
        src={user.avatarUrl || "https://i.pravatar.cc/150"}
        alt={user.name}
        className="w-24 h-24 rounded-full shadow-md"
      />
      <h1 className="text-2xl font-bold">{user.name}</h1>
      <p className="text-gray-600">Role: {user.role}</p>
    </div>
  );
}
