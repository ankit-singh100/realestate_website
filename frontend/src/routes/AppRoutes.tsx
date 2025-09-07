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
import EditProfile from "@/components/profile/EditProfile";

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

            {/* protected routes */}
            <Route
              path="/profile"
              element={
                <PrivateRoute>
                  <ProfileMenu />
                </PrivateRoute>
              }
            />
            <Route path="/profile/edit" element={<EditProfile />} />

            {/* Properties */}
            {/* <Route path="/proprties" element={<PropertyListPage/>}/> 
            <Route path="/properties/:id" elemen={<PropertyDetailPage/>}/>
            <Route path="/properties/create" element={<PrivateRoute><PropertyCreatePage/></PrivateRoute>}/>
            <Route path="/properties/:id/edit" element={<PrivateRoute><PropertyEditPage/></PrivateRoute>}*/}

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
