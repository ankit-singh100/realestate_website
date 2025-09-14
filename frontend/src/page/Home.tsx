import PropertyList from "./properties/PropertyListPage";

export default function Home() {
  return (
    <div className="container mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold mb-6">Welcome to PropMart</h1>
      <PropertyList />
    </div>
  );
}
