import Alert from "@/components/ui/Alert";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import { ErrorMessage, Field, Form, Formik } from "formik";
import * as Yup from "yup";
import Input from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import {
  NavLink,
  useNavigate,
} from "react-router-dom";

// Yup schema
const registerSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 character long")
    .required("password is required"),
  role: Yup.string()
    .oneOf(["Owner", "Customer"], "Invalid role")
    .required("Role is required"),
});

export default function Register() {
  const { register } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const navigate = useNavigate();

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-lg rounded-xl">
      <h2 className="text-2xl font-bold mb-4">Create an Account</h2>
      {error && <Alert type="error" message={error} />}
      {success && <Alert type="success" message={success} />}

      <Formik
        initialValues={{ name: "", email: "", password: "", role: "Customer" }}
        validationSchema={registerSchema}
        onSubmit={async (values, { setSubmitting, resetForm }) => {
          setError(null);
          setSuccess(null);
          try {
            await register(
              values.name,
              values.email,
              values.password,
              values.role as "Customer" | "Owner"
            );
            setSuccess("Registration successful! You can now login!");
            navigate("/");
            resetForm();
          } catch (err: any) {
            setError(err.response?.data?.message || "Registration failed.");
          }
          setSubmitting(false);
        }}
      >
        {({ isSubmitting }) => (
          <Form className="flex flex-col gap-4 mt-4">
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

            <div>
              <Field
                as={Input}
                name="email"
                label="Email"
                placeholder="Enter your email"
                type="email"
              />
              <ErrorMessage
                name="email"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            <div>
              <Field
                as={Input}
                name="password"
                label="Password"
                placeholder="Enter your password"
                type="password"
              />
              <ErrorMessage
                name="password"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            {/* Role */}
            <div>
              <label className="text-sm font-medium text-gray-700">Role</label>
              <Field
                as="select"
                name="role"
                className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Customer">Customer</option>
                <option value="Owner">Owner</option>
              </Field>
            </div>

            <Button type="submit" variant="primary" disabled={isSubmitting}>
              {isSubmitting ? "Registering..." : "Register"}
            </Button>

            {/* Login link */}
            <p className="text-center text-gray-600">
              Already have an account?
              <NavLink to="/login" className="text-blue-500 hover:underline">
                Login
              </NavLink>
            </p>
          </Form>
        )}
      </Formik>
    </div>
  );
}
