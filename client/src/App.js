// App.js
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Properties from "./pages/Properties";
import Tenants from "./pages/Tenants";
import Landlords from "./pages/Landlords";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import { AuthProvider, useAuth } from "./context/AuthContext";

const queryClient = new QueryClient();

// ProtectedRoute component to guard routes
function ProtectedRoute({ children }) {
  const { isLoggedIn } = useAuth();
  return isLoggedIn ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Toaster position="top-right" />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="properties" element={<Properties />} />
            <Route path="tenants" element={<Tenants />} />
            <Route path="landlords" element={<Landlords />} />
          </Route>
        </Routes>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
