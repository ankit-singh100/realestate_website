import PropertyForm from "@/components/properties/PropertyForm";

export default function () {
  const initialValues = {
    title: "",
    description: "",
    price: 0,
    address: "",
    type: "",
    status: "Available" as const,
    imageUrl: "",
  };

  const handleSubmit = async (values: typeof initialValues) => {
    console.log("Creating Properties:", values);
    // TODO: call Createproperty api
  };

  return (
    <div className="">
      <h1 className="text-2xl font-bold mb-4">Create Property</h1>
        <PropertyForm initialValues={initialValues} onSubmit={handleSubmit} />
    </div>
  );
}
