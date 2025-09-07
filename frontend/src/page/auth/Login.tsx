import Alert from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { useAuth } from "@/context/AuthContext";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import * as Yup from "yup";

// Validation schema
const loginSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is rquired"),
});

export default function Login() {
  const { login } = useAuth();

  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-lg rounded-xl">
      <h2 className="text-2xl font-bold mb-4">Login</h2>
      {error && <Alert type="error" message={error} />}
      <Formik
        initialValues={{ email: "", password: "" }}
        validationSchema={loginSchema}
        onSubmit={async (values, { setSubmitting }) => {
          setError(null);
          try {
            await login(values.email, values.password);
            navigate("/");
          } catch (err: any) {
            setError(err.response?.data?.message || "Invalid credentials");
          }
          setSubmitting(false);
        }}
      >
        {({ isSubmitting }) => (
          <Form className="flex flex-col gap-4 mt-4">
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
                placeholder="Enter your Password"
                type="password"
              />
              <ErrorMessage
                name="password"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            <Button type="submit" variant="primary" disabled={isSubmitting}>
              {isSubmitting ? "Logging in..." : "Login"}
            </Button>

            <p className="w-full mt-4 text-center">
              Don't have an account?
              <span className="ml-2 text-blue-500 hover:underline">
                <NavLink to="/register">Register</NavLink>
              </span>
            </p>
          </Form>
        )}
      </Formik>
    </div>
  );
}
