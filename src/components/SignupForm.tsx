
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";

const SignupForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="bg-gradient-to-r from-red-50 to-blue-50 p-8 rounded-3xl max-w-md mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold">Get started with your</h2>
        <h2 className="text-2xl font-bold">15-day free trial</h2>
      </div>
      
      <form className="space-y-4">
        <div>
          <Input type="text" placeholder="Full Name" className="h-12 rounded-lg" />
        </div>
        
        <div>
          <Input type="email" placeholder="Email" className="h-12 rounded-lg" />
        </div>
        
        <div className="relative">
          <Input 
            type={showPassword ? "text" : "password"} 
            placeholder="Password" 
            className="h-12 rounded-lg pr-10" 
          />
          <button 
            type="button"
            className="absolute right-3 top-1/2 transform -translate-y-1/2"
            onClick={togglePasswordVisibility}
          >
            {showPassword ? (
              <EyeOff className="h-5 w-5 text-gray-400" />
            ) : (
              <Eye className="h-5 w-5 text-gray-400" />
            )}
          </button>
        </div>
        
        <div className="flex">
          <div className="w-1/4 bg-gray-100 border border-gray-200 rounded-l-lg flex items-center justify-center">
            <span className="text-gray-700">+880</span>
          </div>
          <Input type="tel" placeholder="Phone" className="h-12 rounded-l-none rounded-r-lg" />
        </div>
        
        <div className="text-sm text-gray-600">
          <p>It looks like you're in BANGLADESH based on your IP.</p>
          <p>Your data will be stored in the US data center.</p>
        </div>
        
        <div className="flex items-start gap-2">
          <input 
            type="checkbox" 
            id="terms" 
            className="mt-1"
            checked={acceptTerms}
            onChange={() => setAcceptTerms(!acceptTerms)}
          />
          <label htmlFor="terms" className="text-sm">
            I agree to the <a href="#" className="text-blue-600 font-medium">Terms of Service</a> and <a href="#" className="text-blue-600 font-medium">Privacy Policy</a>.
          </label>
        </div>
        
        <Button type="submit" className="w-full h-12 text-lg bg-red-600 hover:bg-red-700">
          GET STARTED
        </Button>
        
        <div className="text-center text-sm text-gray-600">
          <p className="mb-4">or sign in using</p>
          <div className="flex justify-center space-x-4">
            <a href="#" className="flex items-center justify-center w-10 h-10 bg-white rounded-full border border-gray-200">
              <img src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" alt="Google" className="w-5 h-5" />
            </a>
            <a href="#" className="flex items-center justify-center w-10 h-10 bg-[#0A66C2] rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="white">
                <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
              </svg>
            </a>
          </div>
        </div>
      </form>
    </div>
  );
};

export default SignupForm;
