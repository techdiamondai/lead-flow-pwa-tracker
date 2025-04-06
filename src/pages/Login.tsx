
import React from "react";
import { Navigate } from "react-router-dom";
import { LoginForm } from "@/components/LoginForm";
import { useAuth } from "@/contexts/AuthContext";

const Login: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();

  // If already authenticated, redirect to dashboard
  if (isAuthenticated && !isLoading) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold">LeadFlow CRM</h1>
          <p className="text-gray-500 mt-2">Sign in to your account</p>
        </div>
        
        <LoginForm />
      </div>
    </div>
  );
};

export default Login;
