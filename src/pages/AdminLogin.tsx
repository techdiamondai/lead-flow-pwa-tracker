
import React from "react";
import { AdminLoginForm } from "@/components/AdminLoginForm";
import { AuthLayout } from "@/components/AuthLayout";

const AdminLogin: React.FC = () => {
  return (
    <AuthLayout 
      title="Admin Access Only"
      subtitle="Enter your admin credentials to access the system"
    >
      <AdminLoginForm />
    </AuthLayout>
  );
};

export default AdminLogin;
