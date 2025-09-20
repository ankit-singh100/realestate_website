import { Outlet } from "react-router-dom";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";

export default function MainLayout() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-300">
      <Navbar />
      <main className="flex-1 mb-4 p-4">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
