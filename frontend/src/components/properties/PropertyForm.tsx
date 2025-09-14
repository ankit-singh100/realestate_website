import { ErrorMessage, Field, Form, Formik } from "formik";
import * as Yup from "yup";
import Input from "../ui/Input";
import { Button } from "../ui/Button";
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
}) => {
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={PropertySchema}
      onSubmit={async (values, { setSubmitting }) => {
        await onSubmit(values);
        setSubmitting(false);
      }}
    >
      {({ isSubmitting, values }) => (
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
          <div>
            <img
              src={values.imagesUrl}
              alt="preview"
              className="w-32 h-32 object-cover rounded-lg border"
            />
          </div>

          {/* Submit button */}
          <Button type="submit" variant="primary" disabled={isSubmitting}>
            {isSubmitting
              ? "Saving.... "
              : isEdit
              ? "updated Property"
              : "Create Property"}
          </Button>
        </Form>
      )}
    </Formik>
  );
};
export default PropertyForm;
