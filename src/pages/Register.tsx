
import React from "react";
import { RegisterForm } from "@/components/RegisterForm";
import { AuthLayout } from "@/components/AuthLayout";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from "lucide-react";

const Register: React.FC = () => {
  return (
    <AuthLayout 
      title="Create an account"
      subtitle="Join DiamondFlow CRM"
    >
      <div className="space-y-6">
        <Alert className="bg-blue-50 border-blue-200">
          <Info className="h-4 w-4 text-blue-600" />
          <AlertTitle className="text-blue-700">Information</AlertTitle>
          <AlertDescription className="text-blue-600">
            Admin accounts are created by system administrators only. This registration form is for standard user accounts.
          </AlertDescription>
        </Alert>
        
        <RegisterForm />
      </div>
    </AuthLayout>
  );
};

export default Register;
