import PropertyForm from "@/components/properties/PropertyForm";
import { useProperty } from "@/context/PropertyContext";
import { useState } from "react";

export default function () {
  const { createProperty } = useProperty();
  const [loading, setLoading] = useState(false);

  const initialValues = {
    title: "",
    description: "",
    price: 0,
    address: "",
    status: "Available" as const,

    type: "House" as const,
    imageUrl: null as File | null,
  };

  const handleSubmit = async (values: typeof initialValues) => {
    console.log("Creating Properties:", values);
    // TODO: call Createproperty api
    setLoading(true);
    try {
      const data = {
        title: values.title,
        description: values.description,
        price: values.price,
        address: values.address,
        type: values.type,
        status: values.status,
        imagesUrl: values.imageUrl,
      };
      const created = await createProperty(data, values.imageUrl || undefined);
      if (created) {
        alert("Property created successfully!");
      }
    } catch (error) {
      console.error("Failed to create property:", error);
      alert("Failed to create property");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="">
      <h1 className="text-2xl font-bold mb-4">Create Property</h1>
      <PropertyForm initialValues={initialValues} onSubmit={handleSubmit} />
    </div>
  );
}
