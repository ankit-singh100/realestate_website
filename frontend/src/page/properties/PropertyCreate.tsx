import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useState } from "react";
import propertyApi from "@/api/PropertyApi";
import { useNavigate } from "react-router-dom";

// ✅ Validation schema restricted to Owner's allowed statuses
const PropertySchema = Yup.object().shape({
  title: Yup.string().required("Title is required"),
  description: Yup.string().nullable(),
  price: Yup.number()
    .required("Price is required")
    .positive("Price must be positive"),
  address: Yup.string().required("Address is required"),
  status: Yup.mixed<"onSale" | "forRental">()
    .oneOf(
      ["onSale", "forRental"],
      "Owner can only set status to onSale or forRental"
    )
    .required("Status is required"),
  type: Yup.mixed<"House" | "Apartment" | "Land">()
    .oneOf(["House", "Apartment", "Land"])
    .required("Type is required"),
});

const PropertyForm = () => {
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const navigate = useNavigate();

  return (
    <Formik
      initialValues={{
        title: "",
        description: "",
        price: 0,
        address: "",
        status: "onSale", // ✅ default to allowed value
        type: "House",
        image: null as File | null,
      }}
      validationSchema={PropertySchema}
      onSubmit={async (values, { resetForm }) => {
        try {
          setLoading(true);

          const propertyData = {
            title: values.title,
            description: values.description,
            price: Number(values.price),
            address: values.address,
            status: values.status as "onSale" | "forRental",
            type: values.type as "House" | "Apartment" | "Land",
          };

          // ✅ Create property (ownerId handled in backend)
          const property = await propertyApi.create(propertyData);

          // ✅ Upload image if selected
          if (values.image) {
            await propertyApi.upload(property.id, values.image);
          }

          alert("✅ Property created successfully!");
          navigate("/");
          resetForm();
          setPreview(null);
        } catch (err: any) {
          console.error("❌ Create property error:", err.response?.data || err);
          alert("Failed to create property");
        } finally {
          setLoading(false);
        }
      }}
    >
      {({ setFieldValue }) => (
        <Form className="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow-lg space-y-6">
          <h2 className="text-2xl font-bold text-gray-800">Create Property</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Title */}
            <div>
              <Field
                name="title"
                placeholder="Title"
                className="border p-2 w-full"
              />
              <ErrorMessage
                name="title"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>

            {/* Description */}
            <div>
              <Field
                name="description"
                placeholder="Description"
                className="border p-2 w-full"
              />
              <ErrorMessage
                name="description"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>

            {/* Price */}
            <div>
              <Field
                name="price"
                type="number"
                placeholder="Price"
                className="border p-2 w-full"
              />
              <ErrorMessage
                name="price"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>

            {/* Address */}
            <div>
              <Field
                name="address"
                placeholder="Address"
                className="border p-2 w-full"
              />
              <ErrorMessage
                name="address"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>

            {/* ✅ Status restricted to "onSale" or "forRental" */}
            <div>
              <Field as="select" name="status" className="border p-2 w-full">
                <option value="onSale">onSale</option>
                <option value="forRental">forRental</option>
              </Field>
              <ErrorMessage
                name="status"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>

            {/* Type */}
            <div>
              <Field as="select" name="type" className="border p-2 w-full">
                <option value="House">House</option>
                <option value="Apartment">Apartment</option>
                <option value="Land">Land</option>
              </Field>
              <ErrorMessage
                name="type"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>

            {/* File Upload */}
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

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
          >
            {loading ? "Creating..." : "Create Property"}
          </button>
        </Form>
      )}
    </Formik>
  );
};

export default PropertyForm;
