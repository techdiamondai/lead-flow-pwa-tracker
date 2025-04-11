
import React from "react";
import { LoginForm } from "@/components/LoginForm";
import { AuthLayout } from "@/components/AuthLayout";

const Login: React.FC = () => {
  return (
    <AuthLayout 
      title="Sign in to your account"
      subtitle="Welcome back to DiamondFlow CRM"
    >
      <LoginForm />
    </AuthLayout>
  );
};

export default Login;
