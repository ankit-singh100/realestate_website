import type { Property, PropertyImage } from "../../api/PropertyApi";
import PropertyForm from "../../components/properties/PropertyForm";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import propertyApi from "../../api/PropertyApi";

export default function PropertyEdit() {
  const { id } = useParams<{ id: string }>();
  const [initialValues, setInitialValues] = useState<Omit<
    Property,
    "id" | "images"
  > | null>(null);
  const [images, setImages] = useState<PropertyImage[]>([]);
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) return;
    const fetchProperty = async () => {
      try {
        const property: Property = await propertyApi.getById(Number(id));
        setInitialValues({
          title: property.title,
          description: property.description ?? "",
          price: property.price,
          address: property.address,
          status: property.status,
          type: property.type,
        });
        setImages(property.images || []);
      } catch (error) {
        console.error("Failed to fetch property", error);
      }
    };
    fetchProperty();
  }, [id]);

  if (!initialValues) return <p>Loading property...</p>;

  // Handle form submission
  const handleSubmit = async (values: typeof initialValues) => {
    if (!id) return;

    try {
      // Update property
      await propertyApi.update(Number(id), {
        ...values,
        status: values.status as "Available" | "Sold" | "Pending",
        type: values.type as "House" | "Apartment" | "Land",
      });

      // Upload new images if any
      if (newFiles.length > 0) {
        await Promise.all(
          newFiles.map((file) => propertyApi.upload(Number(id), file))
        );
      }

      alert("Property updated successfully!");
      navigate("/properties"); // redirect to property list
    } catch (error) {
      console.error("Failed to update property:", error);
      alert("Failed to update property");
    }
  };

  return (
    <div>
      <h1>Edit Property</h1>
      <PropertyForm
        initialValues={initialValues}
        onSubmit={handleSubmit}
        isEdit
        images={images}
        setImages={setImages}
        newFiles={newFiles}
        setNewFiles={setNewFiles}
      />
    </div>
  );
}
