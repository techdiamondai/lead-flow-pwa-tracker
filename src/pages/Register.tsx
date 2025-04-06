import React from "react";
import { RegisterForm } from "@/components/RegisterForm";
import { AuthLayout } from "@/components/AuthLayout";

const Register: React.FC = () => {
  return (
    <AuthLayout 
      title="Create a new account"
      subtitle="Join DiamondFlow"
    >
      <RegisterForm />
    </AuthLayout>
  );
};

export default Register;
