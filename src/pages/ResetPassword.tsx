
import React from "react";
import { ResetPasswordForm } from "@/components/ResetPasswordForm";
import { AuthLayout } from "@/components/AuthLayout";

const ResetPassword: React.FC = () => {
  return (
    <AuthLayout 
      title="Create a new password"
      subtitle="Enter your new secure password"
    >
      <ResetPasswordForm />
    </AuthLayout>
  );
};

export default ResetPassword;
