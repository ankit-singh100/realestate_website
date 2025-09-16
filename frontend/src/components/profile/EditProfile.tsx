import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { authApi, type User } from "../../api/authApi";
import api from "@/api/api";

const schema = Yup.object().shape({
  name: Yup.string().optional(),
  email: Yup.string().email("Invalid email").optional(),
  password: Yup.string()
    .min(6, "Password must be at least 6 character long")
    .optional(),
  role: Yup.string().oneOf(["Owner", "Customer"], "Invalid role").optional(),
  avatarUrl: Yup.mixed().nullable(),
});

export default function EditProfile() {
  const { user, token } = useAuth();
  const [profile, setProfile] = useState<User | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | undefined>(
    undefined
  );
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  //   fetch profile
  useEffect(() => {
    async function fetchProfile() {
      if (!user) return;
      try {
        const res = await authApi.getProfile(user.id);
        setProfile(res.data);
        setAvatarPreview(res.data.avatarUrl);
      } catch {
        setError("Failed to load profile");
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, [user]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    if (selectedFile) {
      setFile(selectedFile);
      setAvatarPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleDeleteAvatar = async () => {
    if (!profile) return;
    try {
      await api.delete(`/users/${profile.id}/deleteavatar`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAvatarPreview("");
    } catch {
      setError("Failed to delete User");
    }
  };

  if (loading)
    return <p className="text-center mt-10">Loading profile......</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow rounded-lg">
      <h2 className="text-2xl font-semibold mb-4">Edit Profile</h2>

      {/* Avatar Preview */}
      <div className="flex flex-col items-center mb-4">
        {avatarPreview ? (
          <img
            src={avatarPreview}
            alt="Avatar Preview"
            className="w-24 h-24 rounded-full object-cover mb-2"
          />
        ) : (
          <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mb-2">
            No Avatar
          </div>
        )}
        <input type="file" accept="image/*" onChange={handleFileChange} />
        {avatarPreview && (
          <button
            type="button"
            onClick={handleDeleteAvatar}
            className="text-red-500 mt-2 text-sm"
          >
            Remove Avatar
          </button>
        )}
      </div>

      {/* Formik Form */}
      <Formik
        initialValues={{
          name: profile?.name || "",
          email: profile?.email || "",
          role: profile?.role || "Customer",
          avatarUrl: profile?.avatarUrl || "",
        }}
        validationSchema={schema}
        enableReinitialize
        onSubmit={async (values) => {
          if (!profile) return;
          try {
            // Update user profile
            await api.patch(
              `/users/profile/${profile.id}`,
              {
                name: values.name,
                email: values.email,
                role: values.role,
              },
              { headers: { Authorization: `Bearer ${token}` } }
            );

            // Upload avatar if file selected
            if (file) {
              const formDataObj = new FormData();
              formDataObj.append("file", file);
              await api.post(`/users/${profile.id}/avatar`, formDataObj, {
                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "multipart/form-data",
                },
              });
            }
            alert("Profile updated successfully");
            navigate("/profile");
          } catch {
            setError("Failed to update profile");
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form className="space-y-3">
            <div>
              <Field
                type="text"
                name="name"
                placeholder="Name"
                className="w-full border rounded p-2"
              />
              <ErrorMessage
                name="name"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>

            <div>
              <Field
                type="email"
                name="email"
                placeholder="Email"
                className="w-full border rounded p-2"
              />
              <ErrorMessage
                name="email"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>

            <div>
              <Field
                as="select"
                name="role"
                className="w-full border rounded p-2"
              >
                <option value="Customer">Customer</option>
                <option value="Owner">Owner</option>
                <option value="Admin">Admin</option>
              </Field>
              <ErrorMessage
                name="role"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
            >
              {isSubmitting ? "Saving..." : "Save Changes"}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
}
