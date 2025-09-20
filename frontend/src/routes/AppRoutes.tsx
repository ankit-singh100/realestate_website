import ProfileMenu from "../components/profile/ProfileMenu";
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
import OwnerDashboard from "@/page/OwnerDashboard";
import MainLayout from "@/components/layout/MainLayout";
// import ProfilePage from "@/page/Profile/ProfilePage";
// import LayoutWrapper from "@/page/LayoutWrapper";

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
      <main>
        <Routes>
          <Route element={<MainLayout />}>
            {/* Public */}
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/properties" element={<PropertyList />} />
            <Route path="/payment" element={<PaymentCard />} />
            <Route
              path="/properties/owner/:id"
              element={
                <PrivateRoute>
                  <OwnerDashboard />
                </PrivateRoute>
              }
            />

            {/* protected routes */}
            {/* <Route
              path="/users"
              element={
                <PrivateRoute>
                  <ProfilePage />
                </PrivateRoute>
              }
            /> */}
            <Route
              path="/users/profile/:id"
              element={
                <PrivateRoute>
                  <ProfileMenu />
                </PrivateRoute>
              }
            />
            <Route
              path="/users/:id"
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
          </Route>

          {/* Admin Routes */}
          <Route
            path="/users/admin-dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
        </Routes>
      </main>
    </BrowserRouter>
  );
}
