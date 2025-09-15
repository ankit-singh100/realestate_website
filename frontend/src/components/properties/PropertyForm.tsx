import { ErrorMessage, Field, Form, Formik } from "formik";
import * as Yup from "yup";
import Input from "../ui/Input";
import type { PropertyImage } from "@/api/PropertyApi";
import type { ChangeEvent, Dispatch, SetStateAction } from "react";
interface PropertyCardProps {
  title: string;
  description?: string;
  price: number;
  address: string;
  imagesUrl?: string;
  status: "Available" | "Sold" | "Pending";
  type: "House" | "Apartment" | "Land";
  owner?: {
    name: string;
    avatarUrl?: string;
  };
}

interface ProperytFormProps {
  initialValues: PropertyCardProps;
  onSubmit: (values: PropertyCardProps) => Promise<void> | void;
  isEdit?: boolean;
  // for editing images
  images?: PropertyImage[];
  setImages?: Dispatch<SetStateAction<PropertyImage[]>>;
  newFiles?: File[];
  setNewFiles?: Dispatch<SetStateAction<File[]>>;
}

const PropertySchema = Yup.object().shape({
  title: Yup.string().required("Title is required"),
  description: Yup.string().optional().max(500, "Description too long"),
  price: Yup.number().required("Price is required"),
  address: Yup.string().required("Address is required"),
  status: Yup.string().required("Property status is required"),
  type: Yup.string().required("Property Type is required"),
  imagesUrl: Yup.string().url("Must be a valid Url").nullable(),
});

const PropertyForm: React.FC<ProperytFormProps> = ({
  initialValues,
  onSubmit,
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
    setNewFiles(newFiles.filter((_, i) => i !== index));
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={PropertySchema}
      onSubmit={async (values, { setSubmitting }) => {
        await onSubmit(values);
        setSubmitting(false);
      }}
    >
      <Form className=" flex  flex-col gap-4 bg-white p-6 rounded-lg shadow-md">
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
            label="Description"
            placeholder="Enter description"
            rows={4}
            className="w-full border rounded-md p-2"
          />
        </div>

        {/* Price */}
        <div>
          <Field
            as={Input}
            name="address"
            label="Address"
            placeholde="Enter address"
          />
          <ErrorMessage
            name="address"
            component="div"
            className="text-red-500 text-sm mt-1"
          />
        </div>

        {/* status */}
        <div>
          <label className="block text-sm font-medium mb-1">Status</label>
          <Field
            as="select"
            name="type"
            className="w-full border rounded-md p-2"
          >
            <option>Select type</option>
            <option value="Available">Available</option>
            <option value="Sold">Sold</option>
            <option value="Rented">Rented</option>
            <option value="Pendinig">Pending</option>
          </Field>
          <ErrorMessage
            name="status"
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
            <option>Select type</option>
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

        {/* Image url */}
        {isEdit && images.length > 0 && (
          <div>
            <h3>Existing images</h3>
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

        {newFiles.length > 0 && (
          <div>
            <h3>New Images</h3>
            <div className="flex gap-2 flex-wrap">
              {newFiles.map((file, i) => (
                <div key={i} className="relative">
                  <img
                    src={URL.createObjectURL(file)}
                    alt=""
                    className="w-24 h-24 object-cover"
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

        {/* Submit button */}
        <div>
          <label>Upload Images</label>
          <input type="file" multiple onChange={handleFileChange} />
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          {isEdit ? "Update Property" : "Create Property"}
        </button>
      </Form>
    </Formik>
  );
};
export default PropertyForm;
