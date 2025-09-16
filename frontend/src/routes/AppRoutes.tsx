import ProfileMenu from "../components/profile/ProfileMenu";
import { Footer } from "../components/layout/Footer";
import { Navbar } from "../components/layout/Navbar";
import { useAuth } from "../context/AuthContext";
import About from "../page/About";
import Login from "../page/auth/Login";
import Register from "../page/auth/Register";
import Contact from "../page/Contact";
import Home from "../page/Home";
// import type { JSX } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import EditProfile from "../components/profile/EditProfile";
import PropertyList from "../page/properties/PropertyListPage";
// import PropertyDetail from "../page/properties/PropertyDetailPage";
import PropertyCreate from "@/page/properties/PropertyCreate";
import PropertyEdit from "@/page/properties/PropertyEditPage";
import { PropertyDetail } from "@/page/properties/PropertyDetail";
import FavoritePage from "@/page/favorite/FavoritePage";
import Dashboard from "@/page/AdminDashboard";
import PaymentCard from "@/page/payment/Payment";

interface Props {
  children: React.ReactNode;
  requiredRole?: string;
}

function PrivateRoute({ children, requiredRole }: Props) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (requiredRole && user.role !== requiredRole)
    return <Navigate to="/" replace />;

  return <>{children}</>;
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
            <Route path="/payment" element={<PaymentCard />} />

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
              path="/users/profile/:id"
              element={
                <PrivateRoute>
                  <EditProfile />
                </PrivateRoute>
              }
            />

            {/* Properties */}
            <Route
              path="/properties/add"
              element={
                <PrivateRoute>
                  <PropertyCreate />
                </PrivateRoute>
              }
            />
            <Route
              path="/properties/get/:id"
              element={
                <PrivateRoute>
                  <PropertyDetail />
                </PrivateRoute>
              }
            />
            <Route
              path="/properties/edit/:id"
              element={
                <PrivateRoute>
                  <PropertyEdit />
                </PrivateRoute>
              }
            />
            <Route
              path="/favourites"
              element={
                <PrivateRoute>
                  <FavoritePage />
                </PrivateRoute>
              }
            />
            {/* <Route path="/properties/:id" element={<PrivateRoute><PropertyDetail /></PrivateRoute>} /> */}

            {/* Admin Routes */}
            <Route
              path="/users/admin-dashboard"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />

            {/* Fallback */}
            {/* <Route path="*" element={<Navigate to="/"}/> */}
          </Routes>
        </main>

        <Footer />
      </div>
    </BrowserRouter>
  );
}
