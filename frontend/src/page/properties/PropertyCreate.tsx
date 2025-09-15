import { Formik, Form, Field } from "formik";
import { useState } from "react";
import propertyApi from "@/api/PropertyApi";
import { useNavigate } from "react-router-dom";
// import { useAuth } from "@/context/AuthContext";

const PropertyForm = () => {
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const navigate = useNavigate();
  // const { user } = useAuth();

  // Check user role
  // if (!user || (user.role !== "Admin" && user.role !== "Owner")) {
  //   return (
  //     <div className="flex flex-col items-center justify-center min-h-screen">
  //       <h2 className="text-xl font-semibold text-red-600">
  //         You are not authorized to create a property.
  //       </h2>
  //     </div>
  //   );
  // }

  return (
    <Formik
      initialValues={{
        title: "",
        description: "",
        price: 0,
        address: "",
        status: "Available",
        type: "House",
        image: null as File | null,
      }}
      onSubmit={async (values, { resetForm }) => {
        try {
          setLoading(true);

          //create property
          const propertyData = {
            title: values.title,
            description: values.description,
            price: values.price,
            address: values.address,
            status: values.status as "Available" | "Sold" | "Pending",
            type: values.type as "House" | "Apartment" | "Land",
          };
          const property = await propertyApi.create(propertyData);
          //upload image if selected
          if (values.image) await propertyApi.upload(property.id, values.image);

          alert("Property created successfully!");
          navigate("/");
          resetForm();
          setPreview(null);
        } catch (err) {
          console.error(err);
          alert("Failed to create property");
        } finally {
          setLoading(false);
        }
      }}
    >
      {({ setFieldValue }) => (
        <Form className="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow-lg space-y-6">
          <h2 className="text-2xl font-bold text-gray-800">Create Property</h2>

          {/* Responsive Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Field name="title" placeholder="title" className="border p-2" />
            <Field
              name="description"
              placeholder="Description"
              className="border p-2"
            />
            <Field
              name="price"
              type="number"
              placeholder="Price"
              className="border p-2"
            />
            <Field
              name="address"
              placeholder="Address"
              className="border p-2"
            />

            <select name="status" className="border p-2">
              <option value="Available">Available</option>
              <option value="Sold">Sold</option>
              <option value="Pending">Pending</option>
            </select>

            <select name="type" className="border p-2">
              <option value="House">House</option>
              <option value="Apartment">Apartment</option>
              <option value="Land">Land</option>
            </select>

            {/* File Upload with preview */}
            <div className="col-span-1 md:col-span-2">
              <label
                htmlFor="image"
                className="flex items-center justify-center w-full p-4 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition"
              >
                {preview ? (
                  <img
                    src={preview}
                    alt="preview"
                    className="w-32 h-32 object-cover rounded"
                  />
                ) : (
                  <span className="text-gray-600">
                    📁 Click to choose an image (or drag & drop)
                  </span>
                )}
              </label>
              <input
                id="image"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.currentTarget.files?.[0] || null;
                  setFieldValue("image", file);
                  if (file) setPreview(URL.createObjectURL(file));
                }}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            {loading ? "Creating..." : "Create Property"}
          </button>
        </Form>
      )}
    </Formik>
  );
};

export default PropertyForm;
