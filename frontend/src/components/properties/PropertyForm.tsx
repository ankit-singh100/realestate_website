import { ErrorMessage, Field, Form, Formik } from "formik";
import * as Yup from "yup";
import Input from "../ui/Input";
import type { PropertyImage } from "@/api/PropertyApi";
import type { ChangeEvent, Dispatch, SetStateAction } from "react";
// Ensure you import your API

interface PropertyCardProps {
  title: string;
  description?: string;
  price: number;
  address: string;
  imagesUrl?: string;
  status?: "Pending" | "onSale" | "Sold" | "forRental" | "Rented"; // 👈 Use backend enum
  type: "House" | "Apartment" | "Land";
  owner?: { name: string; avatarUrl?: string };
  createdAt?: string;
}

interface PropertyFormProps {
  initialValues: PropertyCardProps;
  onSubmit?: (
    values: PropertyCardProps,
    newFiles?: File[]
  ) => Promise<void> | void;
  isEdit?: boolean;
  isOwner?: boolean;
  isAdmin?: boolean;
  images?: PropertyImage[];
  setImages?: Dispatch<SetStateAction<PropertyImage[]>>;
  newFiles?: File[];
  setNewFiles?: Dispatch<SetStateAction<File[]>>;
}

const PropertySchema = Yup.object().shape({
  title: Yup.string().required("Title is required"),
  description: Yup.string().max(500, "Description too long"),
  price: Yup.number()
    .required("Price is required")
    .min(0, "Cannot be negative"),
  address: Yup.string().required("Address is required"),
  type: Yup.string().required("Property Type is required"),
});

const PropertyForm: React.FC<PropertyFormProps> = ({
  initialValues,
  onSubmit,
  isOwner,
  isAdmin,
  isEdit = false,
  images = [],
  setImages,
  newFiles = [],
  setNewFiles,
}) => {
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !setNewFiles) return;
    const filesArray = Array.from(e.target.files);
    setNewFiles([...newFiles, ...filesArray]);
  };

  const handleRemoveExistingImage = (id: number) => {
    if (!setImages) return;
    setImages(images.filter((img) => img.id !== id));
  };

  const handleRemoveNewFile = (index: number) => {
    if (!setNewFiles) return;
    URL.revokeObjectURL(newFiles[index].name);
    setNewFiles(newFiles.filter((_, i) => i !== index));
  };

  // Default submit handler if none provided
  // const defaultSubmit = async (values: PropertyCardProps) => {
  //   try {
  //     // Automatically set status to PENDING for admin approval
  //     await propertyApi.create(values);
  //     alert("Property submitted! Waiting for admin approval.");
  //   } catch (err) {
  //     console.error(err);
  //     alert("Failed to submit property.");
  //   }
  // };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={PropertySchema}
      onSubmit={async (values, { setSubmitting }) => {
        if (!isOwner && !isAdmin) {
          alert("Only the owner and admin can update this property.");
          setSubmitting(false);
          return;
        }
        // restrict status to only onSale / forRental
        // if (values.status !== "onSale" && values.status !== "forRental") {
        //   alert("Status can only be 'onSale' or 'forRental'.");
        //   setSubmitting(false);
        //   return;
        // }
        if (onSubmit) {
          await onSubmit(values, newFiles);
        }
        setSubmitting(false);
      }}
    >
      {({ isSubmitting }) => (
        <Form className="flex flex-col gap-4 bg-white p-6 rounded-lg shadow-md">
          {/* Title */}
          <div>
            <Field
              as={Input}
              name="title"
              label="Title"
              placeholder="Enter property title"
            />
            <ErrorMessage
              name="title"
              component="div"
              className="text-red-500 text-sm mt-1"
            />
          </div>

          {/* Description */}
          <div>
            <Field
              as="textarea"
              name="description"
              placeholder="Enter description"
              rows={4}
              className="w-full border rounded-md p-2"
            />
            <ErrorMessage
              name="description"
              component="div"
              className="text-red-500 text-sm mt-1"
            />
          </div>

          {/* Address */}
          <div>
            <Field
              as={Input}
              name="address"
              label="Address"
              placeholder="Enter address"
            />
            <ErrorMessage
              name="address"
              component="div"
              className="text-red-500 text-sm mt-1"
            />
          </div>

          {/* Type */}
          <div>
            <label className="block text-sm font-medium mb-1">Type</label>
            <Field
              as="select"
              name="status"
              className="w-full border rounded-md p-2"
            >
              <option value="">Select status</option>
              <option value="onSale">on Sale</option>
              <option value="Sold">Sold</option>
              <option value="forRental">for Rental</option>
              <option value="Rented">Rented</option>
            </Field>
            <ErrorMessage
              name="type"
              component="div"
              className="text-red-500 text-sm mt-1"
            />
          </div>

          {/* Type */}
          <div>
            <label className="block text-sm font-medium mb-1">Type</label>
            <Field
              as="select"
              name="type"
              className="w-full border rounded-md p-2"
            >
              <option value="">Select type</option>
              <option value="House">House</option>
              <option value="Apartment">Apartment</option>
              <option value="Land">Land</option>
            </Field>
            <ErrorMessage
              name="type"
              component="div"
              className="text-red-500 text-sm mt-1"
            />
          </div>

          {/* Existing Images */}
          {isEdit && images.length > 0 && (
            <div>
              <h3 className="font-semibold mb-2">Existing Images</h3>
              <div className="flex gap-2 flex-wrap">
                {images.map((img) => (
                  <div key={img.id} className="relative">
                    <img
                      src={img.url}
                      alt="preview"
                      className="w-32 h-32 object-cover rounded-lg border"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveExistingImage(img.id)}
                      className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6"
                    >
                      &times;
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* New Files */}
          {newFiles.length > 0 && (
            <div>
              <h3 className="font-semibold mb-2">New Images</h3>
              <div className="flex gap-2 flex-wrap">
                {newFiles.map((file, i) => (
                  <div key={i} className="relative">
                    <img
                      src={URL.createObjectURL(file)}
                      alt=""
                      className="w-24 h-24 object-cover rounded-md border"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveNewFile(i)}
                      className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6"
                    >
                      &times;
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* File Upload */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Upload Images
            </label>
            <input type="file" multiple onChange={handleFileChange} />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            {isEdit ? "Update Property" : "Create Property"}
          </button>
        </Form>
      )}
    </Formik>
  );
};

export default PropertyForm;
