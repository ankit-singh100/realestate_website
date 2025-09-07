import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import Alert from "../ui/Alert";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { authApi } from "../../api/authApi";
import Input from "../ui/Input";
import { Button } from "../ui/Button";

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
  const { user } = useAuth();
  const navigate = useNavigate();
  const [initialValues, setInitialValues] = useState({
    name: "",
    email: "",
    password: "",
    role: "Customer",
    avatarUrl: "",
  });
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  //   fetch profile'
  useEffect(() => {
    async function fetchProfile() {
      if (!user) return;
      try {
        const response = await authApi.getProfile();
        console.log(response.data);

        if (response) {
          setInitialValues({
            name: response.data.name || "",
            email: response.data.email || "",
            password: "",
            role: response.data.role || "Customer",
            avatarUrl: response.data.avatarUrl || "default.png",
          });
        }
      } catch (error: any) {
        setError("failed to load profile");
        console.log(error);
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, [user]);

  if (loading)
    return <p className="text-center mt-10">Loading profile......</p>;

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-lg rounded-xl">
      <h2>Edit Profile</h2>
      {success && <Alert type="success" message={success} />}
      {error && <Alert type="error" message={error} />}

      <Formik
        enableReinitialize
        initialValues={initialValues}
        validationSchema={schema}
        onSubmit={async (values, { setSubmitting }) => {
          setError(null);
          setSuccess(null);
          try {
            if (!user) throw new Error("user not logged in");
            // only send password if user typed something
            const payload: any = {
              name: values.name,
              email: values.email,
              role: values.role,
              avatarUrl: values.avatarUrl,
            };
            if (values.password) {
              payload.password = values.password;
            }
            // await authApi.updateUser(user.id);
            setSuccess("Profile updated");
          } catch (error: any) {
            setError(error.response?.data?.message || "updated failed");
          }
          setSubmitting(false);
        }}
      >
        {({ isSubmitting, values }) => (
          <Form className="flex flex-col gap-4">
            {/* Name */}
            <div>
              <Field
                as={Input}
                name="name"
                label="Name"
                placeholder="Enter your name"
              />
              <ErrorMessage
                name="name"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            {/* Email */}
            <div>
              <Field
                as={Input}
                name="email"
                label="Email"
                placeholder="Enter your email"
              />
              <ErrorMessage
                name="email"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            {/*  */}
            <div>
              <Field
                as={Input}
                name="password"
                label="Password"
                type="password"
                placeholder="Enter your password"
              />
              <ErrorMessage
                name="password"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            {/*  */}
            <div>
              <Field name="avatarUrl">
                {({ field, form }: any) => (
                  <div className="flex flex-col gap-2">
                    <label className="font-medium mb-1">Profile Picture</label>
                    {/* Hidden file input */}
                    <input
                      id="avatarUrl"
                      name="avatarUrl"
                      type="file"
                      accept="image/*"
                      style={{ display: "none" }}
                      onChange={(event) => {
                        const file = event.currentTarget.files?.[0] || null;
                        form.setFieldValue("avatarUrl", file);
                      }}
                    />

                    {/* Custom button acting as label */}
                    <label
                      htmlFor="avatarUrl"
                      className="cursor-pointer px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 w-max text-center"
                    >
                      Choose Image
                    </label>
                    {/* Show selected file name */}
                    {field.value && (
                      <span className="text-sm text-gray-700 mt-1">
                        Selected file: {(field.value as File).name}
                      </span>
                    )}
                    {/* Error display */}
                    {form.errors.avatarUrl && form.touched.avatarUrl && (
                      <span className="text-red-500">
                        {form.errors.avatarUrl}
                      </span>
                    )}
                  </div>
                )}
              </Field>
              {values.avatarUrl && (
                <div className="mt-3 flex justify-center">
                  <img
                    src={values.avatarUrl}
                    alt="Preview"
                    className="w-20 h-20 rounded-full border object-cover"
                    onLoad={(e) =>
                      URL.revokeObjectURL((e.target as HTMLImageElement).src)
                    } // clean up memory
                  />
                </div>
              )}
            </div>

            <div>
              <label className="block text-gray-700 mb-1">Role</label>
              <Field
                as="select"
                name="role"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="Customer">Customer</option>
                <option value="Owner">Owner</option>
              </Field>
              <ErrorMessage
                name="role"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            <Button type="submit" variant="primary" disabled={isSubmitting}>
              {isSubmitting ? "saving...." : "Save changes"}
            </Button>
          </Form>
        )}
      </Formik>
    </div>
  );
}
