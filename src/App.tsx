
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ToastProvider } from "@/hooks/toast";
import { AuthProvider } from "@/hooks/auth";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import MainLayout from "@/layouts/MainLayout";
import React from "react";

// Pages
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Dashboard from "./pages/Dashboard";
import LeadsPage from "./pages/LeadsPage";
import LeadDetailPage from "./pages/LeadDetailPage";
import NewLeadPage from "./pages/NewLeadPage";
import EditLeadPage from "./pages/EditLeadPage";
import Admin from "./pages/Admin";
import UserManagement from "./pages/UserManagement";
import NotFound from "./pages/NotFound";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
      staleTime: 10000,
    },
  },
});

const App = () => {
  console.log("App rendering");
  
  return (
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <ToastProvider>
          <TooltipProvider>
            <BrowserRouter>
              <AuthProvider>
                <Routes>
                  <Route path="/" element={<MainLayout />}>
                    {/* Public routes */}
                    <Route index element={<Index />} />
                    <Route path="login" element={<Login />} />
                    <Route path="register" element={<Register />} />
                    <Route path="forgot-password" element={<ForgotPassword />} />
                    <Route path="reset-password" element={<ResetPassword />} />
                    
                    {/* Protected routes */}
                    <Route path="dashboard" element={
                      <ProtectedRoute>
                        <Dashboard />
                      </ProtectedRoute>
                    } />
                    
                    <Route path="leads" element={
                      <ProtectedRoute>
                        <LeadsPage />
                      </ProtectedRoute>
                    } />
                    
                    <Route path="leads/new" element={
                      <ProtectedRoute>
                        <NewLeadPage />
                      </ProtectedRoute>
                    } />
                    
                    <Route path="leads/:id" element={
                      <ProtectedRoute>
                        <LeadDetailPage />
                      </ProtectedRoute>
                    } />
                    
                    <Route path="leads/:id/edit" element={
                      <ProtectedRoute>
                        <EditLeadPage />
                      </ProtectedRoute>
                    } />
                    
                    <Route path="admin" element={
                      <ProtectedRoute requireAdmin>
                        <Admin />
                      </ProtectedRoute>
                    } />
                    
                    <Route path="admin/users" element={
                      <ProtectedRoute requireAdmin>
                        <UserManagement />
                      </ProtectedRoute>
                    } />
                    
                    {/* Catch-all route */}
                    <Route path="*" element={<NotFound />} />
                  </Route>
                </Routes>
                <Toaster />
                <Sonner />
              </AuthProvider>
            </BrowserRouter>
          </TooltipProvider>
        </ToastProvider>
      </QueryClientProvider>
    </React.StrictMode>
  );
};

export default App;
