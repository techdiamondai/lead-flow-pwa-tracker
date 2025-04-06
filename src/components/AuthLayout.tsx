import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ 
  children, 
  title, 
  subtitle 
}) => {
  const { isAuthenticated, isLoading } = useAuth();

  // If already authenticated, redirect to dashboard
  if (isAuthenticated && !isLoading) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="absolute inset-0 bg-white/40 backdrop-blur-3xl" />
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-indigo-50/30 to-purple-50/30" />
      
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-blue-400/30 to-indigo-500/30 rounded-full filter blur-3xl opacity-80 -translate-y-1/2 translate-x-1/3" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-indigo-400/30 to-purple-500/30 rounded-full filter blur-3xl opacity-80 translate-y-1/2 -translate-x-1/3" />
      <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-gradient-to-tr from-purple-300/20 to-pink-400/20 rounded-full filter blur-2xl opacity-70" />
      <div className="absolute bottom-1/4 right-1/4 w-36 h-36 bg-gradient-to-bl from-cyan-300/20 to-blue-400/20 rounded-full filter blur-2xl opacity-70" />
      
      <div className="w-full max-w-md space-y-6 relative z-10">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            DiamondFlow
          </h1>
          <p className="text-gray-500 mt-2">{subtitle || title}</p>
        </div>
        
        {children}
      </div>
    </div>
  );
};
