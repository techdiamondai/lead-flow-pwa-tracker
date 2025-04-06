
import React from "react";
import { ForgotPasswordForm } from "@/components/ForgotPasswordForm";
import { AuthLayout } from "@/components/AuthLayout";

const ForgotPassword: React.FC = () => {
  return (
    <AuthLayout 
      title="Reset your password"
      subtitle="We'll send you a reset link"
    >
      <ForgotPasswordForm />
    </AuthLayout>
  );
};

export default ForgotPassword;
