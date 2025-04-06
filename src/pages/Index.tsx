
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  ChevronDown, 
  Users, 
  LineChart, 
  BarChart3, 
  ArrowRight, 
  Check, 
  LayoutDashboard,
  ShieldCheck
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const Index: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="flex flex-col min-h-[calc(100vh-64px)]">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50/30 to-purple-50/30" />
        <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-blue-400/30 to-indigo-500/30 rounded-full filter blur-3xl opacity-80 -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-indigo-400/30 to-purple-500/30 rounded-full filter blur-3xl opacity-80 translate-y-1/2 -translate-x-1/3" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col items-center text-center max-w-5xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent mb-6">
              Effortlessly Manage Your Leads and Drive Growth
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl">
              LeadFlow CRM helps you track, nurture, and convert leads with powerful tools designed to streamline your sales process and boost conversion rates.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              {isAuthenticated ? (
                <Button asChild size="lg" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                  <Link to="/dashboard">
                    Go to Dashboard
                    <LayoutDashboard className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              ) : (
                <>
                  <Button asChild size="lg" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                    <Link to="/login">
                      Get Started
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                  <Button asChild size="lg" variant="outline">
                    <Link to="/register">
                      Create Account
                    </Link>
                  </Button>
                </>
              )}
            </div>
            <div className="mt-12">
              <Button variant="ghost" size="sm" className="flex items-center text-gray-500 gap-1">
                Explore Features
                <ChevronDown className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Everything You Need to Convert Leads</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our comprehensive set of tools helps you track leads from first contact to closed deal
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-blue-50 to-white p-6 rounded-xl shadow-sm border border-blue-100">
              <div className="bg-blue-100 text-blue-700 p-3 rounded-lg w-12 h-12 flex items-center justify-center mb-4">
                <Users className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Lead Management</h3>
              <p className="text-gray-600">
                Easily organize, track, and manage your leads through every stage of your sales pipeline
              </p>
            </div>

            <div className="bg-gradient-to-br from-indigo-50 to-white p-6 rounded-xl shadow-sm border border-indigo-100">
              <div className="bg-indigo-100 text-indigo-700 p-3 rounded-lg w-12 h-12 flex items-center justify-center mb-4">
                <LineChart className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Sales Analytics</h3>
              <p className="text-gray-600">
                Gain valuable insights with detailed analytics on your sales performance and lead conversion
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-white p-6 rounded-xl shadow-sm border border-purple-100">
              <div className="bg-purple-100 text-purple-700 p-3 rounded-lg w-12 h-12 flex items-center justify-center mb-4">
                <BarChart3 className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Performance Tracking</h3>
              <p className="text-gray-600">
                Monitor team performance, identify bottlenecks, and optimize your sales process
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Security & Login Section */}
      <section className="py-16 bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="mb-6 mx-auto bg-blue-100 text-blue-700 p-3 rounded-full w-16 h-16 flex items-center justify-center">
              <ShieldCheck className="h-8 w-8" />
            </div>
            <h2 className="text-3xl font-bold mb-4">Secure Authentication System</h2>
            <p className="text-gray-600 mb-8">
              Our platform features robust user authentication with JWT security, role-based access control, and account management
            </p>
            
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <Check className="h-5 w-5 text-green-500" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-lg font-semibold">User Registration</h3>
                    <p className="text-gray-600 text-sm">Create new accounts with secure password hashing</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <Check className="h-5 w-5 text-green-500" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-lg font-semibold">Password Recovery</h3>
                    <p className="text-gray-600 text-sm">Easy password reset functionality</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <Check className="h-5 w-5 text-green-500" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-lg font-semibold">Role-Based Access</h3>
                    <p className="text-gray-600 text-sm">Admin and user role separation</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <Check className="h-5 w-5 text-green-500" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-lg font-semibold">Protected Routes</h3>
                    <p className="text-gray-600 text-sm">Secure access to authorized content</p>
                  </div>
                </div>
              </div>
              
              {!isAuthenticated && (
                <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
                  <Button asChild>
                    <Link to="/login">Login to Your Account</Link>
                  </Button>
                  <Button asChild variant="outline">
                    <Link to="/register">Create New Account</Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Streamline Your Lead Management?</h2>
          <p className="mb-8 max-w-2xl mx-auto">
            Join thousands of businesses that use LeadFlow CRM to convert more leads and grow their sales.
          </p>
          {isAuthenticated ? (
            <Button asChild size="lg" variant="secondary">
              <Link to="/dashboard">Go to Dashboard</Link>
            </Button>
          ) : (
            <Button asChild size="lg" variant="secondary">
              <Link to="/register">Get Started For Free</Link>
            </Button>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold text-white mb-4">LeadFlow CRM</h3>
              <p className="text-gray-400">
                Powerful lead management solution for growing businesses
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Features</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white">Lead Management</a></li>
                <li><a href="#" className="hover:text-white">Sales Pipeline</a></li>
                <li><a href="#" className="hover:text-white">Analytics</a></li>
                <li><a href="#" className="hover:text-white">Reporting</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Company</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white">About Us</a></li>
                <li><a href="#" className="hover:text-white">Careers</a></li>
                <li><a href="#" className="hover:text-white">Contact</a></li>
                <li><a href="#" className="hover:text-white">Blog</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Support</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white">Help Center</a></li>
                <li><a href="#" className="hover:text-white">Documentation</a></li>
                <li><a href="#" className="hover:text-white">API</a></li>
                <li><a href="#" className="hover:text-white">Status</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} LeadFlow CRM. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
