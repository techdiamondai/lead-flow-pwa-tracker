
import React from "react";
import { RegisterForm } from "@/components/RegisterForm";
import { SupabaseConnectionStatus } from "@/components/SupabaseConnectionStatus";

const Register: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50">
      <div className="w-full max-w-md mb-4">
        <SupabaseConnectionStatus />
      </div>
      <RegisterForm />
    </div>
  );
};

export default Register;
