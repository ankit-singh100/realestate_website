import ProfileMenu from "../components/profile/ProfileMenu";
import { Footer } from "../components/layout/Footer";
import { Navbar } from "../components/layout/Navbar";
import { useAuth } from "../context/AuthContext";
import About from "../page/About";
import Login from "../page/auth/Login";
import Register from "../page/auth/Register";
import Contact from "../page/Contact";
import Home from "../page/Home";
import type { JSX } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import EditProfile from "../components/profile/EditProfile";
import PropertyList from "../page/properties/PropertyListPage";
// import PropertyDetail from "../page/properties/PropertyDetailPage";
import PropertyCreate from "@/page/properties/PropertyCreate";
import PropertyEdit from "@/page/properties/PropertyEditPage";

function PrivateRoute({ children }: { children: JSX.Element }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
}

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen">
        <Navbar />

        <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Routes>
            {/* Public */}
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/properties" element={<PropertyList />} />

            {/* protected routes */}
            <Route
              path="/profile"
              element={
                <PrivateRoute>
                  <ProfileMenu />
                </PrivateRoute>
              }
            />
            <Route
              path="/profile/:id"
              element={
                <PrivateRoute>
                  <EditProfile />
                </PrivateRoute>
              }
            />

            {/* Properties */}
            <Route
              path="/properties"
              element={
                <PrivateRoute>
                  <PropertyCreate />
                </PrivateRoute>
              }
            />
            <Route
              path="/properties/:id"
              element={
                <PrivateRoute>
                  <PropertyEdit />
                </PrivateRoute>
              }
            />
            {/* <Route path="/properties/:id" element={<PrivateRoute><PropertyDetail /></PrivateRoute>} /> */}

            {/* Admin Routes */}
            {/* <Route path="/admin" element={<AdminRoutes/>}/> */}

            {/* Fallback */}
            {/* <Route path="*" element={<Navigate to="/"}/> */}
          </Routes>
        </main>

        <Footer />
      </div>
    </BrowserRouter>
  );
}
