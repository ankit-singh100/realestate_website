import type { Property, PropertyImage } from "../../api/PropertyApi";
import PropertyForm from "../../components/properties/PropertyForm";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import propertyApi from "../../api/PropertyApi";
import { useAuth } from "../../context/AuthContext";

export default function PropertyEdit() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [property, setProperty] = useState<Property | null>(null);
  const [initialValues, setInitialValues] = useState<Omit<
    Property,
    "id" | "images"
  > | null>(null);
  const [images, setImages] = useState<PropertyImage[]>([]);
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(true);

  const isOwner = user?.id === property?.ownerId;
  const isAdmin = user?.role === "Admin";

  useEffect(() => {
    if (!id) return;

    const fetchProperty = async () => {
      try {
        const data: Property = await propertyApi.getById(Number(id));
        setProperty(data);

        setInitialValues({
          title: data.title,
          description: data.description ?? "",
          price: data.price,
          address: data.address,
          status: data.status,
          type: data.type,
        });

        setImages(data.images || []);
      } catch (error) {
        console.error("Failed to fetch property", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id]);

  if (loading) return <p className="p-4 text-center">Loading property...</p>;
  if (!initialValues || !property)
    return <p className="p-4 text-red-600 text-center">Property not found</p>;

  const handleSubmit = async (values: typeof initialValues, files?: File[]) => {
    if (!isOwner) {
      // Owner can update everything
      await propertyApi.update(Number(id), {
        title: values.title,
        description: values.description,
        price: values.price,
        address: values.address,
        type: values.type,
        status: values.status,
      });
      if (files && files.length > 0) {
        await Promise.all(
          files.map((file) => propertyApi.upload(Number(id), file))
        );
      }
    } else if (isAdmin) {
      // Admin can only update status
      await propertyApi.update(Number(id), {
        status: values.status,
      });
    }

    try {
      await propertyApi.update(Number(id), {
        title: values.title,
        description: values.description,
        price: values.price,
        address: values.address,
        type: values.type,
        status: values.status,
      });

      // Upload new images if any
      if (files && files.length > 0) {
        await Promise.all(
          files.map((file) => propertyApi.upload(Number(id), file))
        );
      }

      alert("✅ Property updated successfully!");
      navigate("/properties");
    } catch (error) {
      console.error("Failed to update property:", error);
      alert("Failed to update property");
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Edit Your Property
      </h1>

      {!isOwner && !isAdmin ? (
        <p className="text-red-500 text-center">
          You are not authorized to edit this property.
        </p>
      ) : (
        <PropertyForm
          initialValues={initialValues}
          onSubmit={handleSubmit}
          isOwner={isOwner}
          isAdmin={isAdmin}
          isEdit
          images={images}
          setImages={setImages}
          newFiles={newFiles}
          setNewFiles={setNewFiles}
          isOwnerOrAdmin={isOwner}
        />
      )}

      <div className="mt-6 text-center">
        <button
          onClick={() => navigate("/properties")}
          className="text-blue-500 underline"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
``;
