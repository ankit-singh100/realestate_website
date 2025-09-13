import PropertyForm from "@/components/properties/PropertyForm";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function PropertyEdit() {
  const { id } = useParams();
  const [initialValues, setInitialValues] = useState<any | null>(null);

  useEffect(() => {
    // TODO: Replace with getProperty
    setInitialValues({
      id: 1,
      title: "Luxury villa in ktm",
      price: 150000,
      address: "Lazimpat, ktm",
      imagesUrl: "https://via.placeholder.com/400x250",
      status: "Available",
      type: "Apartment",
    });
  }, [id]);

  const handleSUbmit = async (values: any) => {
    console.log("Updating properties", id, values);
    // TODO: call updateproperty api
  };

  if (!initialValues) return <p>Loading....</p>;

  return (
    <div>
      <h1>Edit Property</h1>
      <PropertyForm
        initialValues={initialValues}
        onSubmit={handleSUbmit}
        isEdit
      />
    </div>
  );
}
