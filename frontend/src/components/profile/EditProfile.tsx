import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { authApi, type User } from "../../api/authApi";

export default function EditProfile() {
  const { user, setUser } = useAuth();
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
        setUser(res.data);
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

  const handleSubmit = async (values: any, { setSubmitting }: any) => {
    try {
      // 1️⃣ Update user data
      const updateData: any = {
        name: values.name,
        email: values.email,
      };
      if (values.password) updateData.password = values.password;
      if (profile?.role !== "Admin") updateData.role = values.role;
      await authApi.updateUser(`${profile?.id}`, updateData);

      // 2️⃣ Upload avatar if selected
      if (file) {
        const formData = new FormData();
        formData.append("file", file);
        const res = await authApi.uploadImage(`${profile?.id}`, formData);
        setAvatarPreview(res.data.avatarUrl);
      }
      alert("Profile updated successfully!");

      navigate(`/users/profile/${user?.id}`);
    } catch (err) {
      console.error(err);
      alert("Failed to update profile!");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteAvatar = async () => {
    if (!profile) return;
    try {
      await authApi.deleteAvatar(profile.id);
      setAvatarPreview("");
    } catch {
      setError("Failed to delete User");
    }
  };

  if (loading)
    return <p className="text-center mt-10">Loading profile......</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  // Dynamic validation if not admin require role
  const schema = Yup.object().shape({
    name: Yup.string().optional(),
    email: Yup.string().email("Invalid email").optional(),
    password: Yup.string()
      .min(6, "Password must be at least 6 character long")
      .optional(),
    role:
      profile?.role === "Admin"
        ? Yup.string().notRequired()
        : Yup.string().oneOf(["Owner", "Customer"], "Invalid role").required(),
    avatarUrl: Yup.mixed().nullable(),
  });

  return (
    <Formik
      initialValues={{
        name: profile?.name || "",
        email: profile?.email || "",
        password: "",
        role: profile?.role || "",
      }}
      validationSchema={schema}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting }) => (
        <Form className="space-y-4 max-w-md mx-auto p-4 border-none rounded-lg shadow-lg bg-white">
          {/* Avatar Preview */}
          <div className="flex flex-col items-center">
            {avatarPreview && (
              <>
                <img
                  src={avatarPreview}
                  alt="avatar"
                  className="w-24 h-24 rounded-full object-cover mb-2 bg-gray-300"
                />
                <button
                  type="button"
                  onClick={handleDeleteAvatar}
                  className="bg-red-500 text-white px-2 py-1 rounded mb-2 hover:bg-red-600"
                >
                  Delete Avatar
                </button>
              </>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="bg-gray-200 w-55 px-2"
            />
          </div>

          {/* Name */}
          <div>
            <label htmlFor="name" className="block font-medium">
              Name
            </label>
            <Field
              type="text"
              name="name"
              id="name"
              className="border p-2 w-full rounded"
            />
            <ErrorMessage
              name="name"
              component="div"
              className="text-red-500 text-sm"
            />
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block font-medium">
              Email
            </label>
            <Field
              type="email"
              name="email"
              id="email"
              className="border p-2 w-full rounded"
            />
            <ErrorMessage
              name="email"
              component="div"
              className="text-red-500 text-sm"
            />
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block font-medium">
              Password
            </label>
            <Field
              type="password"
              name="password"
              id="password"
              className="border p-2 w-full rounded"
            />
            <ErrorMessage
              name="password"
              component="div"
              className="text-red-500 text-sm"
            />
          </div>

          {/* Contact */}
          <div>
            <label htmlFor="contact" className="block font-medium">
              Contact
            </label>
            <Field
              type="number"
              name="contact"
              id="contact"
              className="border p-2 w-full rounded"
            />
            <ErrorMessage
              name="contact"
              component="div"
              className="text-red-500 text-sm"
            />
          </div>

          {/* Role */}
          {profile?.role !== "Admin" && (
            <div>
              <label htmlFor="role" className="block font-medium">
                Role
              </label>
              <Field
                as="select"
                name="role"
                id="role"
                className="border p-2 w-full rounded"
              >
                <option value="">Select role</option>
                <option value="Customer">Customer</option>
                <option value="Owner">Owner</option>
              </Field>
              <ErrorMessage
                name="role"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            {isSubmitting ? "submitting...." : "submit"}
          </button>
        </Form>
      )}
    </Formik>
  );
}
