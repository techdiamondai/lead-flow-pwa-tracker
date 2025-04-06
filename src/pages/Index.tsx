
import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <header className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-700">LeadFlow CRM</h1>
          {isAuthenticated ? (
            <Button asChild>
              <Link to="/dashboard">Go to Dashboard</Link>
            </Button>
          ) : (
            <Button asChild>
              <Link to="/login">Login</Link>
            </Button>
          )}
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Manage Leads Effectively with LeadFlow CRM
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            A powerful lead management system with offline capabilities and complete version history.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {isAuthenticated ? (
              <Button size="lg" asChild>
                <Link to="/dashboard">Go to Dashboard</Link>
              </Button>
            ) : (
              <Button size="lg" asChild>
                <Link to="/login">Get Started</Link>
              </Button>
            )}
          </div>
        </div>
        
        <div className="mt-16 grid md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold mb-3 text-gray-900">Lead Management</h3>
            <p className="text-gray-600">
              Track customer information, contact details, and lead progression through multiple stages.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold mb-3 text-gray-900">Version History</h3>
            <p className="text-gray-600">
              Keep a complete history of all lead changes with full audit trail of who made which changes.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold mb-3 text-gray-900">Offline Access</h3>
            <p className="text-gray-600">
              Access and modify leads even without an internet connection. Changes sync when back online.
            </p>
          </div>
        </div>
        
        <div className="mt-16 text-center">
          <h3 className="text-2xl font-bold mb-6">Ready to transform your lead management?</h3>
          {isAuthenticated ? (
            <Button size="lg" asChild>
              <Link to="/dashboard">Go to Dashboard</Link>
            </Button>
          ) : (
            <Button size="lg" asChild>
              <Link to="/login">Login Now</Link>
            </Button>
          )}
        </div>
      </main>
    </div>
  );
};

export default Index;
